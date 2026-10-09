import { NextResponse } from "next/server";
import { verifyAdminUser } from "@/lib/auth-server";
import { createAdminClient } from "@/lib/supabase/server";

export interface OrderItem {
  name: string;
  variant?: string;
  qty: number;
  price: number;
  total: number;
}

export interface OrderRecord {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note?: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  payment_status: "pending" | "paid" | "cancelled";
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

// GET: Lấy danh sách đơn hàng & Thống kê doanh thu theo Ngày / Tháng / Năm
export async function GET(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const adminClient = createAdminClient();
    const { data: rawOrders, error } = await adminClient
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Lỗi đọc bảng orders:", error.message);
      // Trả về mảng rỗng nếu bảng chưa tạo
      return NextResponse.json({ orders: [], stats: null, tableNotCreated: true });
    }

    const orders = (rawOrders || []) as OrderRecord[];

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const thisMonthStr = now.toISOString().slice(0, 7); // YYYY-MM
    const thisYearStr = String(now.getFullYear()); // YYYY

    let totalRevenue = 0;
    let paidOrdersCount = 0;
    let pendingOrdersCount = 0;

    let todayRevenue = 0;
    let todayOrdersCount = 0;

    let thisMonthRevenue = 0;
    let thisMonthOrdersCount = 0;

    let thisYearRevenue = 0;
    let thisYearOrdersCount = 0;

    const dailyRevenueMap: Record<string, { revenue: number; count: number }> = {};
    const monthlyRevenueMap: Record<string, { revenue: number; count: number }> = {};
    const yearlyRevenueMap: Record<string, { revenue: number; count: number }> = {};

    orders.forEach((ord) => {
      const isPaid = ord.payment_status === "paid";
      const amount = Number(ord.total_amount) || 0;
      const createdDate = ord.created_at ? ord.created_at.slice(0, 10) : todayStr;
      const createdMonth = createdDate.slice(0, 7);
      const createdYear = createdDate.slice(0, 4);

      if (isPaid) {
        totalRevenue += amount;
        paidOrdersCount++;

        // Theo ngày
        if (createdDate === todayStr) {
          todayRevenue += amount;
          todayOrdersCount++;
        }
        if (!dailyRevenueMap[createdDate]) dailyRevenueMap[createdDate] = { revenue: 0, count: 0 };
        dailyRevenueMap[createdDate].revenue += amount;
        dailyRevenueMap[createdDate].count++;

        // Theo tháng
        if (createdMonth === thisMonthStr) {
          thisMonthRevenue += amount;
          thisMonthOrdersCount++;
        }
        if (!monthlyRevenueMap[createdMonth]) monthlyRevenueMap[createdMonth] = { revenue: 0, count: 0 };
        monthlyRevenueMap[createdMonth].revenue += amount;
        monthlyRevenueMap[createdMonth].count++;

        // Theo năm
        if (createdYear === thisYearStr) {
          thisYearRevenue += amount;
          thisYearOrdersCount++;
        }
        if (!yearlyRevenueMap[createdYear]) yearlyRevenueMap[createdYear] = { revenue: 0, count: 0 };
        yearlyRevenueMap[createdYear].revenue += amount;
        yearlyRevenueMap[createdYear].count++;
      } else {
        pendingOrdersCount++;
      }
    });

    const stats = {
      totalRevenue,
      paidOrdersCount,
      pendingOrdersCount,
      totalOrdersCount: orders.length,
      todayRevenue,
      todayOrdersCount,
      thisMonthRevenue,
      thisMonthOrdersCount,
      thisYearRevenue,
      thisYearOrdersCount,
      dailyBreakdown: dailyRevenueMap,
      monthlyBreakdown: monthlyRevenueMap,
      yearlyBreakdown: yearlyRevenueMap,
    };

    return NextResponse.json({ orders, stats });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tải thống kê đơn hàng";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT: Cập nhật trạng thái thanh toán của đơn hàng (Ví dụ duyệt đơn COD đã trả tiền)
export async function PUT(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { id, payment_status } = body;

    if (!id || !payment_status) {
      return NextResponse.json({ error: "Thiếu ID hoặc trạng thái đơn hàng." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const updatePayload: Record<string, unknown> = {
      payment_status,
      updated_at: new Date().toISOString(),
    };
    if (payment_status === "paid") {
      updatePayload.paid_at = new Date().toISOString();
    }

    const { data, error } = await adminClient
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật đơn hàng";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
