"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { vnd } from "@/lib/data";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";

const payments = [
  { id: "cod", label: "COD – trả khi nhận hàng" },
  { id: "vietqr", label: "VietQR – chuyển khoản" },
  { id: "momo", label: "Momo" },
  { id: "zalopay", label: "ZaloPay" },
] as const;

type Form = { name: string; phone: string; address: string; note: string; payment: string };
type Order = Form & { id: string; total: number; summary: string };

const empty: Form = { name: "", phone: "", address: "", note: "", payment: "cod" };

export default function CartView() {
  const { lines, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Partial<Form> = {};
    if (form.name.trim().length < 2) next.name = "Nhập họ tên.";
    if (!/^0\d{9}$/.test(form.phone.replace(/\s/g, ""))) next.phone = "Số điện thoại 10 số, bắt đầu bằng 0.";
    if (form.address.trim().length < 8) next.address = "Nhập địa chỉ nhận hàng.";
    setErrors(next);
    if (Object.keys(next).length || lines.length === 0) return;

    const id = `THS-${Date.now().toString().slice(-8)}`;
    const payment = payments.find((item) => item.id === form.payment)?.label ?? form.payment;
    const summary = [
      `Đơn ${id}`,
      ...lines.map((line) => `${line.product.name} – ${line.variant} x${line.qty}: ${vnd(line.total)}`),
      `Tổng hàng: ${vnd(total)}`,
      `Người nhận: ${form.name.trim()} – ${form.phone.trim()}`,
      `Địa chỉ: ${form.address.trim()}`,
      `Thanh toán: ${payment}`,
      form.note.trim() ? `Ghi chú: ${form.note.trim()}` : "",
      "Phí ship báo khi shop gọi xác nhận.",
    ]
      .filter(Boolean)
      .join("\n");

    setOrder({ ...form, id, total, summary });
    clear();
  }

  async function copySummary() {
    if (!order) return;
    await navigator.clipboard.writeText(order.summary);
    setCopied(true);
  }

  if (order) {
    const online = order.payment !== "cod";
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="section-title">Đã ghi nhận đơn</h1>
        <div className="gold-line" />
        <div className="card p-6">
          <p className="text-2xl font-extrabold text-[var(--red)]">Mã đơn {order.id}</p>
          <p className="mt-3">
            Shop sẽ gọi số <b>{order.phone}</b> trong giờ làm việc để chốt đơn và báo phí ship. Tiền chưa bị trừ.
          </p>
          {online && (
            <p className="mt-2">
              Với {payments.find((item) => item.id === order.payment)?.label}, nhân viên gửi nội dung chuyển khoản sau khi nghe máy. Chưa cần chuyển trước.
            </p>
          )}
          <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--cream)] p-4 text-base whitespace-pre-wrap">{order.summary}</pre>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn-gold" onClick={copySummary}>
              {copied ? "Đã chép" : "Chép nội dung đơn"}
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title">Giỏ hàng</h1>
      <div className="gold-line" />
      {lines.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-xl">Giỏ đang trống.</p>
          <Link href="/san-pham" className="btn-gold mt-6">
            Chọn sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            {lines.map((line) => (
              <article key={`${line.slug}-${line.variant}`} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Link href={`/san-pham/${line.slug}`} className="text-xl font-bold text-[var(--red)]">
                    {line.product.name}
                  </Link>
                  <p>
                    {line.variant} • {vnd(line.unit)}
                  </p>
                  {line.rate > 0 && (
                    <p className="font-semibold text-green-700">
                      Giảm {line.rate * 100}% (−{vnd(line.save)})
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Giảm" className="h-10 w-10 rounded-full border-2 border-[var(--gold)]" onClick={() => setQty(line.slug, line.variant, line.qty - 1)}>
                    −
                  </button>
                  <span className="w-8 text-center font-bold">{line.qty}</span>
                  <button type="button" aria-label="Tăng" className="h-10 w-10 rounded-full border-2 border-[var(--gold)]" onClick={() => setQty(line.slug, line.variant, line.qty + 1)}>
                    +
                  </button>
                </div>
                <p className="min-w-32 font-extrabold text-[var(--red)]">{vnd(line.total)}</p>
                <button type="button" aria-label="Xóa sản phẩm" className="text-[var(--red)]" onClick={() => remove(line.slug, line.variant)}>
                  <Trash2 size={20} />
                </button>
              </article>
            ))}
          </div>

          <form onSubmit={submit} className="card space-y-4 p-6" noValidate>
            <h2 className="text-2xl font-extrabold text-[var(--red)]">Thông tin nhận hàng</h2>
            <label className="block">
              Họ tên
              <input className="field mt-1" value={form.name} onChange={(event) => update("name", event.target.value)} />
              {errors.name && <span className="text-sm text-[var(--red)]">{errors.name}</span>}
            </label>
            <label className="block">
              Số điện thoại
              <input className="field mt-1" inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
              {errors.phone && <span className="text-sm text-[var(--red)]">{errors.phone}</span>}
            </label>
            <label className="block">
              Địa chỉ
              <textarea className="field mt-1" rows={3} value={form.address} onChange={(event) => update("address", event.target.value)} />
              {errors.address && <span className="text-sm text-[var(--red)]">{errors.address}</span>}
            </label>
            <fieldset>
              <legend className="font-bold">Thanh toán</legend>
              <div className="mt-2 space-y-2">
                {payments.map((item) => (
                  <label key={item.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.payment === item.id}
                      onChange={() => update("payment", item.id)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block">
              Ghi chú
              <textarea className="field mt-1" rows={2} value={form.note} onChange={(event) => update("note", event.target.value)} />
            </label>
            <p className="text-3xl font-extrabold text-[var(--red)]">{vnd(total)}</p>
            <p className="text-sm">Giá trên là tiền hàng. Phí ship tính theo địa chỉ khi shop gọi xác nhận.</p>
            <button type="submit" className="btn-gold btn-block">
              Đặt hàng
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
