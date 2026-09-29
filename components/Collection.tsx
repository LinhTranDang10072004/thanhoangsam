"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import GinsengArt from "./GinsengArt";
import Reveal from "./Reveal";

const lines = [
  {
    name: "Sâm tươi & khô",
    desc: "Củ sâm hoa vàng thu hoạch tháng 9–12, tươi nguyên vị hoặc thái lát sấy khô.",
    href: "/san-pham/sam-bao-tuoi",
    image: "/images/sam-bao-tuoi.jpg",
  },
  {
    name: "Cao Sâm Báo",
    desc: "Nấu cô đặc thủ công, tiện dùng mỗi ngày.",
    href: "/san-pham/cao-sam-bao",
    image: "/images/cao-sam-bao.jpg",
  },
  {
    name: "Rượu Sâm Báo",
    desc: "Ngâm ủ từ củ 3 năm tuổi, quà biếu trang trọng. Chỉ dành cho người từ đủ 18 tuổi.",
    href: "/san-pham/ruou-sam-bao",
    image: "/images/ruou-sam-bao.jpg",
  },
];

function TiltCard({ l }: { l: (typeof lines)[number] }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={reduce ? undefined : { scale: 1.03 }}
      className="glass gold-border-glow h-full rounded-3xl p-6 text-center flex flex-col justify-between"
    >
      <div>
        <div className="mx-auto mb-4 flex h-48 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--gold)]/50 shadow-xl bg-black/40">
          <img src={l.image} alt={l.name} className="h-full w-full object-cover object-center" />
        </div>
        <h3 className="text-gold-gradient text-2xl font-bold">{l.name}</h3>
        <p className="mt-3 text-[var(--gold-light)]/85">{l.desc}</p>
      </div>
      <Link href={l.href} className="btn-gold mt-6">
        Xem ngay
      </Link>
    </motion.div>
  );
}

export default function Collection() {
  return (
    <section className="bg-luxury py-24 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="text-gold-gradient text-center text-4xl font-extrabold md:text-5xl">Bộ sưu tập Sâm Báo</h2>
          <p className="mt-3 text-center text-[var(--gold-light)]/80">Ba cách thưởng thức tinh hoa sâm Việt</p>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {lines.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.15} className="h-full">
              <TiltCard l={l} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
