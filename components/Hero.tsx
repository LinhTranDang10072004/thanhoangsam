"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import GinsengArt from "./GinsengArt";

const particles = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  size: 4 + (i % 4) * 3,
  dur: 8 + (i % 6) * 2,
  delay: (i % 7) * 0.8,
}));

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} className="relative flex min-h-[92vh] items-center overflow-hidden bg-luxury text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/nguon-goc-chung-nhan-1.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />

      {!reduce &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute bottom-0 rounded-full bg-[var(--gold)] z-0"
            style={{ left: p.left, width: p.size, height: p.size, opacity: 0.6 }}
            animate={{ y: [0, -900], opacity: [0, 0.8, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 1.2 }}
            className="text-sm font-semibold text-[var(--gold)]"
          >
            SÂM TIẾN VUA · NÚI BÁO
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-5xl leading-[1.1] font-extrabold md:text-7xl"
          >
            Hồn sâm <span className="text-gold-gradient">Báo</span>
            <br /> Đất Thanh Hoá
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 max-w-lg text-lg text-[var(--gold-light)]/90 md:text-xl"
          >
            Dược liệu quý từng dùng trong cung nhà Hồ. Trồng tại Vĩnh Lộc, có chứng nhận và truy xuất nguồn gốc từng lô.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link href="/san-pham" className="btn-gold">
              Khám phá sản phẩm
            </Link>
            <Link
              href="/nguon-goc"
              className="rounded-xl border border-[var(--gold)] px-6 py-3 font-bold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--red-dark)]"
            >
              Xem nguồn gốc
            </Link>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-[var(--gold-light)]"
          >
            <span className="rounded-full border border-[var(--gold)]/40 bg-black/50 px-3 py-1 backdrop-blur-md">
              ✦ 100% Sâm Thật Núi Báo
            </span>
            <span className="rounded-full border border-[var(--gold)]/40 bg-black/50 px-3 py-1 backdrop-blur-md">
              ✦ Chuẩn OCOP Vĩnh Lộc
            </span>
            <span className="rounded-full border border-[var(--gold)]/40 bg-black/50 px-3 py-1 backdrop-blur-md">
              ✦ Truy Xuất Nguồn Gốc Từng Hộp
            </span>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yImg }} className="relative flex justify-center">
          <div className="absolute inset-0 m-auto h-72 w-72 rounded-full bg-[var(--gold)]/20 blur-3xl md:h-96 md:w-96" />
          <motion.div
            initial={reduce ? false : { scale: 0.8, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="float glass gold-border-glow relative flex h-96 w-72 flex-col items-center justify-between rounded-[2rem] p-3 md:h-[28rem] md:w-80 overflow-hidden group">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-[var(--gold)] backdrop-blur-md border border-[var(--gold)]/40 shadow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Phim tư liệu sâm Báo</span>
              </div>

              {/* Video tư liệu thực địa */}
              <div className="relative flex h-full w-full items-center justify-center pt-8 overflow-hidden rounded-2xl">
                <video
                  src="/images/nguon-goc-chung-nhan-2.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover rounded-2xl filter drop-shadow-[0_15px_30px_rgba(212,160,23,0.5)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center pb-2 pt-2">
                <span className="text-gold-gradient font-black tracking-widest text-base">SÂM BÁO NÚI BÁO</span>
                <span className="text-[10px] font-semibold tracking-wider text-[var(--gold-light)]/85 uppercase mt-0.5">
                  Đại Việt Đệ Nhất Danh Sâm
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 flex h-10 w-6 -translate-x-1/2 justify-center rounded-full border border-[var(--gold)]/70 pt-2 z-10"
        animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden
      >
        <motion.span
          className="h-2 w-1 rounded bg-[var(--gold)]"
          animate={reduce ? undefined : { y: [0, 14, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
