"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { priceQuote, products, vnd, type Product } from "@/lib/data";
import { useCart } from "./CartProvider";
import ProductCard from "./ProductCard";
import Product360Viewer from "./Product360Viewer";
import {
  RotateCw,
  Eye,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Utensils,
  Award,
  Clock,
  HeartHandshake,
  MapPin,
  Check,
  ArrowRight,
  Info,
} from "lucide-react";

// Dữ liệu hướng dẫn cách dùng có hình ảnh minh họa chi tiết từng bước
const usageGuides: Record<
  string,
  Array<{ step: string; title: string; desc: string; image: string }>
> = {
  "sam-bao-tuoi": [
    {
      step: "01",
      title: "Rửa sạch & Sơ chế",
      desc: "Dùng bàn chải lông mềm rửa nhẹ nhàng dưới vòi nước chảy để làm sạch lớp đất phù sa Núi Báo. Để ráo nước trên rổ tre.",
      image: "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg",
    },
    {
      step: "02",
      title: "Thái lát hoặc Hầm canh",
      desc: "Thái lát mỏng 1-2mm hãm nước sôi 85°C làm trà sâm, hoặc hầm trọn củ với gà ác, chim câu, nấm hương trong 45 - 60 phút.",
      image: "/images/1790691441922_2251207849705082306_2251207849705082306_49add4d443a5310c1f040d1325d4d802.jpg",
    },
    {
      step: "03",
      title: "Thưởng thức & Ngâm mật ong",
      desc: "Dùng bát canh sâm ấm nóng bồi bổ cơ thể. Phần củ tươi còn lại có thể ngâm ngập mật ong rừng trong hũ thủy tinh dùng quanh năm.",
      image: "/images/1790691441975_2251207849705082306_2251207849705082306_97f1219099e9b56dc9c0c7e8d40bec80.jpg",
    },
  ],
  "sam-bao-kho": [
    {
      step: "01",
      title: "Định lượng lát sâm",
      desc: "Lấy từ 3 đến 5 lát sâm sấy thăng hoa cho vào ấm trà hoặc bình giữ nhiệt cá nhân dung tích 300ml - 500ml.",
      image: "/images/1790691442022_2251207849705082306_2251207849705082306_6ad8864197f32490ffac32f52b5b6ebd.jpg",
    },
    {
      step: "02",
      title: "Hãm nước sôi 90°C",
      desc: "Rót nước sôi tráng nhanh 5 giây, sau đó rót nước sôi 90°C - 95°C hãm 10 - 15 phút để hoạt chất saponin hòa tan trọn vẹn.",
      image: "/images/1790691442045_2251207849705082306_2251207849705082306_8df163c6132ac12d701e8c1d5c6145fa.jpg",
    },
    {
      step: "03",
      title: "Uống trà & Nhai lát sâm",
      desc: "Rót uống từng ngụm ấm thanh ngọt tự nhiên trong ngày. Sau khi nước nhạt, nhai nuốt cả bã lát sâm để hấp thu 100% dưỡng chất.",
      image: "/images/1790691442069_2251207849705082306_2251207849705082306_38971826cc8331ac9d7612bd266f8633.jpg",
    },
  ],
  "cao-sam-bao": [
    {
      step: "01",
      title: "Lấy lượng cao chuẩn",
      desc: "Mở nắp niêm phong, dùng muỗng gỗ hoặc muỗng sứ sạch múc khoảng 1 thìa cà phê nhỏ (tương đương 3 - 5g cao cô đặc).",
      image: "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg",
    },
    {
      step: "02",
      title: "Hòa tan với nước ấm",
      desc: "Khuấy đều cao trong 150ml - 200ml nước ấm 50°C - 60°C cho đến khi tan mịn hoàn toàn. Có thể thêm chút mật ong tùy sở thích.",
      image: "/images/1790691442144_2251207849705082306_2251207849705082306_7c4ce215dbe2225f393b15647133cb84.jpg",
    },
    {
      step: "03",
      title: "Thời điểm dùng tốt nhất",
      desc: "Uống vào buổi sáng sau ăn 30 phút hoặc đầu giờ chiều để nạp năng lượng tỉnh táo và tăng cường đề kháng suốt ngày dài.",
      image: "/images/1790691442168_2251207849705082306_2251207849705082306_051a85d7dfd861e704025cb3efdbb529.jpg",
    },
  ],
  "ruou-sam-bao": [
    {
      step: "01",
      title: "Bảo quản & Lắc nhẹ",
      desc: "Đặt bình rượu nơi thoáng mát tránh ánh nắng gắt. Trước khi rót có thể lắc nhẹ để tinh chất sâm hòa đều cùng rượu nếp ngâm truyền thống.",
      image: "/images/1790691442264_2251207849705082306_2251207849705082306_51677dc509da9a7f2ae3b3b674ae2c8a.jpg",
    },
    {
      step: "02",
      title: "Liều lượng chén nhỏ",
      desc: "Rót 1 chén hạt mít nhỏ khoảng 20ml - 30ml dùng trong hoặc sau bữa ăn tối. Vị cay êm dịu, hậu ngọt đậm đà nơi cổ họng.",
      image: "/images/1790691442289_2251207849705082306_2251207849705082306_ea1efa9505c05626aeb4942b73d4488a.jpg",
    },
    {
      step: "03",
      title: "Lưu ý an toàn",
      desc: "Sản phẩm chỉ dành cho người từ đủ 18 tuổi. Tuyệt đối không dùng khi điều khiển phương tiện giao thông, đang mang thai hoặc cho con bú.",
      image: "/images/1790691442314_2251207849705082306_2251207849705082306_9703c4794efb0550246cbeaf4930d7c6.jpg",
    },
  ],
  "tra-hoa-sam": [
    {
      step: "01",
      title: "Định lượng hoa sâm",
      desc: "Lấy từ 3–5 bông hoa sâm sấy thăng hoa cho vào ấm thủy tinh hoặc tách trà dung tích 250ml–350ml.",
      image: "/images/1790691442095_2251207849705082306_2251207849705082306_6d97ca5064721c8d9a1349080f124d78.jpg",
    },
    {
      step: "02",
      title: "Hãm nước sôi 85°C–90°C",
      desc: "Rót nước sôi tráng nhẹ 3 giây, sau đó rót nước sôi 85°C–90°C hãm trong 5–7 phút cho hoa hé nở tỏa hương.",
      image: "/images/1790691442045_2251207849705082306_2251207849705082306_8df163c6132ac12d701e8c1d5c6145fa.jpg",
    },
    {
      step: "03",
      title: "Thưởng thức & Nhai hoa",
      desc: "Thưởng trà từng ngụm ấm thanh ngọt dịu mát. Sau khi uống hết nước có thể nhai luôn bông hoa sâm bùi ngọt thơm mát.",
      image: "/images/1790691442405_2251207849705082306_2251207849705082306_4a2e0e50c98be7e9d8e6e1b93d0f43ea.jpg",
    },
  ],
  "sam-bao-mat-ong": [
    {
      step: "01",
      title: "Khuấy đều hũ sâm",
      desc: "Dùng thìa gỗ hoặc thìa sứ khuấy nhẹ để các lát sâm hòa quyện đều cùng mật ong rừng nguyên chất sánh mịn.",
      image: "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg",
    },
    {
      step: "02",
      title: "Pha nước ấm 45°C",
      desc: "Múc 1–2 thìa mật ong sâm kèm lát sâm pha với 150ml nước ấm 40°C–50°C (không dùng nước sôi làm giảm enzyme mật ong).",
      image: "/images/1790691442144_2251207849705082306_2251207849705082306_7c4ce215dbe2225f393b15647133cb84.jpg",
    },
    {
      step: "03",
      title: "Thưởng thức buổi sáng",
      desc: "Uống vào sáng sớm trước ăn hoặc khi mệt mỏi để bổ phế, nhuận tràng, tăng sức đề kháng và tràn đầy sinh lực cả ngày.",
      image: "/images/1790691442168_2251207849705082306_2251207849705082306_051a85d7dfd861e704025cb3efdbb529.jpg",
    },
  ],
};

export default function ProductDetail({ product }: { product: Product }) {
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const [viewMode, setViewMode] = useState<"360" | "standard">("360");
  const [activeTab, setActiveTab] = useState<"usage" | "info" | "cert">("usage");
  const { add } = useCart();
  const router = useRouter();
  const variant = product.variants[vi] || product.variants[0];
  const quote = priceQuote(variant.price, qty);
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  // Lấy các bước dùng có ảnh minh họa
  const currentGuide = usageGuides[product.slug] || [
    {
      step: "01",
      title: "Chuẩn bị sản phẩm",
      desc: product.summary || "Chuẩn bị sản phẩm sâm Báo chính hãng có tem truy xuất.",
      image: product.image,
    },
    {
      step: "02",
      title: "Chế biến & Sử dụng",
      desc: product.usage || "Sử dụng đúng liều lượng khuyến nghị hàng ngày.",
      image: "/images/1790691441922_2251207849705082306_2251207849705082306_49add4d443a5310c1f040d1325d4d802.jpg",
    },
    {
      step: "03",
      title: "Bảo quản đúng cách",
      desc: "Đậy kín nắp sau khi dùng, để nơi khô ráo, tránh ánh nắng trực tiếp.",
      image: "/images/1790691441975_2251207849705082306_2251207849705082306_97f1219099e9b56dc9c0c7e8d40bec80.jpg",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      {/* ── KHỐI CHÍNH TRÊN: 2 CỘT ẢNH 360 & ĐẶT HÀNG ── */}
      <div className="grid items-start gap-8 lg:grid-cols-2">
        {/* CỘT TRÁI: KHUNG ẢNH / STUDIO 360 TỰ ĐỘNG CÓ SẴN */}
        <div>
          {viewMode === "360" ? (
            <Product360Viewer product={product} />
          ) : (
            <div className="relative flex h-[360px] sm:h-[460px] md:h-[520px] items-center justify-center rounded-3xl border-3 border-[var(--gold)] bg-black/80 shadow-2xl overflow-hidden">
              <img
                src={product.image || "/images/logo.png"}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/logo.png";
                }}
                className="h-full w-full object-contain p-6 object-center"
              />
              <div className="absolute bottom-4 left-4 rounded-full border border-[var(--gold)]/40 bg-black/80 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-[var(--gold-light)] backdrop-blur-md">
                Ảnh chụp thực tế 100% tại vùng sâm Núi Báo
              </div>
            </div>
          )}

          {/* DẢI THUMBNAIL CHUYỂN ĐỔI CHẾ ĐỘ XEM */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("360")}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-bold transition ${
                  viewMode === "360"
                    ? "border-[var(--gold)] bg-[#2b0508] text-[var(--gold-light)] shadow-md"
                    : "border-stone-200 bg-white text-stone-600 hover:border-[var(--gold)]"
                }`}
              >
                <RotateCw className="h-4 w-4 text-[var(--gold)] animate-spin-slow" />
                <span>Xoay 360° Studio</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("standard")}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-bold transition ${
                  viewMode === "standard"
                    ? "border-[var(--gold)] bg-[#2b0508] text-[var(--gold-light)] shadow-md"
                    : "border-stone-200 bg-white text-stone-600 hover:border-[var(--gold)]"
                }`}
              >
                <Eye className="h-4 w-4 text-emerald-600" />
                <span>Ảnh chụp đóng gói</span>
              </button>
            </div>

            <Link
              href="/hinh-anh-thuc-te"
              prefetch={true}
              className="text-xs font-bold text-[var(--red)] hover:text-[var(--gold)] transition flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>Xem ảnh thực tế vườn sâm</span>
            </Link>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM & ĐẶT HÀNG */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[var(--gold-light)] px-3 py-1 text-sm font-bold text-[var(--red)]">
              {product.type} • {product.age}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--gold)]/60 bg-amber-50 px-3 py-1 text-xs font-bold text-[var(--red)]">
              <RotateCw className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>Hỗ trợ xoay 360° tương tác</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Chuẩn OCOP Núi Báo</span>
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-[var(--red)]">{product.name}</h1>
          <p className="mt-3 text-base text-stone-700 leading-relaxed">{product.detail}</p>

          <p className="mt-6 font-bold text-sm text-stone-900">Chọn quy cách:</p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {product.variants.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setVi(index)}
                className={`rounded-xl border-2 px-4 py-2.5 font-bold text-sm transition ${
                  vi === index
                    ? "border-[var(--red)] bg-[var(--red)] text-[var(--gold-light)] shadow-md"
                    : "border-[var(--gold-light)] bg-white text-[var(--red)] hover:border-[var(--gold)]"
                }`}
              >
                {item.label}
                <span className="mt-0.5 block text-xs font-semibold">{vnd(item.price)}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 font-bold text-sm text-stone-900">Số lượng:</p>
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              aria-label="Giảm số lượng"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="h-10 w-10 rounded-full border-2 border-[var(--gold)] text-xl font-bold transition hover:bg-[var(--gold-light)]"
            >
              −
            </button>
            <span className="w-8 text-center text-xl font-bold">{qty}</span>
            <button
              type="button"
              aria-label="Tăng số lượng"
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="h-10 w-10 rounded-full border-2 border-[var(--gold)] text-xl font-bold transition hover:bg-[var(--gold-light)]"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Mua từ 3 sản phẩm cùng quy cách giảm 5%, từ 5 sản phẩm giảm 10%.
          </p>
          {quote.rate > 0 && (
            <p className="mt-1 font-semibold text-green-700 text-xs">
              Đang giảm {quote.rate * 100}% — tiết kiệm {vnd(quote.save)}
            </p>
          )}

          <p className="mt-5 text-3xl font-extrabold text-[var(--red)]">{vnd(quote.total)}</p>
          {quote.rate > 0 && <p className="text-xs line-through opacity-70">{vnd(quote.subtotal)}</p>}

          <div className="mt-5 flex gap-2.5 sm:gap-3">
            <button
              type="button"
              className="btn-gold !py-3 !px-3 sm:!px-6 text-xs sm:text-sm font-bold shadow flex-1 text-center"
              onClick={() => add(product.slug, variant.label, qty)}
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              className="btn-red !py-3 !px-3 sm:!px-6 text-xs sm:text-sm font-bold shadow flex-1 text-center"
              onClick={() => {
                add(product.slug, variant.label, qty);
                router.push("/gio-hang");
              }}
            >
              Mua ngay
            </button>
          </div>

          <div className="mt-7 rounded-xl border border-[var(--gold-light)] bg-stone-50 p-3.5 text-xs text-stone-600">
            Thanh toán an toàn: VietQR • Momo • ZaloPay • COD nhận hàng kiểm tra mới thanh toán.
          </div>
          {product.type === "Rượu sâm" && (
            <p className="mt-2.5 rounded-xl bg-[#fff4f4] p-3 text-xs font-semibold text-[var(--red)] border border-rose-200">
              Rượu chỉ bán cho người từ đủ 18 tuổi. Không dùng khi lái xe hoặc đang mang thai.
            </p>
          )}
        </div>
      </div>

      {/* ── KHỐI DƯỚI: THÔNG TIN SẢN PHẨM & CÁCH DÙNG KÈM HÌNH ẢNH MINH HỌA ── */}
      <section className="mt-12 sm:mt-16 rounded-3xl border-2 border-[var(--gold)]/50 bg-gradient-to-b from-white via-amber-50/30 to-stone-50 p-4 sm:p-6 md:p-10 shadow-xl overflow-hidden">
        {/* Thanh chuyển Tab sang trọng */}
        <div className="flex border-b-2 border-stone-200 pb-2 gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("usage")}
            className={`flex items-center gap-2 pb-3 font-heading text-sm sm:text-base font-black transition border-b-3 -mb-2.5 whitespace-nowrap ${
              activeTab === "usage"
                ? "border-[var(--red)] text-[var(--red)]"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            <Utensils className="h-4 w-4 text-[var(--gold)]" />
            <span>Hướng Dẫn Cách Dùng (Kèm Hình Ảnh)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 pb-3 font-heading text-sm sm:text-base font-black transition border-b-3 -mb-2.5 whitespace-nowrap ${
              activeTab === "info"
                ? "border-[var(--red)] text-[var(--red)]"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            <FileText className="h-4 w-4 text-[var(--gold)]" />
            <span>Thông Tin Chi Tiết & Dược Tính</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cert")}
            className={`flex items-center gap-2 pb-3 font-heading text-sm sm:text-base font-black transition border-b-3 -mb-2.5 whitespace-nowrap ${
              activeTab === "cert"
                ? "border-[var(--red)] text-[var(--red)]"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
            <span>Nguồn Gốc & Tiêu Chuẩn OCOP</span>
          </button>
        </div>

        {/* ═══ TAB 1: CÁCH DÙNG CÓ HÌNH ẢNH MINH HỌA ═══ */}
        {activeTab === "usage" && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--red)] uppercase tracking-wide">
                Quy Trình & Hướng Dẫn Sử Dụng Chuẩn Hoàng Cung
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Để phát huy tối đa hàm lượng Saponin và các dược chất quý có trong sâm Báo
              </p>
            </div>

            {/* 3 Thẻ Bước thực hiện có Ảnh minh họa thực tế */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentGuide.map((g) => (
                <div
                  key={g.step}
                  className="rounded-2xl border-2 border-[var(--gold-light)] bg-white p-4 shadow-md hover:border-[var(--gold)] hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Ảnh minh họa cho từng bước */}
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black shadow-inner border border-stone-200">
                      <img
                        src={g.image}
                        alt={g.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/logo.png";
                        }}
                        className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-2.5 left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--red)] text-white font-mono text-xs font-black shadow-md border border-[var(--gold)]">
                        {g.step}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-[var(--red)]">
                      {g.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Phương pháp chuẩn làng sâm Vĩnh Hùng</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Khung lời khuyên chuyên gia */}
            <div className="rounded-2xl border border-[var(--gold)]/60 bg-gradient-to-r from-amber-50 to-orange-50 p-5 flex items-start gap-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-[#2b0508] shrink-0 font-bold">
                💡
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-stone-700">
                <h4 className="font-bold text-stone-900 text-sm">
                  Lời khuyên từ nghệ nhân dược liệu Thanh Hoàng Sâm:
                </h4>
                <p className="leading-relaxed">
                  {product.usage ||
                    "Nên dùng đều đặn vào buổi sáng hoặc đầu giờ chiều để cơ thể hấp thu dưỡng chất tốt nhất. Tránh dùng sát giờ đi ngủ đối với người nhạy cảm với sâm."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: MÔ TẢ CHI TIẾT & BẢNG THÔNG SỐ ═══ */}
        {activeTab === "info" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in items-start">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[var(--red)] uppercase">
                  Mô Tả & Dược Tính Thảo Mộc
                </h3>
                <p className="mt-2 text-sm text-stone-700 leading-relaxed">
                  {product.detail}
                </p>
              </div>

              {/* Đối tượng khuyên dùng */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-sm">
                <h4 className="font-bold text-sm text-[var(--red)] flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-[var(--gold)]" />
                  <span>Đối tượng sử dụng phù hợp:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.audience.map((a) => (
                    <span
                      key={a}
                      className="rounded-lg bg-amber-100/70 px-3 py-1 text-xs font-semibold text-stone-800 border border-amber-200"
                    >
                      ✓ {a}
                    </span>
                  ))}
                </div>

                <h4 className="font-bold text-sm text-[var(--red)] pt-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                  <span>Công dụng nổi bật:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.needs.map((n) => (
                    <span
                      key={n}
                      className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200"
                    >
                      ✦ {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bảng thông số kỹ thuật chi tiết */}
            <div className="rounded-2xl border-2 border-[var(--gold)]/40 bg-white p-6 shadow-md space-y-4">
              <h3 className="font-heading text-base font-bold text-[var(--red)] uppercase pb-2 border-b border-stone-200 flex items-center gap-2">
                <Info className="h-4 w-4 text-[var(--gold)]" />
                <span>Bảng Thông Số Kỹ Thuật Sản Phẩm</span>
              </h3>

              <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Tên thương mại:</span>
                  <span className="font-bold text-stone-900">{product.name}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Dòng sản phẩm:</span>
                  <span className="font-bold text-[var(--red)]">{product.type}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Độ tuổi củ sâm:</span>
                  <span className="font-bold text-stone-900">{product.age}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Vùng thu hái:</span>
                  <span className="font-bold text-stone-900 text-right">
                    Đỉnh Núi Báo, xã Vĩnh Hùng, Vĩnh Lộc, Thanh Hóa
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Tiêu chuẩn kiểm nghiệm:</span>
                  <span className="font-bold text-emerald-700">Dược điển Việt Nam loại 1 (COA)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Tem niêm phong:</span>
                  <span className="font-bold text-stone-900">Mã QR truy xuất nguồn gốc từng hộp</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500">Quy cách đóng gói:</span>
                  <span className="font-bold text-stone-900">
                    {product.variants.map((v) => v.label).join(" • ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB 3: BẢO CHỨNG NGUỒN GỐC & OCOP ═══ */}
        {activeTab === "cert" && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[var(--red)] uppercase">
                Bảo Chứng Nguồn Gốc Núi Báo & Chứng Nhận Quốc Gia
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Mỗi sản phẩm Thanh Hoàng Sâm đều được kiểm định nghiêm ngặt từ vùng trồng hữu cơ đến xưởng chế biến sâu
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: "📜",
                  title: "Chứng Thư COA",
                  desc: "Kiểm nghiệm hàm lượng Saponin và 17 loại acid amin tự nhiên",
                },
                {
                  icon: "🌿",
                  title: "Tiêu Chuẩn VietGAP",
                  desc: "Vùng trồng sâm hữu cơ không phân bón hóa học dưới chân núi Báo",
                },
                {
                  icon: "🛡️",
                  title: "Cục An Toàn Thực Phẩm",
                  desc: "Giấy tiếp nhận đăng ký bản công bố sản phẩm hợp quy",
                },
                {
                  icon: "🏆",
                  title: "Chứng Nhận OCOP",
                  desc: "Sản vật tinh hoa đặc sản truyền thống Vĩnh Lộc - Thanh Hóa",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-[var(--gold-light)] bg-white p-5 text-center shadow-sm space-y-2"
                >
                  <div className="text-3xl mb-1">{c.icon}</div>
                  <h4 className="font-heading font-bold text-sm text-[var(--red)] uppercase">
                    {c.title}
                  </h4>
                  <p className="text-xs text-stone-600">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[var(--gold)]/40 bg-black/90 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-heading font-bold text-base text-[var(--gold-light)] uppercase">
                  Kiểm tra số lô in trên vỏ hộp của bạn
                </h4>
                <p className="text-xs text-stone-300">
                  Nhập mã số lô hoặc quét QR để đối chiếu ngày thu hái thực tế
                </p>
              </div>

              <Link
                href="/nguon-goc"
                className="btn-gold !py-2.5 !px-5 text-xs font-bold shrink-0 flex items-center gap-1.5"
              >
                <span>Tra cứu nguồn gốc</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ── SẢN PHẨM KHÁC ── */}
      <section className="mt-16">
        <h2 className="section-title">Sản phẩm khác</h2>
        <div className="gold-line" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} p={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
