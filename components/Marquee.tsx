const items = ["VietGAP", "COA Kiểm nghiệm", "Cục ATTP", "ISO 22000", "Truy xuất QR", "Vĩnh Lộc · Thanh Hoá"];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-[var(--red-dark)] bg-[var(--gold)] py-3 text-[var(--red-dark)]">
      <div className="marquee-track flex w-max gap-12 font-extrabold tracking-wider whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <span aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
