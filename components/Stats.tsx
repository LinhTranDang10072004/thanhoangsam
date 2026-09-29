import CountUp from "./CountUp";
import Reveal from "./Reveal";

const stats = [
  { to: 600, suffix: " năm", label: "Từ thời nhà Hồ" },
  { to: 100, suffix: "%", label: "Trồng tại Vĩnh Lộc" },
  { to: 4, suffix: " chứng nhận", label: "Kiểm định uy tín" },
  { to: 1200, suffix: "+", label: "Khách hàng tin dùng" },
];

export default function Stats() {
  return (
    <section className="bg-[var(--red)] py-16 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <p className="text-4xl font-extrabold text-[var(--gold)] md:text-5xl">
              <CountUp to={s.to} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-[var(--gold-light)]">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
