"use client";

import { useState } from "react";
import { findLot, lots, type Lot } from "@/lib/data";

const certs = ["COA – Kiểm nghiệm", "Cục An toàn thực phẩm", "VietGAP", "ISO 22000"];

export default function TraceLookup() {
  const [code, setCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [lot, setLot] = useState<Lot | null>(null);

  function check() {
    setSearched(true);
    setLot(findLot(code));
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {certs.map((cert) => (
          <div key={cert} className="rounded-2xl border-2 border-[var(--gold)] bg-white p-5 text-center">
            <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-[var(--gold-light)] text-4xl">📜</div>
            <p className="font-bold text-[var(--red)]">{cert}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm">
        Ảnh giấy tờ phía trên là vị trí trưng bày. Khi có bản scan thật, thay vào từng ô để khách đối chiếu.
      </p>

      <div className="mt-12 rounded-3xl bg-[var(--red)] p-8 text-center text-white">
        <h2 className="text-2xl font-bold text-[var(--gold)]">Tra cứu lô hàng</h2>
        <p className="mt-1">Nhập đúng mã in trên bao bì. Mã không có trong sổ sẽ không được báo là đạt.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") check();
            }}
            placeholder="VD: SB-2026-0915"
            aria-label="Mã lô"
            className="w-72 rounded-xl px-4 py-3 text-black outline-none"
          />
          <button type="button" className="btn-gold" onClick={check}>
            Kiểm tra
          </button>
        </div>
        <p className="mt-4 text-sm text-[var(--gold-light)]">Mã mẫu: {lots.map((item) => item.code).join(" · ")}</p>
        {searched && lot && (
          <div className="mt-5 rounded-xl bg-white/10 p-4 text-left">
            <p className="font-bold text-[var(--gold)]">Tìm thấy lô {lot.code}</p>
            <p>Sản phẩm: {lot.product}</p>
            <p>Nơi thu hoạch / chế biến: {lot.place}</p>
            <p>Ngày thu: {lot.harvest}</p>
            <p>Ngày đóng gói: {lot.packed}</p>
            <p className="mt-2">{lot.note}</p>
          </div>
        )}
        {searched && !lot && (
          <p className="mt-5 rounded-xl bg-white/10 p-4">
            Không thấy mã &quot;{code.trim() || "(trống)"}&quot; trong sổ lô. Bác kiểm tra lại chữ in trên bao bì hoặc gọi hotline.
          </p>
        )}
      </div>
    </div>
  );
}
