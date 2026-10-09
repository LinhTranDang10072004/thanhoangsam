import { NextResponse } from "next/server";
import { payOS } from "@/lib/payos";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCodeStr = searchParams.get("orderCode");

    if (!orderCodeStr) {
      return NextResponse.json({ error: "Thiếu orderCode" }, { status: 400 });
    }

    const orderCode = Number(orderCodeStr);

    // 1. Kiểm tra trực tiếp từ PayOS thời gian thực
    try {
      const paymentInfo = await payOS.paymentRequests.get(orderCode);
      if (paymentInfo.status === "PAID") {
        // Cập nhật DB nếu cần
        try {
          const supabase = createAdminClient();
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderCode);
        } catch {
          // Bỏ qua lỗi DB
        }

        return NextResponse.json({
          status: "PAID",
          paid: true,
          amountPaid: paymentInfo.amountPaid,
          transaction: paymentInfo.transactions?.[0] || null,
        });
      }

      return NextResponse.json({
        status: paymentInfo.status,
        paid: false,
      });
    } catch (payosErr) {
      // 2. Dự phòng: Kiểm tra từ Supabase DB
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("id", orderCode)
        .single();

      if (data?.payment_status === "paid") {
        return NextResponse.json({ status: "PAID", paid: true });
      }

      return NextResponse.json({ status: "PENDING", paid: false });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
