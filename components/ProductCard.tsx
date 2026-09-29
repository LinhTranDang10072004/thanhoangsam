"use client";

import { useState } from "react";
import Link from "next/link";
import { minPrice, vnd, type Product } from "@/lib/data";
import { Camera, X, ArrowRight } from "lucide-react";
import Product360Viewer from "./Product360Viewer";

export default function ProductCard({ p }: { p: Product }) {
  const [show360Modal, setShow360Modal] = useState(false);

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border-2 border-[var(--gold-light)] bg-white transition hover:border-[var(--gold)] hover:shadow-xl flex flex-col justify-between">
        {/* Khung ảnh thật của sản phẩm - Bấm vào xem chi tiết hoặc mở 360 */}
        <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-stone-900 to-black">
          <Link href={`/san-pham/${p.slug}`} className="block h-full w-full">
            <img
              src={p.image || "/images/sam-bao-tuoi.jpg"}
              alt={p.name}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Nút bấm Camera 360° trực tiếp trên ảnh */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShow360Modal(true);
            }}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)] bg-black/80 px-3 py-1.5 text-xs font-bold text-[var(--gold-light)] backdrop-blur-md shadow-lg transition hover:scale-105 hover:bg-[var(--red)] hover:text-white"
            title="Bấm để mở Camera 360° tương tác"
          >
            <Camera className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>Xoay 360°</span>
          </button>
        </div>

        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <span className="rounded bg-[var(--gold-light)] px-2.5 py-1 text-xs font-bold text-[var(--red)]">
              {p.type} • {p.age}
            </span>
            <h3 className="mt-2 text-xl font-bold text-[var(--red)] hover:text-[var(--gold)] transition">
              <Link href={`/san-pham/${p.slug}`}>{p.name}</Link>
            </h3>
            <p className="mt-1 text-base leading-snug text-stone-700">{p.summary}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <p className="text-lg">
              Từ <b className="text-[var(--red)] font-extrabold">{vnd(minPrice(p))}</b>
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShow360Modal(true)}
                className="btn-gold !py-2 !px-2 text-xs flex items-center justify-center gap-1 font-bold"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Xem 360°</span>
              </button>
              <Link
                href={`/san-pham/${p.slug}`}
                className="btn-red !py-2 !px-2 text-xs flex items-center justify-center gap-1 font-bold"
              >
                <span>Chi tiết</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Modal Popup Camera 360° xem nhanh ngay tại chỗ */}
      {show360Modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShow360Modal(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-3xl border-4 border-[var(--gold)] bg-[#260508] p-4 sm:p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="mb-4 flex items-center justify-between border-b border-[var(--gold)]/30 pb-3">
              <div>
                <span className="text-xs font-bold text-[var(--gold-light)] uppercase tracking-wider">
                  Camera 360° Studio Tương Tác
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[var(--gold-light)]">{p.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShow360Modal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/50 bg-black/60 text-white hover:bg-[var(--red)]"
                aria-label="Đóng bảng 360"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Trình xoay 360 */}
            <Product360Viewer product={p} />

            {/* Chân Modal */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--gold)]/30 pt-4">
              <p className="text-xs text-stone-300">
                Kéo chuột hoặc ngón tay để xoay, click vào các điểm phát sáng để xem đặc điểm.
              </p>
              <Link
                href={`/san-pham/${p.slug}`}
                className="btn-gold !py-2.5 !px-5 text-sm flex items-center gap-2"
                onClick={() => setShow360Modal(false)}
              >
                <span>Xem giá & Đặt hàng ngay</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
