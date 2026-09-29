import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Hotline, Zalo và địa chỉ Thanh Hoàng Sâm tại Vĩnh Lộc, Thanh Hóa.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title">Liên hệ</h1>
      <div className="gold-line" />
      <ContactForm />
    </div>
  );
}
