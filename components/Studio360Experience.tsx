"use client";

import { useState } from "react";
import Link from "next/link";
import { products, vnd, type Product } from "@/lib/data";
import Product360Viewer from "./Product360Viewer";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

export default function Studio360Experience() {
  const [selectedSlug, setSelectedSlug] = useState(products[0].slug);
  const currentProduct = products.find((p) => p.slug === selectedSlug) || products[0];

  return (
    <div className="space-y-8">
      {/* Thanh chọn sản phẩm để xoay 360 */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {products.map((p) => {
          const isSelected = p.slug === currentProduct.slug;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelectedSlug(p.slug)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition-all ${
                isSelected
                  ? "border-[var(--red)] bg-[var(--red)] text-white shadow-lg scale-105"
                  : "border-[var(--gold)]/40 bg-white text-[var(--red)] hover:border-[var(--gold)] hover:bg-[#fff9ea]"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isSelected ? "bg-amber-300 animate-pulse" : "bg-[var(--gold)]"
                }`}
              />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Khung Camera 360 cho sản phẩm được chọn */}
      <div className="card p-4 sm:p-6 shadow-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gold-light)]/60 pb-4">
          <div>
            <span className="rounded bg-[var(--gold-light)] px-3 py-1 text-xs font-extrabold text-[var(--red)]">
              {currentProduct.type} • {currentProduct.age}
            </span>
            <h2 className="mt-1 text-2xl font-black text-[var(--red)]">{currentProduct.name}</h2>
          </div>
          <Link
            href={`/san-pham/${currentProduct.slug}`}
            className="btn-gold !py-2 !px-4 text-sm flex items-center gap-1.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Xem trang đặt hàng ({vnd(currentProduct.variants[0].price)})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Product360Viewer product={currentProduct} />
      </div>
    </div>
  );
}
