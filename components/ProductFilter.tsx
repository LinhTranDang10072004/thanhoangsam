"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { productTypes, products, type Product } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "./ProductCard";

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border-2 px-4 py-2 font-semibold text-sm transition ${
        active
          ? "border-[var(--red)] bg-[var(--red)] text-[var(--gold-light)] shadow-md"
          : "border-[var(--gold)] bg-white text-[var(--red)] hover:bg-[var(--gold-light)]"
      }`}
    >
      {label}
    </button>
  );
}

export default function ProductFilter() {
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const type = params.get("loai");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const json = await res.json();
          if (json.products && json.products.length > 0) {
            setAllProducts(json.products as Product[]);
            return;
          }
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setAllProducts(data as Product[]);
        }
      } catch (err) {
        // Fallback giữ nguyên sản phẩm mặc định
      }
    }
    loadProducts();
  }, []);

  function toggle(key: string, value: string, current: string | null) {
    const next = new URLSearchParams(params.toString());
    if (current === value) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const list = allProducts.filter(
    (product) => !type || product.type === type,
  );
  const filtering = Boolean(type);

  return (
    <div>
      {/* Bộ lọc loại sản phẩm */}
      <div className="card mb-8 p-5 sm:p-6 shadow-md border border-[var(--gold)]/40 text-center">
        <div>
          <p className="mb-3.5 font-heading font-black text-base sm:text-lg text-[var(--red)] uppercase tracking-wide text-center">
            Loại sản phẩm
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {productTypes.map((item) => (
              <Chip key={item} label={item} active={type === item} onClick={() => toggle("loai", item, type)} />
            ))}
          </div>
        </div>

        {filtering && (
          <div className="text-center pt-2">
            <button
              type="button"
              className="mt-3 inline-block font-bold text-xs sm:text-sm text-[var(--red)] hover:underline"
              onClick={() => router.replace(pathname)}
            >
              ✕ Xóa bộ lọc (Xem tất cả sản phẩm)
            </button>
          </div>
        )}
      </div>

      <p className="mb-6 font-semibold text-sm sm:text-base text-[var(--red)] text-center">
        {list.length} sản phẩm{filtering ? ` thuộc danh mục "${type}"` : " chính hãng Núi Báo"}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.slug} p={product} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="py-12 text-center text-stone-600">
          Chưa có sản phẩm nào thuộc phân loại này. Quý khách vui lòng chọn loại sản phẩm khác.
        </p>
      )}
    </div>
  );
}
