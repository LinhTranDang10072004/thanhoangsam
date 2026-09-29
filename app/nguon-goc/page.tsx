import type { Metadata } from "next";
import { Suspense } from "react";
import TraceLookup from "@/components/TraceLookup";

export const metadata: Metadata = {
  title: "Nguồn gốc & Chứng nhận - Xác thực Mã QR & Số Lô",
  description: "Tra cứu mã QR và số lô Sâm Báo Vĩnh Lộc chính hãng in trên bao bì.",
};

export default function TraceabilityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
      <h1 className="section-title">Nguồn gốc & Chứng nhận</h1>
      <div className="gold-line" />
      <Suspense
        fallback={
          <div className="p-8 text-center text-[var(--gold)]">
            Đang tải dữ liệu tra cứu nguồn gốc...
          </div>
        }
      >
        <TraceLookup />
      </Suspense>
    </div>
  );
}
