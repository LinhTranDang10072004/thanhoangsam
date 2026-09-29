"use client";

import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";

type Form = { name: string; phone: string; message: string };

export default function ContactForm() {
  const [form, setForm] = useState<Form>({ name: "", phone: "", message: "" });
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (form.name.trim().length < 2 || form.message.trim().length < 8) {
      setError("Nhập họ tên và nội dung cần hỏi (ít nhất một câu).");
      return;
    }
    setError("");
    const body = `Họ tên: ${form.name.trim()}\nĐiện thoại: ${form.phone.trim() || "(không để lại)"}\n\n${form.message.trim()}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Liên hệ Thanh Hoàng Sâm")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <div className="card space-y-4 p-6">
        <h2 className="text-2xl font-extrabold text-[var(--red)]">Gặp shop</h2>
        <p className="flex gap-2">
          <MapPin className="mt-1 shrink-0 text-[var(--red)]" size={20} /> {site.address}
        </p>
        <p className="flex gap-2">
          <Phone className="mt-1 shrink-0 text-[var(--red)]" size={20} />
          <a href={`tel:${site.phoneTel}`} className="font-bold text-[var(--red)]">
            {site.phoneDisplay}
          </a>
        </p>
        <p className="flex gap-2">
          <Mail className="mt-1 shrink-0 text-[var(--red)]" size={20} />
          <a href={`mailto:${site.email}`} className="font-bold text-[var(--red)]">
            {site.email}
          </a>
        </p>
        <p>Giờ làm việc: {site.hours}</p>
        <a className="btn-gold" href={`https://zalo.me/${site.phoneTel}`} target="_blank" rel="noreferrer">
          Nhắn Zalo
        </a>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-6" noValidate>
        <h2 className="text-2xl font-extrabold text-[var(--red)]">Gửi lời nhắn</h2>
        <p>Nút gửi mở ứng dụng email trên máy, kèm sẵn nội dung bác vừa viết.</p>
        <label className="block">
          Họ tên
          <input className="field mt-1" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="block">
          Số điện thoại
          <input className="field mt-1" inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        <label className="block">
          Nội dung
          <textarea className="field mt-1" rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
        </label>
        {error && <p className="font-semibold text-[var(--red)]">{error}</p>}
        <button type="submit" className="btn-red">
          Soạn email
        </button>
      </form>
    </div>
  );
}
