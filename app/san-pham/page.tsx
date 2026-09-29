import { Suspense } from "react";
import type { Metadata } from "next";
import ProductFilter from "@/components/ProductFilter";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Sâm Báo tươi, sâm khô, cao sâm và rượu sâm Vĩnh Lộc.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title">Tất cả sản phẩm</h1>
      <div className="gold-line" />
      <Suspense fallback={<p className="py-10 text-center">Đang tải bộ lọc...</p>}>
        <ProductFilter />
      </Suspense>
    </div>
  );
}
