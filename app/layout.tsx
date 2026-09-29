import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/components/CartProvider";
import { beVietnamLatin, beVietnamViet, playfair } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Thanh Hoàng Sâm – Sâm Báo Vĩnh Lộc chính gốc",
    template: "%s – Thanh Hoàng Sâm",
  },
  description: "Sâm Báo Vĩnh Lộc, Thanh Hóa – có giấy chứng nhận, truy xuất nguồn gốc từng lô hàng.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Thanh Hoàng Sâm – Sâm Báo Vĩnh Lộc chính gốc",
    description: "Sâm Báo Vĩnh Lộc, Thanh Hóa. Giao hàng toàn quốc, tra cứu mã lô trên bao bì.",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/images/logo.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${beVietnamLatin.variable} ${beVietnamViet.variable} ${playfair.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
