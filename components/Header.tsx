"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, ShoppingCart, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { useCart } from "./CartProvider";

function isCurrent(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export default function Header() {
  const path = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gold)]/40 bg-[var(--red-dark)]/90 shadow-lg backdrop-blur-md">
      <div className="bg-black/25 text-sm text-[var(--gold-light)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-1.5 sm:flex-row sm:items-center sm:justify-between">
          <span>Đặc sản Vĩnh Lộc – Thanh Hóa • Giao hàng toàn quốc</span>
          <a href={`tel:${site.phoneTel}`} className="inline-flex items-center justify-center gap-1 hover:text-white">
            <Phone size={14} /> Hotline: {site.phoneDisplay}
          </a>
        </div>
      </div>
      <div className="bg-[var(--red)]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-95">
            <img
              src="/images/logo.png"
              alt="Thanh Hoàng Sâm Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-[var(--gold)]/60 shadow-[0_0_12px_rgba(212,160,23,0.5)] object-contain"
            />
            <div className="flex flex-col">
              <span className="font-heading text-lg sm:text-2xl font-black tracking-wider text-[var(--gold)] uppercase leading-tight drop-shadow-sm">
                THANH HOÀNG <span className="text-white">SÂM</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[var(--gold-light)] uppercase hidden sm:block">
                Đại Việt Đệ Nhất Danh Sâm
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Chính">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={ready && isCurrent(path, item.href) ? "page" : undefined}
                className={`font-semibold transition hover:text-[var(--gold)] ${
                  ready && isCurrent(path, item.href) ? "text-[var(--gold)]" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/gio-hang" className="btn-gold relative !px-3 !py-2">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {ready && count > 0 && (
                <span className="absolute -top-2 -right-2 grid h-6 min-w-6 place-items-center rounded-full bg-white px-1 text-sm font-extrabold text-[var(--red)]">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl text-white lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="space-y-1 border-t border-white/15 px-4 py-3 lg:hidden" aria-label="Di động">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-3 font-semibold ${
                  ready && isCurrent(path, item.href) ? "bg-white/10 text-[var(--gold)]" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
