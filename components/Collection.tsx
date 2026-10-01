"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Reveal from "./Reveal";

const lines = [
  {
    name: "Sâm tươi & khô",
    desc: "Củ sâm hoa vàng thu hoạch tháng 9–12, tươi nguyên vị hoặc thái lát sấy khô.",
    href: "/san-pham/sam-bao-tuoi",
    image: "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg",
    hoverImage: "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg",
  },
  {
    name: "Cao Sâm Báo",
    desc: "Nấu cô đặc thủ công, tiện dùng mỗi ngày.",
    href: "/san-pham/cao-sam-bao",
    image: "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg",
    hoverImage: "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg",
  },
  {
    name: "Rượu Sâm Báo",
    desc: "Ngâm ủ từ củ 3 năm tuổi, quà biếu trang trọng. Chỉ dành cho người từ đủ 18 tuổi.",
    href: "/san-pham/ruou-sam-bao",
    image: "/images/1790691442264_2251207849705082306_2251207849705082306_51677dc509da9a7f2ae3b3b674ae2c8a.jpg",
    hoverImage: "/images/1790691442264_2251207849705082306_2251207849705082306_51677dc509da9a7f2ae3b3b674ae2c8a.jpg",
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
      className="group relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl gold-border-glow"
    >
      <img src={l.image} alt={l.name} className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500" />
      <img src={l.hoverImage} alt={`${l.name} hover`} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-6 text-left">
        <h3 className="text-gold-gradient text-2xl font-bold">{l.name}</h3>
        <p className="mt-2 text-[var(--gold-light)]/85">{l.desc}</p>
        <div className="mt-4">
          <Link href={l.href} prefetch={true} className="btn-gold inline-block">
            Xem ngay
          </Link>
        </div>
      </div>
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
