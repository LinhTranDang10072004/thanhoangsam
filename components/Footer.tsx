import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[var(--red-dark)] py-10 text-[var(--gold-light)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-[var(--gold)]">{site.name}</p>
          <p className="mt-2">Sâm Báo Vĩnh Lộc – &quot;Đệ nhất danh sâm nước Nam&quot;</p>
          <p className="mt-3 text-sm leading-relaxed opacity-90">{site.disclaimer}</p>
        </div>
        <div>
          <p className="font-bold text-[var(--gold)]">Trang</p>
          <ul className="mt-2 space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/gio-hang" className="hover:text-white">
                Giỏ hàng
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-[var(--gold)]">Liên hệ</p>
          <p className="mt-2">{site.address}</p>
          <p>
            <a href={`tel:${site.phoneTel}`} className="hover:text-white">
              {site.phoneDisplay}
            </a>
          </p>
          <p>
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
          </p>
          <p>{site.hours}</p>
        </div>
      </div>
      <p className="mt-8 text-center text-sm opacity-80">© 2026 thanhoangsam.com</p>
    </footer>
  );
}
