"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { priceQuote, products, vnd, type Product } from "@/lib/data";
import { useCart } from "./CartProvider";
import ProductCard from "./ProductCard";
import Product360Viewer from "./Product360Viewer";
import { RotateCw, Eye, Sparkles, ShieldCheck } from "lucide-react";

export default function ProductDetail({ product }: { product: Product }) {
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const [viewMode, setViewMode] = useState<"360" | "standard">("360");
  const { add } = useCart();
  const router = useRouter();
  const variant = product.variants[vi];
  const quote = priceQuote(variant.price, qty);
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        {/* CỘT TRÁI: KHUNG ẢNH / STUDIO 360 TỰ ĐỘNG CÓ SẴN */}
        <div>
          {viewMode === "360" ? (
            <Product360Viewer product={product} />
          ) : (
            <div className="relative flex h-[460px] sm:h-[520px] items-center justify-center rounded-3xl border-3 border-[var(--gold)] bg-black/80 shadow-2xl overflow-hidden">
              <img
                src={product.image || "/images/sam-bao-tuoi.jpg"}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 rounded-full border border-[var(--gold)]/40 bg-black/80 px-4 py-1.5 text-xs font-semibold text-[var(--gold-light)] backdrop-blur-md">
                Ảnh chụp thực tế 100% tại vùng sâm Núi Báo
              </div>
            </div>
          )}

          {/* DẢI THUMBNAIL CHUYỂN ĐỔI CHẾ ĐỘ XEM (CHỈN CHU, TINH TẾ) */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Nút Thumbnail 360 */}
              <button
                type="button"
                onClick={() => setViewMode("360")}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-bold transition ${
                  viewMode === "360"
                    ? "border-[var(--gold)] bg-[#2b0508] text-[var(--gold-light)] shadow-md"
                    : "border-stone-200 bg-white text-stone-600 hover:border-[var(--gold)]"
                }`}
              >
                <RotateCw className="h-4 w-4 text-[var(--gold)] animate-spin-slow" />
                <span>Xoay 360° Studio</span>
              </button>

              {/* Nút Thumbnail Ảnh thực tế */}
              <button
                type="button"
                onClick={() => setViewMode("standard")}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-bold transition ${
                  viewMode === "standard"
                    ? "border-[var(--gold)] bg-[#2b0508] text-[var(--gold-light)] shadow-md"
                    : "border-stone-200 bg-white text-stone-600 hover:border-[var(--gold)]"
                }`}
              >
                <Eye className="h-4 w-4 text-emerald-600" />
                <span>Ảnh chụp đóng gói</span>
              </button>
            </div>

            <Link
              href="/trai-nghiem-3d"
              className="text-xs font-bold text-[var(--red)] hover:text-[var(--gold)] transition flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>Studio 3D toàn cảnh</span>
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM & ĐẶT HÀNG */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[var(--gold-light)] px-3 py-1 text-sm font-bold text-[var(--red)]">
              {product.type} • {product.age}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--gold)]/60 bg-amber-50 px-3 py-1 text-xs font-bold text-[var(--red)]">
              <RotateCw className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>Hỗ trợ xoay 360° tương tác</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Chuẩn OCOP Núi Báo</span>
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-[var(--red)]">{product.name}</h1>
          <p className="mt-3 text-base text-stone-700 leading-relaxed">{product.detail}</p>

          <p className="mt-6 font-bold text-sm text-stone-900">Chọn quy cách:</p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {product.variants.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setVi(index)}
                className={`rounded-xl border-2 px-4 py-2.5 font-bold text-sm transition ${
                  vi === index
                    ? "border-[var(--red)] bg-[var(--red)] text-[var(--gold-light)] shadow-md"
                    : "border-[var(--gold-light)] bg-white text-[var(--red)] hover:border-[var(--gold)]"
                }`}
              >
                {item.label}
                <span className="mt-0.5 block text-xs font-semibold">{vnd(item.price)}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 font-bold text-sm text-stone-900">Số lượng:</p>
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              aria-label="Giảm số lượng"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="h-10 w-10 rounded-full border-2 border-[var(--gold)] text-xl font-bold transition hover:bg-[var(--gold-light)]"
            >
              −
            </button>
            <span className="w-8 text-center text-xl font-bold">{qty}</span>
            <button
              type="button"
              aria-label="Tăng số lượng"
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="h-10 w-10 rounded-full border-2 border-[var(--gold)] text-xl font-bold transition hover:bg-[var(--gold-light)]"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Mua từ 3 sản phẩm cùng quy cách giảm 5%, từ 5 sản phẩm giảm 10%.
          </p>
          {quote.rate > 0 && (
            <p className="mt-1 font-semibold text-green-700 text-xs">
              Đang giảm {quote.rate * 100}% — tiết kiệm {vnd(quote.save)}
            </p>
          )}

          <p className="mt-5 text-3xl font-extrabold text-[var(--red)]">{vnd(quote.total)}</p>
          {quote.rate > 0 && <p className="text-xs line-through opacity-70">{vnd(quote.subtotal)}</p>}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-gold !py-3 !px-6 text-sm font-bold shadow"
              onClick={() => add(product.slug, variant.label, qty)}
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              className="btn-red !py-3 !px-6 text-sm font-bold shadow"
              onClick={() => {
                add(product.slug, variant.label, qty);
                router.push("/gio-hang");
              }}
            >
              Mua ngay
            </button>
          </div>

          <div className="mt-7 rounded-xl border border-[var(--gold-light)] bg-stone-50 p-3.5 text-xs text-stone-600">
            Thanh toán an toàn: VietQR • Momo • ZaloPay • COD nhận hàng kiểm tra mới thanh toán.
          </div>
          {product.type === "Rượu sâm" && (
            <p className="mt-2.5 rounded-xl bg-[#fff4f4] p-3 text-xs font-semibold text-[var(--red)] border border-rose-200">
              Rượu chỉ bán cho người từ đủ 18 tuổi. Không dùng khi lái xe hoặc đang mang thai.
            </p>
          )}
        </div>
      </div>

      <section className="card mt-12 p-6">
        <h2 className="text-2xl font-extrabold text-[var(--red)]">Cách dùng</h2>
        <p className="mt-2 text-stone-700 leading-relaxed">{product.usage}</p>
      </section>

      <section className="mt-14">
        <h2 className="section-title">Sản phẩm khác</h2>
        <div className="gold-line" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} p={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
