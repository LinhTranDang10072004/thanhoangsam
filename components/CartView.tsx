"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  Loader2,
  QrCode,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  PhoneCall,
  Clock,
  Lock,
  LogIn,
  UserCheck,
} from "lucide-react";
import { vnd } from "@/lib/data";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";

const payments = [
  {
    id: "vietqr",
    label: "VietQR – Quét mã QR chuyển khoản (Tự động xác nhận sau 2s)",
    badge: "Khuyên dùng - Nhanh nhất",
  },
  {
    id: "cod",
    label: "COD – Trả tiền mặt khi nhận hàng (Shop gọi xác nhận)",
    badge: "Tiền mặt",
  },
] as const;

type Form = { name: string; phone: string; address: string; note: string; payment: string };
type CODOrder = Form & { id: string; total: number; summary: string };

type PayOSPaymentInfo = {
  orderCode: number;
  formattedOrderCode: string;
  amount: number;
  bin: string;
  accountNumber: string;
  accountName: string;
  description: string;
  checkoutUrl: string;
  qrCode?: string;
};

const empty: Form = { name: "", phone: "", address: "", note: "", payment: "vietqr" };

export default function CartView() {
  const { lines, total, setQty, remove, clear } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Form>>({});
  
  // State đơn COD
  const [codOrder, setCodOrder] = useState<CODOrder | null>(null);
  
  // State thanh toán VietQR / PayOS
  const [paymentInfo, setPaymentInfo] = useState<PayOSPaymentInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [pollingError, setPollingError] = useState<string | null>(null);
  
  // Tự động điền thông tin người dùng khi đã đăng nhập
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile?.full_name || (user.user_metadata?.full_name as string) || (user.email ? user.email.split("@")[0] : ""),
        phone: prev.phone || profile?.phone || (user.user_metadata?.phone as string) || "",
        address: prev.address || profile?.address || "",
      }));
    }
  }, [user, profile]);

  // State copy clipboard
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (err) {
      console.error("Không thể copy:", err);
    }
  };

  // 1. Tự động kiểm tra trạng thái thanh toán Real-time khi đang hiển thị mã VietQR
  useEffect(() => {
    if (!paymentInfo || isPaid) return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check-status?orderCode=${paymentInfo.orderCode}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.paid && isSubscribed) {
          setIsPaid(true);
          clearInterval(interval);
          clear(); // Xóa sạch giỏ hàng khi thanh toán thành công
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái đơn:", err);
      }
    }, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [paymentInfo, isPaid, clear]);

  // 2. Submit đặt hàng
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!user) {
      setPollingError("Quý khách vui lòng đăng nhập tài khoản trước khi tiến hành đặt sâm.");
      return;
    }

    const next: Partial<Form> = {};
    if (form.name.trim().length < 2) next.name = "Vui lòng nhập họ và tên.";
    if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      next.phone = "Số điện thoại hợp lệ gồm 10 số (bắt đầu bằng số 0).";
    }
    if (form.address.trim().length < 6) next.address = "Vui lòng nhập địa chỉ nhận hàng chi tiết.";
    
    setErrors(next);
    if (Object.keys(next).length || lines.length === 0) return;

    setIsSubmitting(true);
    setPollingError(null);

    // TRƯỜNG HỢP 1: THANH TOÁN VIETQR THẬT QUA PAYOS
    if (form.payment === "vietqr") {
      try {
        const res = await fetch("/api/payment/create-payment-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            customer: {
              name: form.name.trim(),
              phone: form.phone.trim(),
              address: form.address.trim(),
            },
            note: form.note.trim(),
            items: lines.map((l) => ({
              name: l.product.name,
              variant: l.variant,
              qty: l.qty,
              price: l.unit,
              total: l.total,
            })),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setPollingError(data.error || "Không thể khởi tạo mã QR thanh toán lúc này.");
          setIsSubmitting(false);
          return;
        }

        setPaymentInfo(data);
      } catch (err) {
        console.error("Lỗi gọi API tạo thanh toán:", err);
        setPollingError("Có lỗi xảy ra khi tạo mã VietQR. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // TRƯỜNG HỢP 2: ĐƠN HÀNG COD TRẢ TIỀN MẶT
    const id = `THS-${Date.now().toString().slice(-8)}`;
    const paymentLabel = payments.find((item) => item.id === form.payment)?.label ?? form.payment;
    const summary = [
      `Đơn hàng #${id}`,
      ...lines.map((line) => `${line.product.name} – ${line.variant} x${line.qty}: ${vnd(line.total)}`),
      `Tổng tiền hàng: ${vnd(total)}`,
      `Người nhận: ${form.name.trim()} – ${form.phone.trim()}`,
      `Địa chỉ giao hàng: ${form.address.trim()}`,
      `Phương thức: ${paymentLabel}`,
      form.note.trim() ? `Ghi chú: ${form.note.trim()}` : "",
      "Trạng thái: Shop gọi điện xác nhận trước khi giao hàng.",
    ]
      .filter(Boolean)
      .join("\n");

    // Lưu đơn COD vào cơ sở dữ liệu Supabase để Admin quản lý
    try {
      await fetch("/api/payment/create-cod-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
          },
          note: form.note.trim(),
          items: lines.map((l) => ({
            name: l.product.name,
            variant: l.variant,
            qty: l.qty,
            price: l.unit,
            total: l.total,
          })),
        }),
      });
    } catch (saveCodErr) {
      console.warn("Không thể lưu đơn COD vào database:", saveCodErr);
    }

    setCodOrder({ ...form, id, total, summary });
    clear();
    setIsSubmitting(false);
  }

  async function copyCodSummary() {
    if (!codOrder) return;
    await navigator.clipboard.writeText(codOrder.summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  }

  // ========================================================
  // MÀN HÌNH 1: THANH TOÁN VIETQR THÀNH CÔNG (TỰ ĐỘNG XÁC NHẬN)
  // ========================================================
  if (isPaid && paymentInfo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-b from-[#062414] to-black p-8 text-center text-white shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/40">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <span className="mt-6 inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
            GIAO DỊCH ĐÃ ĐƯỢC XÁC NHẬN TỰ ĐỘNG
          </span>

          <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
            Thanh Toán Thành Công!
          </h1>
          <p className="mt-2 text-stone-300 text-sm md:text-base">
            Cảm ơn bạn đã tin tưởng lựa chọn <b>Thanh Hoàng Sâm</b>. Đơn hàng của bạn đã được thanh toán và đang được chuyển sang bộ phận đóng gói.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-left space-y-2.5">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-stone-400 text-sm">Mã đơn hàng:</span>
              <span className="font-bold text-[var(--gold)]">{paymentInfo.formattedOrderCode}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-stone-400 text-sm">Số tiền đã thanh toán:</span>
              <span className="font-extrabold text-emerald-400 text-lg">{vnd(paymentInfo.amount)}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-stone-400 text-sm">Người nhận:</span>
              <span className="text-stone-200">{form.name} ({form.phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400 text-sm">Địa chỉ giao:</span>
              <span className="text-stone-200 max-w-xs text-right text-sm">{form.address}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${site.phoneTel}`}
              className="rounded-xl border border-[var(--gold)] px-6 py-3 text-xs font-bold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition flex items-center gap-2"
            >
              <PhoneCall size={16} />
              <span>Hotline hỗ trợ: {site.phoneDisplay}</span>
            </a>
            <Link href="/san-pham" className="btn-gold !py-3 !px-8 text-xs font-bold">
              Tiếp tục mua hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // MÀN HÌNH 2: MÃ VIETQR ĐỘNG ĐANG CHỜ THANH TOÁN (AUTO CHECK)
  // ========================================================
  if (paymentInfo && !isPaid) {
    const vietQrImgUrl = `https://img.vietqr.io/image/${paymentInfo.bin || "970422"}-${paymentInfo.accountNumber}-compact2.png?amount=${paymentInfo.amount}&addInfo=${encodeURIComponent(paymentInfo.description)}&accountName=${encodeURIComponent(paymentInfo.accountName)}`;

    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl border-2 border-[var(--gold)] bg-gradient-to-b from-[#1f0306] via-[#120103] to-black p-6 sm:p-10 text-white shadow-2xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)]/20 px-4 py-1 text-xs font-bold text-[var(--gold-light)] border border-[var(--gold)]/40">
              <ShieldCheck size={16} className="text-[var(--gold)]" />
              <span>THANH TOÁN TỰ ĐỘNG QUA VIETQR (NAPAS 247)</span>
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-4xl">
              Quét Mã QR Để Thanh Toán
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-300">
              Mở ứng dụng Ngân hàng bất kỳ hoặc MoMo để quét mã. Số tiền và nội dung đã được điền tự động 100%.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 items-center">
            {/* Cột trái: Ảnh Mã QR VietQR chuẩn */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-2xl text-stone-900">
              <div className="relative aspect-square w-64 sm:w-72 overflow-hidden rounded-xl bg-white border border-stone-200 p-2">
                <img
                  src={vietQrImgUrl}
                  alt={`VietQR ${paymentInfo.formattedOrderCode}`}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Trạng thái lắng nghe thời gian thực */}
              <div className="mt-4 flex items-center gap-2.5 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-800 border border-amber-200">
                <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                <span>Đang chờ bạn quét mã & chuyển tiền...</span>
              </div>
              <p className="mt-2 text-[11px] text-stone-500 text-center">
                Màn hình sẽ tự động cập nhật ngay khi tiền vào tài khoản.
              </p>
            </div>

            {/* Cột phải: Thông tin chuyển khoản sao chép tiện lợi */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--gold)]/40 bg-black/40 p-5 space-y-3.5 backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--gold)]">
                  Thông tin chuyển khoản dự phòng
                </h3>

                {/* Ngân hàng */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-stone-400">Ngân hàng:</span>
                  <span className="text-sm font-bold text-white">MBBank (Ngân hàng Quân Đội)</span>
                </div>

                {/* Số tài khoản */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-stone-400">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-[var(--gold-light)] tracking-wide">
                      {paymentInfo.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentInfo.accountNumber, "accountNumber")}
                      className="rounded bg-white/10 px-2 py-1 text-[11px] font-semibold text-white hover:bg-white/20 transition flex items-center gap-1"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === "accountNumber" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === "accountNumber" ? "Đã chép" : "Chép"}</span>
                    </button>
                  </div>
                </div>

                {/* Chủ tài khoản */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-stone-400">Chủ tài khoản:</span>
                  <span className="text-sm font-bold text-white">{paymentInfo.accountName}</span>
                </div>

                {/* Số tiền chính xác */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-stone-400">Số tiền chính xác:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-black text-emerald-400">
                      {vnd(paymentInfo.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(String(paymentInfo.amount), "amount")}
                      className="rounded bg-white/10 px-2 py-1 text-[11px] font-semibold text-white hover:bg-white/20 transition flex items-center gap-1"
                      title="Sao chép số tiền"
                    >
                      {copiedField === "amount" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === "amount" ? "Đã chép" : "Chép"}</span>
                    </button>
                  </div>
                </div>

                {/* Nội dung chuyển khoản */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-400">Nội dung chuyển khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      {paymentInfo.description}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paymentInfo.description, "description")}
                      className="rounded bg-white/10 px-2 py-1 text-[11px] font-semibold text-white hover:bg-white/20 transition flex items-center gap-1"
                      title="Sao chép nội dung"
                    >
                      {copiedField === "description" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === "description" ? "Đã chép" : "Chép"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Nút mở cổng thanh toán PayOS ngoài hoặc quay lại */}
              <div className="space-y-3 pt-2">
                <a
                  href={paymentInfo.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full !py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <span>Mở cổng thanh toán PayOS</span>
                  <ExternalLink size={16} />
                </a>

                <button
                  type="button"
                  onClick={() => setPaymentInfo(null)}
                  className="w-full text-center text-xs text-stone-400 hover:text-white transition py-2 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Quay lại giỏ hàng / Thay đổi thông tin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // MÀN HÌNH 3: ĐÃ GHI NHẬN ĐƠN COD
  // ========================================================
  if (codOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="section-title">Đã ghi nhận đơn</h1>
        <div className="gold-line" />
        <div className="card p-6">
          <p className="text-2xl font-extrabold text-[var(--red)]">Mã đơn {codOrder.id}</p>
          <p className="mt-3">
            Shop sẽ gọi số <b>{codOrder.phone}</b> trong giờ làm việc để chốt đơn và báo phí ship. Tiền chưa bị trừ.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--cream)] p-4 text-base whitespace-pre-wrap">
            {codOrder.summary}
          </pre>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn-gold" onClick={copyCodSummary}>
              {copiedSummary ? "Đã chép" : "Chép nội dung đơn"}
            </button>
            <a className="btn-red" href={`tel:${site.phoneTel}`}>
              Gọi xác nhận
            </a>
            <Link href="/san-pham" className="btn-red">
              Tiếp tục xem sâm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // MÀN HÌNH CHÍNH: GIỎ HÀNG & FORM THANH TOÁN
  // ========================================================
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title">Giỏ hàng</h1>
      <div className="gold-line" />
      {lines.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-xl">Giỏ đang trống.</p>
          <Link href="/san-pham" className="btn-gold mt-6 inline-block">
            Chọn sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Cột danh sách sản phẩm trong giỏ */}
          <div className="space-y-4">
            {lines.map((line) => (
              <article
                key={`${line.slug}-${line.variant}`}
                className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <Link href={`/san-pham/${line.slug}`} className="text-xl font-bold text-[var(--red)] hover:underline">
                    {line.product.name}
                  </Link>
                  <p className="text-sm text-stone-600 mt-0.5">
                    {line.variant} • {vnd(line.unit)}
                  </p>
                  {line.rate > 0 && (
                    <p className="font-semibold text-green-700 text-xs mt-0.5">
                      Giảm {line.rate * 100}% (−{vnd(line.save)})
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Giảm số lượng"
                    className="h-9 w-9 rounded-full border-2 border-[var(--gold)] text-stone-800 hover:bg-[var(--gold)] hover:text-white transition flex items-center justify-center font-bold"
                    onClick={() => setQty(line.slug, line.variant, line.qty - 1)}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold">{line.qty}</span>
                  <button
                    type="button"
                    aria-label="Tăng số lượng"
                    className="h-9 w-9 rounded-full border-2 border-[var(--gold)] text-stone-800 hover:bg-[var(--gold)] hover:text-white transition flex items-center justify-center font-bold"
                    onClick={() => setQty(line.slug, line.variant, line.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="min-w-32 font-extrabold text-[var(--red)] text-right">{vnd(line.total)}</p>
                <button
                  type="button"
                  aria-label="Xóa sản phẩm"
                  className="text-stone-400 hover:text-[var(--red)] transition p-1"
                  onClick={() => remove(line.slug, line.variant)}
                >
                  <Trash2 size={20} />
                </button>
              </article>
            ))}
          </div>

          {/* Cột Form thanh toán */}
          <form onSubmit={submit} className="card space-y-4 p-6 shadow-lg" noValidate>
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-2xl font-extrabold text-[var(--red)]">Thông tin nhận hàng</h2>
              {user && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-300">
                  {profile?.role === "admin" ? "Admin" : "Đã đăng nhập"}
                </span>
              )}
            </div>

            {/* Cảnh báo yêu cầu đăng nhập nếu khách chưa đăng nhập */}
            {!user && !authLoading && (
              <div className="rounded-2xl border-2 border-amber-500/80 bg-gradient-to-r from-amber-950/70 via-amber-900/40 to-black p-4 text-white shadow space-y-2.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
                  <Lock className="h-5 w-5 shrink-0 text-amber-400" />
                  <span>Yêu cầu đăng nhập để mua hàng</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Để đảm bảo quyền lợi tích điểm, bảo hành nguồn gốc sâm và quản lý lịch sử đơn hàng, quý khách vui lòng đăng nhập trước khi tiến hành thanh toán.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/dang-nhap?next=/gio-hang"
                    className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Đăng nhập tài khoản</span>
                  </Link>
                  <Link
                    href="/dang-ky?next=/gio-hang"
                    className="rounded-xl border border-[var(--gold)]/50 bg-black/40 px-3.5 py-2 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508] transition"
                  >
                    Chưa có tài khoản? Đăng ký
                  </Link>
                </div>
              </div>
            )}

            {/* Hiển thị tài khoản đang đăng nhập */}
            {user && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-400/40">
                    ✓
                  </span>
                  <span>
                    Đang đặt hàng với: <b className="text-white">{profile?.full_name || user.email}</b>
                  </span>
                </div>
                <UserCheck size={16} className="text-emerald-400 shrink-0" />
              </div>
            )}

            {pollingError && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                {pollingError}
              </div>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-stone-800">Họ và tên người nhận</span>
              <input
                className="field mt-1"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
              {errors.name && <span className="text-xs text-[var(--red)] font-semibold mt-1 block">{errors.name}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-stone-800">Số điện thoại nhận hàng</span>
              <input
                className="field mt-1"
                inputMode="tel"
                placeholder="Ví dụ: 0392728839"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
              {errors.phone && <span className="text-xs text-[var(--red)] font-semibold mt-1 block">{errors.phone}</span>}
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-stone-800">Địa chỉ giao hàng</span>
              <textarea
                className="field mt-1"
                rows={3}
                placeholder="Số nhà, ngõ/đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
              />
              {errors.address && <span className="text-xs text-[var(--red)] font-semibold mt-1 block">{errors.address}</span>}
            </label>

            {/* Phương thức thanh toán */}
            <fieldset className="pt-2">
              <legend className="text-sm font-bold text-stone-800 mb-2">Phương thức thanh toán</legend>
              <div className="space-y-2.5">
                {payments.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      form.payment === item.id
                        ? "border-[var(--red)] bg-rose-50/50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="mt-1"
                      checked={form.payment === item.id}
                      onChange={() => update("payment", item.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-stone-900">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              item.id === "vietqr"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="text-sm font-semibold text-stone-800">Ghi chú đơn hàng (nếu có)</span>
              <textarea
                className="field mt-1"
                rows={2}
                placeholder="Giao hàng giờ hành chính, bọc kỹ làm quà biếu..."
                value={form.note}
                onChange={(event) => update("note", event.target.value)}
              />
            </label>

            <div className="pt-3 border-t border-stone-100">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-stone-600">Tổng thanh toán:</span>
                <span className="text-3xl font-extrabold text-[var(--red)]">{vnd(total)}</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {form.payment === "vietqr"
                  ? "⚡ Bạn sẽ quét mã QR tự động xác nhận số tiền trên bước tiếp theo."
                  : "Shop sẽ gọi xác nhận đơn hàng trước khi gửi sâm."}
              </p>
            </div>

            {!user && !authLoading ? (
              <Link
                href="/dang-nhap?next=/gio-hang"
                className="btn-gold btn-block !py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition"
              >
                <Lock className="h-4 w-4" />
                <span>Đăng nhập để đặt hàng</span>
              </Link>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold btn-block !py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang kết nối cổng thanh toán...</span>
                  </>
                ) : form.payment === "vietqr" ? (
                  <>
                    <QrCode className="h-5 w-5" />
                    <span>Tạo mã QR & Thanh toán ngay</span>
                  </>
                ) : (
                  <span>Đặt hàng nhận tiền mặt (COD)</span>
                )}
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
