"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Reveal from "./Reveal";

const lines = [
  {
    name: "Sâm tươi & khô",
    desc: "Củ sâm hoa vàng thu hoạch tháng 9–12, tươi nguyên vị hoặc thái lát sấy khô.",
    href: "/san-pham/sam-bao-tuoi",
    image: "/images/1790868366520_2251207849705082306_2251207849705082306_12e9c0679cccb508ea80bd7c4771925b.jpg",
    hoverImage: "/images/1790868371239_2251207849705082306_2251207849705082306_833bcb60ad4056b1853e8e6988ea227b.jpg",
  },
  {
    name: "Cao Sâm Báo",
    desc: "Nấu cô đặc thủ công, tiện dùng mỗi ngày.",
    href: "/san-pham/cao-sam-bao",
    image: "/images/1790868367584_2251207849705082306_2251207849705082306_7dfa8c645fdaf56adc9af0c64b6e245b.jpg",
    hoverImage: "/images/1790868363686_2251207849705082306_2251207849705082306_a481ed59910d42ae15e5b01469c45ac5.jpg",
  },
  {
    name: "Rượu Sâm Báo",
    desc: "Ngâm ủ từ củ 3 năm tuổi, quà biếu trang trọng. Chỉ dành cho người từ đủ 18 tuổi.",
    href: "/san-pham/ruou-sam-bao",
    image: "/images/1790868361308_2251207849705082306_2251207849705082306_d3293c3e738aa15a56b43cc93588b4ec.jpg",
    hoverImage: "/images/1790868362572_2251207849705082306_2251207849705082306_85576a3603bc20c732216a21831ea08e.jpg",
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
      className="group relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl gold-border-glow bg-black/40"
    >
      <img
        src={l.image}
        alt={l.name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/logo.png";
        }}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
      />
      <img
        src={l.hoverImage}
        alt={`${l.name} hover`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/logo.png";
        }}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 sm:p-6 text-left">
        <h3 className="text-gold-gradient text-xl sm:text-2xl font-bold">{l.name}</h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[var(--gold-light)]/85 leading-relaxed">{l.desc}</p>
        <div className="mt-3.5">
          <Link href={l.href} prefetch={true} className="btn-gold !py-2 !px-5 text-xs font-bold inline-block">
            Xem ngay
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Collection() {
  return (
    <section className="bg-luxury py-16 sm:py-24 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <h2 className="text-gold-gradient text-center text-3xl sm:text-4xl font-extrabold md:text-5xl">Bộ sưu tập Sâm Báo</h2>
          <p className="mt-2.5 text-center text-xs sm:text-sm text-[var(--gold-light)]/80">Ba cách thưởng thức tinh hoa sâm Việt</p>
        </Reveal>
        <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 md:grid-cols-3">
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
