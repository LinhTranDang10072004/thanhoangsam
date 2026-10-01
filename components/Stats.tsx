import CountUp from "./CountUp";
import Reveal from "./Reveal";
import { Hourglass, MapPin, Award, Users } from "lucide-react";

const stats = [
  { to: 600, suffix: " năm", label: "Từ thời nhà Hồ", icon: Hourglass },
  { to: 100, suffix: "%", label: "Trồng tại Vĩnh Lộc", icon: MapPin },
  { to: 4, suffix: " chứng nhận", label: "Kiểm định uy tín", icon: Award },
  { to: 1200, suffix: "+", label: "Khách hàng tin dùng", icon: Users },
];

export default function Stats() {
  return (
    <section className="relative py-16 text-white overflow-hidden">
      <video
        src="/images/1790691442427_2251207849705082306_2251207849705082306.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--red)]/80" />
      
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="flex flex-col items-center">
                <Icon className="mb-4 h-8 w-8 text-[var(--gold)]" />
                <p className="text-4xl font-extrabold text-[var(--gold)] md:text-5xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[var(--gold-light)]">{s.label}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
