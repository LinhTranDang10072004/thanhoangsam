"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { productTypes, products } from "@/lib/data";
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
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const type = params.get("loai");

  function toggle(key: string, value: string, current: string | null) {
    const next = new URLSearchParams(params.toString());
    if (current === value) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const list = products.filter(
    (product) => !type || product.type === type,
  );
  const filtering = Boolean(type);

  return (
    <div>
      {/* Bộ lọc loại sản phẩm */}
      <div className="card mb-8 p-5 sm:p-6 shadow-md border border-[var(--gold)]/40">
        <div>
          <p className="mb-3 font-heading font-black text-base sm:text-lg text-[var(--red)] uppercase tracking-wide">
            Loại sản phẩm
          </p>
          <div className="flex flex-wrap gap-2.5">
            {productTypes.map((item) => (
              <Chip key={item} label={item} active={type === item} onClick={() => toggle("loai", item, type)} />
            ))}
          </div>
        </div>

        {filtering && (
          <button
            type="button"
            className="mt-4 inline-block font-bold text-xs sm:text-sm text-[var(--red)] hover:underline"
            onClick={() => router.replace(pathname)}
          >
            ✕ Xóa bộ lọc (Xem tất cả)
          </button>
        )}
      </div>

      <p className="mb-4 font-semibold text-sm sm:text-base text-[var(--red)]">
        {list.length} sản phẩm{filtering ? ` thuộc danh mục "${type}"` : " chính hãng"}
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
