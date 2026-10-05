"use client";

import Link from "next/link";
import { minPrice, vnd, type Product } from "@/lib/data";
import { ArrowRight, Camera } from "lucide-react";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border-2 border-[var(--gold-light)] bg-white transition duration-300 hover:border-[var(--gold)] hover:shadow-xl flex flex-col justify-between">
      {/* Khung ảnh sản phẩm - Bấm vào là chuyển thẳng tới trang chi tiết */}
      <Link
        href={`/san-pham/${p.slug}`}
        prefetch={true}
        className="relative block h-60 w-full overflow-hidden bg-gradient-to-br from-stone-900 to-black"
      >
        <img
          src={p.image || "/images/logo.png"}
          alt={p.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/logo.png";
          }}
          className="h-full w-full object-contain p-4 object-center transition duration-500 group-hover:scale-105"
        />

        {/* Badge Ảnh thật tinh tế ở góc ảnh */}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-[var(--gold)]/50 bg-black/75 px-2.5 py-1 text-[11px] font-bold text-[var(--gold-light)] backdrop-blur-md shadow-md">
          <Camera className="h-3 w-3 text-[var(--gold)]" />
          <span>Ảnh thật</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="rounded bg-[var(--gold-light)] px-2.5 py-1 text-xs font-bold text-[var(--red)]">
            {p.type} • {p.age}
          </span>
          <h3 className="mt-2 text-xl font-bold text-[var(--red)] hover:text-[var(--gold)] transition">
            <Link href={`/san-pham/${p.slug}`} prefetch={true}>{p.name}</Link>
          </h3>
          <p className="mt-1 text-base leading-snug text-stone-700">{p.summary}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100">
          <p className="text-lg">
            Từ <b className="text-[var(--red)] font-extrabold">{vnd(minPrice(p))}</b>
          </p>

          <div className="mt-3">
            <Link
              href={`/san-pham/${p.slug}`}
              prefetch={true}
              className="btn-gold w-full !py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow transition hover:scale-[1.01]"
            >
              <span>Xem chi tiết & Đặt mua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
