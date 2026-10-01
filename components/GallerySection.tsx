"use client";

import Reveal from "./Reveal";
import { Play, Sparkles, CheckCircle2 } from "lucide-react";

const videoDocumentaries = [
  {
    title: "Ký Sự Vườn Sâm Núi Báo – Vĩnh Lộc",
    desc: "Thước phim tư liệu ghi lại thực địa vùng trồng sâm tự nhiên tại xã Vĩnh Hùng, điều kiện đất đai và khí hậu nuôi dưỡng củ sâm tiến vua.",
    src: "/images/nguon-goc-chung-nhan-1.mp4",
    badge: "PHIM TƯ LIỆU VÙNG TRỒNG",
  },
  {
    title: "Quy Trình Thu Hoạch & Chứng Nhận Nguồn Gốc",
    desc: "Từng củ sâm được đào thủ công, phân loại và kiểm định hàm lượng Saponin trước khi niêm phong tem QR truy xuất nguồn gốc.",
    src: "/images/nguon-goc-chung-nhan-2.mp4",
    badge: "CHỨNG NHẬN CHẤT LƯỢNG",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-[#1a0204] py-20 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <span className="rounded-full bg-[var(--gold)]/20 px-3.5 py-1 text-xs font-bold text-[var(--gold-light)] border border-[var(--gold)]/40 inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>THƯỚC PHIM TƯ LIỆU THỰC TẾ</span>
            </span>
            <h2 className="text-gold-gradient text-center text-3xl font-extrabold md:text-5xl uppercase">
              Thước Phim Thực Tế Từ Vườn Sâm
            </h2>
            <div className="gold-line mx-auto mt-4" />
            <p className="mt-4 text-[var(--gold-light)]/85 max-w-2xl mx-auto text-xs sm:text-sm">
              Mọi thước phim được ghi lại trực tiếp tại vùng trồng sâm Báo Núi Báo, xã Vĩnh Hùng, huyện Vĩnh Lộc, Thanh Hóa
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videoDocumentaries.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="rounded-3xl border-2 border-[var(--gold)]/60 bg-gradient-to-b from-[#2b0508] to-black p-5 shadow-2xl space-y-4 hover:border-[var(--gold)] transition group">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[var(--gold)]/20 px-3 py-0.5 text-[10px] font-bold text-[var(--gold-light)] border border-[var(--gold)]/40">
                    {item.badge}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Chứng nhận chính hãng</span>
                  </span>
                </div>

                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[var(--gold)]/40 shadow-inner">
                  <video
                    src={item.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-[var(--gold-light)] group-hover:text-white transition">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
