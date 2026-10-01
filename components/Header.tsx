"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, ShoppingCart, X, QrCode } from "lucide-react";
import { nav, site } from "@/lib/site";
import { useCart } from "./CartProvider";
import QRScanModal from "./QRScanModal";

function isCurrent(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export default function Header() {
  const path = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gold)]/40 bg-[var(--red-dark)]/90 shadow-lg backdrop-blur-md">
      {/* Thanh thông tin trên cùng */}
      <div className="bg-black/25 text-xs text-[var(--gold-light)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-1.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="whitespace-nowrap">Đặc sản Vĩnh Lộc – Thanh Hóa • Giao hàng toàn quốc</span>
          <a href={`tel:${site.phoneTel}`} className="inline-flex items-center justify-center gap-1 hover:text-white whitespace-nowrap">
            <Phone size={13} /> Hotline: {site.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Thanh điều hướng chính - 1 dòng duy nhất, không rớt dòng */}
      <div className="bg-[var(--red)]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 lg:gap-4 px-3 sm:px-4 py-2.5">
          {/* Logo thương hiệu */}
          <Link href="/" prefetch={true} className="flex items-center gap-2.5 shrink-0 transition hover:opacity-95">
            <img
              src="/images/logo.png"
              alt="Thanh Hoàng Sâm Logo"
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-full border border-[var(--gold)]/60 shadow-[0_0_10px_rgba(212,160,23,0.5)] object-contain shrink-0"
            />
            <div className="flex flex-col shrink-0">
              <span className="font-heading text-sm sm:text-lg xl:text-xl font-black tracking-wider text-[var(--gold)] uppercase leading-tight drop-shadow-sm whitespace-nowrap">
                THANH HOÀNG <span className="text-white">SÂM</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-[var(--gold-light)] uppercase hidden xl:block whitespace-nowrap">
                Đại Việt Đệ Nhất Danh Sâm
              </span>
            </div>
          </Link>

          {/* Menu Điều Hướng Desktop - Chữ nhỏ gọn, 1 dòng thẳng thớm */}
          <nav className="hidden items-center gap-2 lg:gap-3 xl:gap-5 lg:flex shrink-0" aria-label="Chính">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                aria-current={ready && isCurrent(path, item.href) ? "page" : undefined}
                className={`whitespace-nowrap text-xs xl:text-[13px] font-bold transition hover:text-[var(--gold)] ${
                  ready && isCurrent(path, item.href) ? "text-[var(--gold)]" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cụm nút thao tác bên phải */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Nút Mã QR & Số Lô */}
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--gold)]/60 bg-black/40 px-2.5 py-1.5 text-xs font-bold text-[var(--gold-light)] shadow backdrop-blur-md transition hover:bg-[var(--gold)] hover:text-[#3a0a10] whitespace-nowrap shrink-0"
              title="Tự tạo & tra cứu mã QR, xem mã sản phẩm và số lô"
            >
              <QrCode size={15} className="text-[var(--gold)] shrink-0" />
              <span className="whitespace-nowrap">Mã QR & Số Lô</span>
            </button>

            {/* Nút Giỏ Hàng */}
            <Link href="/gio-hang" prefetch={true} className="btn-gold relative !px-3 !py-1.5 text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <ShoppingCart size={15} className="shrink-0" />
              <span className="whitespace-nowrap">Giỏ hàng</span>
              {ready && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-extrabold text-[var(--red)]">
                  {count}
                </span>
              )}
            </Link>

            {/* Nút mở Menu Mobile */}
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl text-white lg:hidden shrink-0"
              aria-expanded={open}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu mở rộng trên điện thoại (Mobile) */}
        {open && (
          <nav className="space-y-1 border-t border-white/15 px-4 py-3 lg:hidden" aria-label="Di động">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowQR(true);
              }}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-500 py-2.5 text-xs font-bold text-[#3a0a10] shadow whitespace-nowrap"
            >
              <QrCode size={18} />
              <span>Tra Cứu Mã QR & Số Lô</span>
            </button>

            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`block rounded-xl px-3 py-2.5 text-xs font-bold whitespace-nowrap ${
                  ready && isCurrent(path, item.href) ? "bg-white/10 text-[var(--gold)]" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Cửa sổ Quét mã QR & Tra cứu lô sâm - Căn chính giữa màn hình */}
      <QRScanModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </header>
  );
}
