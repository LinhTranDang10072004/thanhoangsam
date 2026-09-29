"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { priceQuote, products, vnd, type Product } from "@/lib/data";
import { useCart } from "./CartProvider";
import GinsengArt from "./GinsengArt";
import ProductCard from "./ProductCard";
import Product360Viewer from "./Product360Viewer";
import { Camera, Eye, Sparkles } from "lucide-react";

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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          {/* Chuyển đổi chế độ xem */}
          <div className="mb-3 flex items-center justify-between">
            <div className="inline-flex rounded-xl border border-[var(--gold)]/40 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("360")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === "360"
                    ? "border border-[var(--gold)]/50 bg-[var(--red)] text-white shadow"
                    : "text-stone-600 hover:text-[var(--red)]"
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                Camera 360° Studio
              </button>
              <button
                type="button"
                onClick={() => setViewMode("standard")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === "standard"
                    ? "border border-[var(--gold)]/50 bg-[var(--red)] text-white shadow"
                    : "text-stone-600 hover:text-[var(--red)]"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Ảnh phẳng tiêu chuẩn
              </button>
            </div>
            <Link
              href="/trai-nghiem-3d"
              className="text-xs font-bold text-[var(--red)] hover:text-[var(--gold)] transition flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
              Studio toàn cảnh 3D
            </Link>
          </div>

          {viewMode === "360" ? (
            <Product360Viewer product={product} />
          ) : (
            <div className="relative flex h-[480px] sm:h-[520px] items-center justify-center rounded-3xl border-4 border-[var(--gold)] bg-black/60 shadow-xl overflow-hidden">
              <img
                src={product.image || "/images/sam-bao-tuoi.jpg"}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 rounded-full border border-[var(--gold)]/40 bg-black/70 px-4 py-1.5 text-xs font-semibold text-[var(--gold-light)] backdrop-blur-md">
                Ảnh chụp thực tế 100% tại vùng sâm Núi Báo
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[var(--gold-light)] px-3 py-1 text-sm font-bold text-[var(--red)]">
              {product.type} • {product.age}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--gold)] bg-white px-3 py-1 text-xs font-bold text-[var(--red)]">
              <Camera className="h-3.5 w-3.5 text-[var(--gold)]" />
              Hỗ trợ Camera 360°
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-[var(--red)]">{product.name}</h1>
          <p className="mt-3 text-lg">{product.detail}</p>

          <p className="mt-6 font-bold">Chọn quy cách:</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {product.variants.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setVi(index)}
                className={`rounded-xl border-2 px-5 py-3 font-bold ${
                  vi === index
                    ? "border-[var(--red)] bg-[var(--red)] text-[var(--gold-light)]"
                    : "border-[var(--gold)] bg-white text-[var(--red)]"
                }`}
              >
                {item.label}
                <span className="mt-1 block text-sm font-semibold">{vnd(item.price)}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 font-bold">Số lượng:</p>
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              aria-label="Giảm số lượng"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="h-12 w-12 rounded-full border-2 border-[var(--gold)] text-2xl"
            >
              −
            </button>
            <span className="w-10 text-center text-2xl font-bold">{qty}</span>
            <button
              type="button"
              aria-label="Tăng số lượng"
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="h-12 w-12 rounded-full border-2 border-[var(--gold)] text-2xl"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-sm">Mua từ 3 sản phẩm cùng quy cách giảm 5%, từ 5 sản phẩm giảm 10%. Tối đa 20 mỗi lần đặt.</p>
          {quote.rate > 0 && (
            <p className="mt-1 font-semibold text-green-700">
              Đang giảm {quote.rate * 100}% — tiết kiệm {vnd(quote.save)}
            </p>
          )}

          <p className="mt-6 text-4xl font-extrabold text-[var(--red)]">{vnd(quote.total)}</p>
          {quote.rate > 0 && <p className="text-sm line-through opacity-70">{vnd(quote.subtotal)}</p>}

          <div className="mt-6 flex flex-wrap gap-4">
            <button type="button" className="btn-gold" onClick={() => add(product.slug, variant.label, qty)}>
              Thêm vào giỏ
            </button>
            <button
              type="button"
              className="btn-red"
              onClick={() => {
                add(product.slug, variant.label, qty);
                router.push("/gio-hang");
              }}
            >
              Mua ngay
            </button>
          </div>

          <div className="mt-8 rounded-xl border-2 border-[var(--gold-light)] bg-white p-4 text-sm">
            Thanh toán: VietQR • Momo • ZaloPay • COD. Phí ship được báo theo địa chỉ khi shop gọi xác nhận.
          </div>
          {product.type === "Rượu sâm" && (
            <p className="mt-3 rounded-xl bg-[#fff4f4] p-4 text-sm font-semibold text-[var(--red)]">
              Rượu chỉ bán cho người từ đủ 18 tuổi. Không dùng khi lái xe hoặc đang mang thai.
            </p>
          )}
        </div>
      </div>

      <section className="card mt-12 p-6">
        <h2 className="text-2xl font-extrabold text-[var(--red)]">Cách dùng</h2>
        <p className="mt-2">{product.usage}</p>
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
