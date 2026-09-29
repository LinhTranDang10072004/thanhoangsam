"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findLot, lots, type Lot } from "@/lib/data";
import { CheckCircle2, MapPin, Calendar, ShieldCheck, ArrowRight, AlertCircle, Search } from "lucide-react";

const certs = [
  { name: "COA – Kiểm nghiệm Dược chất", desc: "Hàm lượng Saponin đạt tiêu chuẩn cao nhất" },
  { name: "Cục An toàn thực phẩm", desc: "Giấy tiếp nhận đăng ký bản công bố sản phẩm" },
  { name: "Tiêu chuẩn VietGAP", desc: "Vùng trồng hữu cơ tại chân núi Báo Vĩnh Lộc" },
  { name: "Hệ thống ISO 22000", desc: "Quy trình sơ chế & bảo quản đạt chuẩn quốc tế" },
];

const lotExtras: Record<string, { sku: string; saponin: string; image: string; slug: string }> = {
  "SB-2026-0915": {
    sku: "THS-ST-01",
    saponin: "18.4 mg/g (Chuẩn Dược điển loại 1)",
    image: "/images/sam-bao-tuoi.jpg",
    slug: "sam-bao-tuoi",
  },
  "SK-2026-0601": {
    sku: "THS-SK-02",
    saponin: "17.2 mg/g (Sấy thăng hoa chân không)",
    image: "/images/sam-bao-kho.jpg",
    slug: "sam-bao-kho",
  },
  "CS-2026-0802": {
    sku: "THS-CS-03",
    saponin: "32.8 mg/g (Cô đặc 72 giờ)",
    image: "/images/cao-sam-bao.jpg",
    slug: "cao-sam-bao",
  },
  "RS-2026-0718": {
    sku: "THS-RS-04",
    saponin: "15.6 mg/g (Ngâm củ sâm 3 năm tuổi)",
    image: "/images/ruou-sam-bao.jpg",
    slug: "ruou-sam-bao",
  },
};

export default function TraceLookup() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [lot, setLot] = useState<Lot | null>(null);

  // Tự động nhận diện mã lô khi khách quét mã QR từ điện thoại
  useEffect(() => {
    const lotParam = searchParams.get("lot");
    if (lotParam) {
      setCode(lotParam);
      setSearched(true);
      setLot(findLot(lotParam));
    }
  }, [searchParams]);

  function check(codeToCheck?: string) {
    const query = (codeToCheck !== undefined ? codeToCheck : code).trim();
    if (!query) return;
    setSearched(true);
    setLot(findLot(query));
  }

  const extra = lot ? lotExtras[lot.code] : null;

  return (
    <div className="space-y-10">
      {/* Khối chứng nhận tiêu chuẩn chất lượng */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {certs.map((cert) => (
          <div
            key={cert.name}
            className="flex flex-col items-center rounded-2xl border-2 border-[var(--gold)]/70 bg-gradient-to-b from-stone-900 to-black p-5 text-center shadow-lg"
          >
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gold)]/20 text-3xl border border-[var(--gold)]/40 shadow-inner">
              📜
            </div>
            <p className="font-heading font-black text-sm text-[var(--gold-light)] uppercase tracking-wide">
              {cert.name}
            </p>
            <p className="mt-1 text-xs text-stone-300">{cert.desc}</p>
          </div>
        ))}
      </div>

      {/* Khung tra cứu mã lô */}
      <div className="rounded-3xl border-2 border-[var(--gold)] bg-gradient-to-b from-[var(--red-dark)] to-[#150204] p-6 sm:p-10 text-white shadow-2xl">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-bold text-[var(--gold-light)] border border-[var(--gold)]/40">
            <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
            <span>HỆ THỐNG XÁC THỰC NGUỒN GỐC ĐIỆN TỬ</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-[var(--gold)] uppercase">
            Tra cứu Số Lô & Nguồn Gốc
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            Mỗi hộp sản phẩm Thanh Hoàng Sâm đều có số lô độc bản in trên tem niêm phong và mã QR. Quét mã hoặc nhập mã lô bên dưới để xác thực.
          </p>
        </div>

        {/* Ô tìm kiếm */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") check();
            }}
            placeholder="Nhập mã lô (VD: SB-2026-0915)..."
            aria-label="Mã lô"
            className="flex-1 min-w-[240px] rounded-xl border border-[var(--gold)]/60 bg-black/60 px-4 py-3 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] font-mono"
          />
          <button
            type="button"
            className="btn-gold !py-3 !px-5 text-sm font-bold flex items-center gap-2 shadow"
            onClick={() => check()}
          >
            <Search className="h-4 w-4" />
            <span>Xác thực</span>
          </button>
        </div>

        {/* Bấm nhanh mã mẫu */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-stone-300">Mã lô mẫu:</span>
          {lots.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setCode(item.code);
                check(item.code);
              }}
              className="rounded-lg border border-[var(--gold)]/40 bg-black/40 px-2.5 py-1 font-mono text-[11px] font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#3a0a10] transition"
            >
              {item.code}
            </button>
          ))}
        </div>

        {/* KẾT QUẢ TÌM THẤY LÔ HÀNG */}
        {searched && lot && (
          <div className="mt-8 mx-auto max-w-2xl rounded-2xl border-2 border-emerald-500 bg-gradient-to-b from-[#092212] to-[#030e06] p-5 sm:p-6 shadow-2xl animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-heading font-black text-white text-base sm:text-lg uppercase">
                    CHỨNG THƯ CHÍNH HÃNG 100%
                  </h4>
                  <p className="text-xs text-emerald-300">
                    Sản phẩm đạt chứng nhận bảo hộ nguồn gốc xuất xứ Núi Báo
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-black text-emerald-300 border border-emerald-400/40">
                LÔ HÀNG: {lot.code}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[110px_1fr] items-start">
              {extra && (
                <div className="h-28 w-28 overflow-hidden rounded-xl border border-emerald-400/40 bg-black shadow mx-auto sm:mx-0">
                  <img
                    src={extra.image}
                    alt={lot.product}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 text-xs sm:text-sm text-stone-200">
                <h5 className="font-bold text-base text-[var(--gold-light)]">
                  {lot.product}
                </h5>
                {extra && (
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Mã sản phẩm (SKU): <b className="text-white font-mono">{extra.sku}</b></span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Vùng thu hái: <b>{lot.place}</b></span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-sky-400 shrink-0" />
                  <span>Thu hoạch: <b>{lot.harvest}</b> • Đóng gói: <b>{lot.packed}</b></span>
                </p>
                {extra && (
                  <p className="text-xs text-emerald-300 font-semibold">
                    Dược chất: {extra.saponin}
                  </p>
                )}
                <p className="text-xs text-stone-300 italic pt-2 border-t border-emerald-500/20">
                  {lot.note}
                </p>
              </div>
            </div>

            {extra && (
              <div className="mt-5 pt-3 border-t border-emerald-500/30 flex justify-end">
                <Link
                  href={`/san-pham/${extra.slug}`}
                  className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Xem chi tiết dòng sản phẩm này</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* KẾT QUẢ KHÔNG TÌM THẤY */}
        {searched && !lot && (
          <div className="mt-8 mx-auto max-w-xl rounded-2xl border border-rose-500/60 bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-200 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-base">Không tìm thấy mã số này</p>
              <p className="mt-1">
                Mã &quot;{code.trim() || "(trống)"}&quot; không có trong cơ sở dữ liệu sổ lô chính thức. Quý khách vui lòng kiểm tra lại tem niêm phong trên bao bì hoặc liên hệ hotline để được thẩm định.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
