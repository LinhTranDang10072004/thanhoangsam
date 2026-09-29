"use client";

import { useRef, useState } from "react";
import GinsengArt from "./GinsengArt";

const spots = [
  {
    title: "Hoa vàng",
    text: "Người địa phương nhận sâm Báo nhờ hoa vàng trên núi Báo, xã Vĩnh Hùng.",
  },
  {
    title: "Thân củ",
    text: "Củ càng nhiều năm càng chắc. Trên web này có củ 2 năm, 3 năm và lát khô 4 năm.",
  },
  {
    title: "Rễ con",
    text: "Rễ con giữ lại khi sơ chế để khách thấy đúng hình củ rừng, không cắt cho đẹp giả.",
  },
];

export default function Scene3D() {
  const [rot, setRot] = useState({ x: -12, y: 24 });
  const [spot, setSpot] = useState(0);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, rx: rot.x, ry: rot.y };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const y = drag.current.ry + (event.clientX - drag.current.x) * 0.45;
    const x = Math.max(-35, Math.min(25, drag.current.rx - (event.clientY - drag.current.y) * 0.25));
    setRot({ x, y });
  }

  function onPointerUp() {
    drag.current = null;
  }

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div
        className="relative flex h-[460px] cursor-grab touch-none items-center justify-center overflow-hidden rounded-3xl border-4 border-[var(--gold)] bg-gradient-to-b from-[#3a0a10] via-[var(--red-dark)] to-black active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="Xoay hình sâm. Kéo ngang để xoay, hoặc dùng hai nút bên dưới."
      >
        <div className="absolute bottom-16 h-24 w-56 rounded-[100%] bg-black/40" style={{ transform: "rotateX(70deg)" }} />
        <div style={{ perspective: "900px" }}>
          <div
            style={{
              transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div style={{ transform: "translateZ(28px)" }}>
              <GinsengArt className="h-80 w-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
        <p className="absolute bottom-4 text-sm text-[var(--gold-light)]">Kéo để xoay củ sâm</p>
      </div>

      <div>
        <div className="mb-4 flex gap-2">
          <button type="button" className="btn-gold !px-4 !py-2" onClick={() => setRot((value) => ({ ...value, y: value.y - 25 }))}>
            Xoay trái
          </button>
          <button type="button" className="btn-gold !px-4 !py-2" onClick={() => setRot((value) => ({ ...value, y: value.y + 25 }))}>
            Xoay phải
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {spots.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setSpot(index)}
              className={`rounded-full border-2 px-4 py-2 font-semibold ${
                spot === index
                  ? "border-[var(--red)] bg-[var(--red)] text-[var(--gold-light)]"
                  : "border-[var(--gold)] bg-white text-[var(--red)]"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="card mt-4 p-5">
          <h2 className="text-2xl font-extrabold text-[var(--red)]">{spots[spot].title}</h2>
          <p className="mt-2">{spots[spot].text}</p>
        </div>
      </div>
    </div>
  );
}
