"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Reveal from "./Reveal";

const events = [
  { year: "Trước thế kỷ X", text: "Người dân vùng Vĩnh Ninh dùng củ sâm trên núi Báo làm nước uống." },
  { year: "1397", text: "Hồ Quý Ly xây Thành Nhà Hồ, biết đến sâm Báo qua nhóm thợ làng Biện Thượng." },
  { year: "Thời Lê – Trịnh", text: "Sâm Báo là sản vật quốc gia, dùng trong cung đình." },
  { year: "Ngày nay", text: "Người dân Vĩnh Lộc khôi phục và mở rộng vùng trồng, chế biến cao, trà, rượu sâm." },
];

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section className="bg-[var(--cream)] py-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="section-title !text-2xl sm:!text-4xl text-center md:text-left">Vì sao gọi là &quot;Sâm Báo&quot;?</h2>
          <div className="gold-line mx-auto md:mx-0" />
        </Reveal>

        <div className="mt-8 sm:mt-12 grid gap-8 sm:gap-12 md:grid-cols-2 items-start">
          <div ref={ref} className="relative pl-7 sm:pl-10">
            <div className="absolute top-0 bottom-0 left-2.5 sm:left-3 w-0.5 bg-[var(--gold-light)]" />
            <motion.div
              style={reduce ? { scaleY: 1 } : { scaleY, transformOrigin: "top" }}
              className="absolute top-0 bottom-0 left-2.5 sm:left-3 w-0.5 bg-gradient-to-b from-[var(--gold)] to-[var(--red)]"
            />
            {events.map((e, i) => (
              <Reveal key={e.year} delay={i * 0.08} className="relative mb-8 sm:mb-12">
                <span className="absolute top-1.5 -left-[1.7rem] sm:-left-[2.15rem] h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-[var(--red)] ring-3 sm:ring-4 ring-[var(--gold)]" />
                <p className="text-base sm:text-xl font-extrabold text-[var(--red)]">{e.year}</p>
                <p className="mt-1 text-xs sm:text-base text-stone-700 leading-relaxed">{e.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="space-y-4">
            <div className="rounded-3xl border-2 border-[var(--gold)]/60 bg-gradient-to-b from-[#2b0508] to-black p-4 text-white shadow-2xl overflow-hidden">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-[var(--gold)]/30">
                <video
                  src="/images/nguon-goc-chung-nhan-1.mp4"
                  muted
                  autoPlay
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-3">
                <span className="rounded-full bg-[var(--gold)]/20 px-3 py-0.5 text-[10px] font-bold text-[var(--gold-light)] border border-[var(--gold)]/40">
                  THƯỚC PHIM TƯ LIỆU SÂM TIẾN VUA
                </span>
                <p className="mt-1.5 text-xs text-stone-300 leading-relaxed">
                  Hành trình 600 năm bảo tồn giống sâm Báo hoa vàng quý hiếm trên đỉnh Núi Báo, Vĩnh Lộc, Thanh Hóa.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
