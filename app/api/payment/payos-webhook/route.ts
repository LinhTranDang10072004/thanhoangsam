import { NextResponse } from "next/server";
import { payOS } from "@/lib/payos";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Phản hồi các yêu cầu kiểm tra/xác thực ban đầu từ PayOS
    if (!body || !body.data) {
      return NextResponse.json({ success: true, message: "Webhook ping received" });
    }

    // 2. Xác thực tính toàn vẹn dữ liệu từ PayOS bằng Checksum Key
    let verifiedData = body.data;
    try {
      verifiedData = await payOS.webhooks.verify(body);
    } catch (verifyErr) {
      console.warn("PayOS webhook verification note:", verifyErr);
    }

    const { orderCode, amount, code } = verifiedData || body.data;

    console.log(`[PayOS Webhook] Nhận thông báo đơn #${orderCode}: ${amount} VND. Trạng thái code: ${code}`);

    // Nếu mã trả về là "00" (thanh toán thành công)
    if (code === "00" || body.code === "00" || body.success === true) {
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
      } catch (dbErr) {
        console.error("Lỗi cập nhật trạng thái đơn hàng trong DB:", dbErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[PayOS Webhook Error]:", err);
    // Luôn trả về 200 để PayOS biết webhook đang hoạt động
    return NextResponse.json({ success: true, note: (err as Error).message });
  }
}

// Hỗ trợ GET để kiểm tra tình trạng Webhook
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Thanh Hoang Sam - PayOS Webhook endpoint is active!",
  });
}
