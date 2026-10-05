"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, ShoppingCart, X, QrCode, User as UserIcon, ShieldCheck } from "lucide-react";
import { nav, site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";
import QRScanModal from "./QRScanModal";

function isCurrent(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export default function Header() {
  const path = usePathname();
  const { count } = useCart();
  const { user, profile } = useAuth();
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
      <div className="bg-black/30 text-[11px] sm:text-xs text-[var(--gold-light)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-4 py-1">
          <span className="truncate">Sâm Báo Vĩnh Lộc • Đệ Nhất Danh Sâm</span>
          <a href={`tel:${site.phoneTel}`} className="inline-flex items-center gap-1 hover:text-white shrink-0 font-bold ml-2">
            <Phone size={11} /> <span className="hidden sm:inline">Hotline: </span>{site.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Thanh điều hướng chính */}
      <div className="bg-[var(--red)]/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5">
          {/* Logo thương hiệu */}
          <Link href="/" prefetch={true} className="flex items-center gap-2 shrink-0 transition hover:opacity-95">
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Nút Mã QR & Số Lô - Ẩn trên mobile nhỏ để tránh chật chội */}
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[var(--gold)]/60 bg-black/40 px-2.5 py-1.5 text-xs font-bold text-[var(--gold-light)] shadow backdrop-blur-md transition hover:bg-[var(--gold)] hover:text-[#3a0a10] whitespace-nowrap shrink-0"
              title="Tự tạo & tra cứu mã QR, xem mã sản phẩm và số lô"
            >
              <QrCode size={15} className="text-[var(--gold)] shrink-0" />
              <span className="whitespace-nowrap">Mã QR</span>
            </button>

            {/* Nút Tài khoản / Đăng nhập - Thu gọn trên mobile */}
            {user ? (
              <div className="flex items-center gap-1.5 shrink-0">
                {profile?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 rounded-xl border border-amber-400 bg-amber-500/20 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-amber-300 shadow transition hover:bg-amber-500 hover:text-black whitespace-nowrap shrink-0"
                    title="Trang Quản trị Hệ thống"
                  >
                    <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                    <span className="whitespace-nowrap hidden sm:inline">Quản trị</span>
                  </Link>
                )}
                <Link
                  href="/tai-khoan"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[var(--gold)]/60 bg-black/40 px-2.5 py-1.5 text-xs font-bold text-[var(--gold-light)] shadow transition hover:bg-[var(--gold)] hover:text-[#3a0a10] whitespace-nowrap shrink-0"
                  title="Tài khoản cá nhân"
                >
                  <UserIcon size={14} className="text-[var(--gold)] shrink-0" />
                  <span className="whitespace-nowrap max-w-[80px] truncate hidden md:inline">
                    {profile?.full_name?.split(" ").pop() || "Tài khoản"}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[var(--gold)]/60 bg-black/40 px-2.5 py-1.5 text-xs font-bold text-[var(--gold-light)] shadow transition hover:bg-[var(--gold)] hover:text-[#3a0a10] whitespace-nowrap shrink-0"
                title="Đăng nhập tài khoản"
              >
                <UserIcon size={14} className="text-[var(--gold)] shrink-0" />
                <span className="whitespace-nowrap">Đăng nhập</span>
              </Link>
            )}

            {/* Nút Giỏ Hàng */}
            <Link href="/gio-hang" prefetch={true} className="btn-gold relative !px-2.5 sm:!px-3 !py-1.5 text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <ShoppingCart size={15} className="shrink-0" />
              <span className="whitespace-nowrap hidden sm:inline">Giỏ hàng</span>
              {ready && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-extrabold text-[var(--red)] shadow">
                  {count}
                </span>
              )}
            </Link>

            {/* Nút mở Menu Mobile */}
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl text-white lg:hidden shrink-0 border border-white/20 bg-black/20"
              aria-expanded={open}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
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

            {/* Đăng nhập / Tài khoản trên mobile */}
            {user ? (
              <div className="flex gap-2 mb-2">
                {profile?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-400 bg-amber-500/20 py-2.5 text-xs font-bold text-amber-300"
                  >
                    <ShieldCheck size={16} />
                    <span>Quản trị</span>
                  </Link>
                )}
                <Link
                  href="/tai-khoan"
                  onClick={() => setOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--gold)]/60 bg-black/40 py-2.5 text-xs font-bold text-[var(--gold-light)]"
                >
                  <UserIcon size={16} />
                  <span>Tài khoản ({profile?.full_name?.split(" ").pop() || "Tôi"})</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                onClick={() => setOpen(false)}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--gold)]/60 bg-black/40 py-2.5 text-xs font-bold text-[var(--gold-light)]"
              >
                <UserIcon size={16} />
                <span>Đăng Nhập / Đăng Ký</span>
              </Link>
            )}

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
