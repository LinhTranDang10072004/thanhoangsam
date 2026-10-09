import { NextResponse } from "next/server";
import { payOS } from "@/lib/payos";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer, items, note } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Số tiền đơn hàng không hợp lệ." }, { status: 400 });
    }

    // Tạo mã đơn hàng số nguyên ngẫu nhiên cho PayOS (giới hạn an toàn)
    // PayOS yêu cầu orderCode là số nguyên dương
    const timestampPart = Number(String(Date.now()).slice(-6));
    const randomPart = Math.floor(Math.random() * 90 + 10);
    const orderCode = Number(`${timestampPart}${randomPart}`);
    const formattedOrderCode = `THS-${orderCode}`;

    const host = request.headers.get("host") || "thanhhoangsam.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    // Nội dung chuyển khoản: tối đa 25 ký tự không dấu
    const description = `THS ${String(orderCode).slice(-6)}`;

    // 1. Tạo link thanh toán PayOS
    const paymentLink = await payOS.paymentRequests.create({
      orderCode,
      amount: Math.round(amount),
      description,
      returnUrl: `${origin}/gio-hang?status=success&orderCode=${orderCode}`,
      cancelUrl: `${origin}/gio-hang?status=cancelled&orderCode=${orderCode}`,
    });

    // 2. Thử lưu đơn hàng vào Supabase nếu bảng orders đã tạo
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
        payment_method: "vietqr",
        payment_status: "pending",
        payos_payment_link_id: paymentLink.paymentLinkId || "",
        payos_checkout_url: paymentLink.checkoutUrl || "",
        payos_qr_code: paymentLink.qrCode || "",
      });
    } catch (dbErr) {
      console.warn("Không thể lưu bảng orders (bảng có thể chưa tạo):", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderCode,
      formattedOrderCode,
      amount: paymentLink.amount,
      bin: paymentLink.bin,
      accountNumber: paymentLink.accountNumber,
      accountName: paymentLink.accountName,
      description: paymentLink.description,
      checkoutUrl: paymentLink.checkoutUrl,
      qrCode: paymentLink.qrCode,
    });
  } catch (err: unknown) {
    console.error("Lỗi tạo link thanh toán PayOS:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Lỗi tạo link thanh toán VietQR" },
      { status: 500 }
    );
  }
}
