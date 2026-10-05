const items = ["VietGAP", "COA Kiểm nghiệm", "Cục ATTP", "ISO 22000", "Truy xuất QR", "Vĩnh Lộc · Thanh Hoá"];

export default function Marquee() {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[var(--gold-light)]/40 bg-[var(--gold)] py-2 sm:py-2.5 text-[var(--red-dark)] shadow-sm">
      <div className="marquee-track flex w-max gap-8 sm:gap-12 text-xs sm:text-sm font-extrabold tracking-wider whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-12">
            {t} <span aria-hidden className="text-[var(--red)] font-normal">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
