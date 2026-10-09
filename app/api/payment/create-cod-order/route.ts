import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer, items, note } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Số tiền đơn hàng không hợp lệ." }, { status: 400 });
    }

    const timestampPart = Number(String(Date.now()).slice(-6));
    const randomPart = Math.floor(Math.random() * 90 + 10);
    const orderCode = Number(`${timestampPart}${randomPart}`);
    const formattedOrderCode = `THS-COD-${orderCode}`;

    // Lưu đơn COD vào Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from("orders").insert({
        id: orderCode,
        order_code: formattedOrderCode,
        customer_name: customer?.name || "",
        customer_phone: customer?.phone || "",
        customer_address: customer?.address || "",
        customer_note: note || "",
        items: items || [],
        total_amount: amount,
        payment_method: "cod",
        payment_status: "pending",
      });
    } catch (dbErr) {
      console.warn("Không thể lưu đơn COD vào bảng orders:", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderCode,
      formattedOrderCode,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tạo đơn hàng COD";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
