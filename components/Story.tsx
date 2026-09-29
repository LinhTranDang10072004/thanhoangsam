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
      <div className="mx-auto max-w-3xl px-4">
        <Reveal>
          <h2 className="section-title !text-4xl">Vì sao gọi là &quot;Sâm Báo&quot;?</h2>
          <div className="gold-line" />
        </Reveal>

        <div ref={ref} className="relative mt-12 pl-10">
          <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-[var(--gold-light)]" />
          <motion.div
            style={reduce ? { scaleY: 1 } : { scaleY, transformOrigin: "top" }}
            className="absolute top-0 bottom-0 left-3 w-0.5 bg-gradient-to-b from-[var(--gold)] to-[var(--red)]"
          />
          {events.map((e, i) => (
            <Reveal key={e.year} delay={i * 0.08} className="relative mb-12">
              <span className="absolute top-1.5 -left-[2.15rem] h-4 w-4 rounded-full bg-[var(--red)] ring-4 ring-[var(--gold)]" />
              <p className="text-xl font-extrabold text-[var(--red)]">{e.year}</p>
              <p className="mt-1 text-lg">{e.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
