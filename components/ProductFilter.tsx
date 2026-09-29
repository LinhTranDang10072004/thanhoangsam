"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { audiences, needs, productTypes, products } from "@/lib/data";
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
      className={`rounded-full border-2 px-4 py-2 font-semibold transition ${
        active
          ? "border-[var(--red)] bg-[var(--red)] text-[var(--gold-light)]"
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
  const aud = params.get("doi-tuong");
  const need = params.get("nhu-cau");
  const type = params.get("loai");

  function toggle(key: string, value: string, current: string | null) {
    const next = new URLSearchParams(params.toString());
    if (current === value) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const list = products.filter(
    (product) =>
      (!aud || product.audience.includes(aud)) &&
      (!need || product.needs.includes(need)) &&
      (!type || product.type === type),
  );
  const filtering = Boolean(aud || need || type);

  return (
    <div>
      <div className="card mb-8 space-y-4 p-6">
        <div>
          <p className="mb-2 font-bold text-[var(--red)]">Loại sản phẩm</p>
          <div className="flex flex-wrap gap-2">
            {productTypes.map((item) => (
              <Chip key={item} label={item} active={type === item} onClick={() => toggle("loai", item, type)} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-bold text-[var(--red)]">Đối tượng sử dụng</p>
          <div className="flex flex-wrap gap-2">
            {audiences.map((item) => (
              <Chip
                key={item}
                label={item}
                active={aud === item}
                onClick={() => toggle("doi-tuong", item, aud)}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-bold text-[var(--red)]">Nhu cầu sức khỏe</p>
          <div className="flex flex-wrap gap-2">
            {needs.map((item) => (
              <Chip
                key={item}
                label={item}
                active={need === item}
                onClick={() => toggle("nhu-cau", item, need)}
              />
            ))}
          </div>
        </div>
        {filtering && (
          <button type="button" className="font-semibold text-[var(--red)] underline" onClick={() => router.replace(pathname)}>
            Xóa bộ lọc
          </button>
        )}
      </div>

      <p className="mb-4 font-semibold text-[var(--red)]">
        {list.length} sản phẩm{filtering ? " phù hợp" : ""}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.slug} p={product} />
        ))}
      </div>
      {list.length === 0 && <p className="py-10 text-center">Chưa có sản phẩm phù hợp. Bác bỏ bớt một bộ lọc nhé.</p>}
    </div>
  );
}
