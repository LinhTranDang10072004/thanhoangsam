import type { Metadata } from "next";
import TraceLookup from "@/components/TraceLookup";

export const metadata: Metadata = {
  title: "Nguồn gốc & Chứng nhận",
  description: "Tra cứu mã lô Sâm Báo Vĩnh Lộc in trên bao bì.",
};

export default function TraceabilityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="section-title">Nguồn gốc & Chứng nhận</h1>
      <div className="gold-line" />
      <TraceLookup />
    </div>
  );
}
