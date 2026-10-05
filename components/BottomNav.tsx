"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Package, QrCode, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "./CartProvider";
import { site } from "@/lib/site";
import QRScanModal from "./QRScanModal";

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [ready, setReady] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // Không hiển thị trên trang Admin
  if (pathname.startsWith("/admin")) return null;

  const items = [
    {
      label: "Trang chủ",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      label: "Sản phẩm",
      href: "/san-pham",
      icon: Package,
      active: pathname.startsWith("/san-pham"),
    },
    {
      label: "Tra cứu QR",
      action: () => setShowQR(true),
      icon: QrCode,
      active: showQR,
      highlight: true,
    },
    {
      label: "Giỏ hàng",
      href: "/gio-hang",
      icon: ShoppingCart,
      active: pathname === "/gio-hang",
      badge: ready && count > 0 ? count : 0,
    },
    {
      label: "Hotline",
      href: `tel:${site.phoneTel}`,
      icon: Phone,
      external: true,
    },
  ];

  return (
    <>
      <nav
        aria-label="Điều hướng di động nhanh"
        className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-[var(--gold)]/40 bg-[#1e0205]/95 backdrop-blur-lg shadow-[0_-8px_20px_rgba(0,0,0,0.45)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex h-15 items-center justify-around px-2">
          {items.map((item, idx) => {
            const Icon = item.icon;

            if (item.action) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={item.action}
                  className="flex flex-col items-center justify-center flex-1 py-1 text-center transition group relative"
                >
                  <div className="relative -mt-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-gradient-to-tr from-[var(--gold)] to-amber-400 text-[#3a0a10] shadow-[0_4px_15px_rgba(212,160,23,0.5)] transition-transform group-active:scale-95">
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  <span className="mt-1 text-[10px] font-bold text-[var(--gold-light)] leading-none">
                    {item.label}
                  </span>
                </button>
              );
            }

            if (item.external) {
              return (
                <a
                  key={idx}
                  href={item.href}
                  className="flex flex-col items-center justify-center flex-1 py-1 text-center transition text-[var(--gold-light)]/80 hover:text-[var(--gold)] active:scale-95"
                >
                  <Icon size={18} />
                  <span className="mt-1 text-[10px] font-semibold leading-none">
                    {item.label}
                  </span>
                </a>
              );
            }

            return (
              <Link
                key={idx}
                href={item.href!}
                prefetch={true}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition relative ${
                  item.active
                    ? "text-[var(--gold)] font-bold"
                    : "text-stone-300 hover:text-[var(--gold-light)] font-normal"
                }`}
              >
                <div className="relative">
                  <Icon size={18} className={item.active ? "text-[var(--gold)]" : ""} />
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--red)] px-1 text-[9px] font-extrabold text-white border border-[var(--gold)]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-[10px] leading-none">
                  {item.label}
                </span>
                {item.active && (
                  <span className="absolute bottom-0.5 h-0.5 w-6 rounded-full bg-[var(--gold)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Modal QR Scan */}
      <QRScanModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </>
  );
}
