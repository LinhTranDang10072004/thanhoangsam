import { useId } from "react";

export default function GinsengArt({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const root = `${uid}-root`;
  const leaf = `${uid}-leaf`;

  return (
    <svg viewBox="0 0 240 320" className={className} role="img" aria-label="Hình sâm Báo hoa vàng">
      <defs>
        <linearGradient id={root} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6d4" />
          <stop offset="0.45" stopColor="#f0c24b" />
          <stop offset="1" stopColor="#c48a0a" />
        </linearGradient>
        <linearGradient id={leaf} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e3a1" />
          <stop offset="1" stopColor="#d4a017" />
        </linearGradient>
      </defs>
      <g transform="translate(120 52)">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            rx="14"
            ry="22"
            fill="#f0c24b"
            transform={`rotate(${angle}) translate(0 -18)`}
          />
        ))}
        <circle r="10" fill="#9b111e" />
      </g>
      <path d="M120 74 C118 108 124 128 118 150" stroke="#d4a017" strokeWidth="4" fill="none" />
      <path d="M118 118 C70 98 40 128 58 150 C90 148 110 136 118 122" fill={`url(#${leaf})`} />
      <path d="M122 126 C170 106 200 136 182 156 C150 152 132 140 122 130" fill={`url(#${leaf})`} />
      <path
        d="M118 150 C90 160 78 190 84 220 C70 240 60 270 78 292 C96 276 104 250 108 230 C112 250 118 280 130 300 C146 278 150 250 146 228 C168 250 186 280 176 298 C160 270 154 240 148 220 C168 200 176 170 150 154 C140 148 128 148 118 150 Z"
        fill={`url(#${root})`}
        stroke="#6f0a14"
        strokeWidth="2"
      />
      <path d="M100 190 C118 198 140 196 156 186" stroke="#6f0a14" strokeWidth="1.5" fill="none" opacity="0.35" />
      <path d="M96 220 C118 232 146 226 160 210" stroke="#6f0a14" strokeWidth="1.5" fill="none" opacity="0.35" />
    </svg>
  );
}
