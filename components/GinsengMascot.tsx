"use client";

export default function GinsengMascot({
  className = "w-12 h-12",
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 120 140"
        className={`w-full h-full filter drop-shadow-[0_4px_10px_rgba(212,160,23,0.5)] ${
          animated ? "animate-bounce-subtle" : ""
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Nhân vật củ sâm Báo AI"
      >
        {/* Hào quang vàng phía sau */}
        <circle cx="60" cy="75" r="48" fill="url(#mascot-glow)" opacity="0.6" />

        <defs>
          <radialGradient id="mascot-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 75) rotate(90) scale(48)">
            <stop stopColor="#f6e3a1" stopOpacity="0.8" />
            <stop offset="1" stopColor="#d4a017" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="body-grad" x1="30" y1="45" x2="90" y2="125" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff8e7" />
            <stop offset="0.3" stopColor="#f7d377" />
            <stop offset="0.75" stopColor="#e5aa24" />
            <stop offset="1" stopColor="#b27907" />
          </linearGradient>

          <linearGradient id="flower-grad" x1="60" y1="5" x2="60" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff2a8" />
            <stop offset="1" stopColor="#f0b618" />
          </linearGradient>

          <linearGradient id="leaf-grad" x1="40" y1="35" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#68d391" />
            <stop offset="1" stopColor="#2f855a" />
          </linearGradient>
        </defs>

        {/* Cành và lá trên đầu */}
        <path d="M60 48 L60 28" stroke="#38a169" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="45" cy="38" rx="12" ry="6" fill="url(#leaf-grad)" transform="rotate(-20 45 38)" />
        <ellipse cx="75" cy="38" rx="12" ry="6" fill="url(#leaf-grad)" transform="rotate(20 75 38)" />

        {/* Bông hoa vàng 5 cánh núi Báo trên đỉnh đầu */}
        <g transform="translate(60, 18)">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-11"
              rx="6"
              ry="10"
              fill="url(#flower-grad)"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="5.5" fill="#9b111e" />
          <circle cx="0" cy="0" r="3" fill="#f6e3a1" />
        </g>

        {/* Thân củ sâm béo tròn đáng yêu */}
        <path
          d="M60 46 C78 46 92 60 92 80 C92 98 84 112 76 122 C72 127 68 132 64 135 C61 137 59 137 56 135 C52 132 48 127 44 122 C36 112 28 98 28 80 C28 60 42 46 60 46 Z"
          fill="url(#body-grad)"
          stroke="#8c5806"
          strokeWidth="2.5"
        />

        {/* Chân rễ con hai bên */}
        {/* Rễ trái */}
        <path
          d="M38 108 C30 114 24 122 25 130 C26 133 29 132 31 129 C34 124 38 116 42 112"
          fill="none"
          stroke="#9e6608"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Rễ phải */}
        <path
          d="M82 108 C90 114 96 122 95 130 C94 133 91 132 89 129 C86 124 82 116 78 112"
          fill="none"
          stroke="#9e6608"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Rễ con phụ uốn lượn */}
        <path
          d="M50 128 C45 133 46 138 52 136"
          fill="none"
          stroke="#b27907"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Đường vân ngấn sâm tự nhiên */}
        <path d="M42 66 Q60 72 78 66" stroke="#c48a0a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M45 88 Q60 94 75 88" stroke="#c48a0a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* Hai mắt to tròn long lanh */}
        <ellipse cx="48" cy="74" rx="4.5" ry="6" fill="#2d1502" />
        <circle cx="46.5" cy="72" r="1.8" fill="#ffffff" />
        <circle cx="49.5" cy="76" r="0.8" fill="#ffffff" />

        <ellipse cx="72" cy="74" rx="4.5" ry="6" fill="#2d1502" />
        <circle cx="70.5" cy="72" r="1.8" fill="#ffffff" />
        <circle cx="73.5" cy="76" r="0.8" fill="#ffffff" />

        {/* Má hồng hào */}
        <ellipse cx="38" cy="80" rx="5.5" ry="3" fill="#ff7a85" opacity="0.65" />
        <ellipse cx="82" cy="80" rx="5.5" ry="3" fill="#ff7a85" opacity="0.65" />

        {/* Nụ cười vui vẻ */}
        <path d="M54 82 Q60 88 66 82" stroke="#4a1e05" strokeWidth="2.5" strokeLinecap="round" />

        {/* Tay vẫy chào */}
        <path
          d="M28 78 C20 74 15 68 18 64 C21 60 26 66 30 72"
          fill="url(#body-grad)"
          stroke="#8c5806"
          strokeWidth="2"
        />
        <path
          d="M92 78 C100 74 105 68 102 64 C99 60 94 66 90 72"
          fill="url(#body-grad)"
          stroke="#8c5806"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
