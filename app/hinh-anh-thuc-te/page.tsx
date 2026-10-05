"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Eye, X, Sparkles, MapPin, CheckCircle, ArrowRight } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: "cay-sam" | "cu-sam" | "san-pham";
  desc: string;
  tag: string;
}

const galleryItems: GalleryItem[] = [
  // Cây sâm & Vườn hoa sâm Báo (Ưu tiên hàng đầu theo yêu cầu)
  {
    id: 1,
    src: "/images/1790691442519_2251207849705082306_2251207849705082306_c8b2ef834d8248f207cc3a7fa602d4e0.jpg",
    title: "Cánh đồng SÂM Báo hoa đỏ rực rỡ",
    category: "cay-sam",
    desc: "Vườn sâm Báo bạt ngàn tại xã Vĩnh Hùng, Vĩnh Lộc, Thanh Hóa vào mùa nở rộ sắc hoa đỏ thắm.",
    tag: "Vườn Cây Sâm",
  },
  {
    id: 2,
    src: "/images/1790691442475_2251207849705082306_2251207849705082306_d0c93351f0da44823a044e5dd4b832cc.jpg",
    title: "Cây SÂM Báo sinh trưởng tự nhiên",
    category: "cay-sam",
    desc: "Từng luống cây sâm Báo trĩu hoa, nuôi dưỡng bởi thổ nhưỡng đá vôi màu mỡ dưới chân Núi Báo.",
    tag: "Cây Sâm Thực Tế",
  },
  {
    id: 3,
    src: "/images/1790691442541_2251207849705082306_2251207849705082306_4efa4f4e1b0599f7f008961d8e3860c2.jpg",
    title: "Cận cảnh hoa SÂM Báo 5 cánh",
    category: "cay-sam",
    desc: "Hoa sâm Báo có sắc đỏ hồng đặc trưng, chứa nhiều hoạt chất quý dùng bào chế trà hoa sâm.",
    tag: "Hoa Sâm Báo",
  },
  {
    id: 4,
    src: "/images/1790691442497_2251207849705082306_2251207849705082306_e0efb880901fc240b5255342093c14c7.jpg",
    title: "Luống SÂM Báo tươi tốt ngút ngàn",
    category: "cay-sam",
    desc: "Mô hình trồng chuẩn hữu cơ VietGAP, hoàn toàn không phân hoá học hay thuốc bảo vệ thực vật.",
    tag: "Vùng Trồng Chuẩn",
  },
  {
    id: 5,
    src: "/images/1790691442451_2251207849705082306_2251207849705082306_6dc55787a5d3206680eeb9ee4fcfc941.jpg",
    title: "Cây SÂM Báo trước kỳ thu hoạch",
    category: "cay-sam",
    desc: "Sâm đạt độ tuổi từ 1 đến 2 năm tích lũy trọn vẹn hàm lượng Saponin cao nhất trong củ.",
    tag: "Dược Liệu Quý",
  },

  // Củ sâm thực tế
  {
    id: 6,
    src: "/images/1790868366520_2251207849705082306_2251207849705082306_12e9c0679cccb508ea80bd7c4771925b.jpg",
    title: "Củ SÂM Báo tươi nguyên củ vừa đào",
    category: "cu-sam",
    desc: "Củ sâm nhiều rễ tơ, thịt chắc, ruột trắng sữa chứa hàm lượng chất nhầy quý và dồi dào dinh dưỡng.",
    tag: "Sâm Tươi Nguyên Củ",
  },
  {
    id: 7,
    src: "/images/1790868371239_2251207849705082306_2251207849705082306_833bcb60ad4056b1853e8e6988ea227b.jpg",
    title: "SÂM Báo thái lát phơi sấy khô",
    category: "cu-sam",
    desc: "Quy trình làm sạch, thái lát và sấy lạnh giữ trọn vẹn 100% hoạt chất saponin tự nhiên.",
    tag: "Sâm Khô Thái Lát",
  },

  // Showroom & Thành phẩm
  {
    id: 8,
    src: "/images/1790691442264_2251207849705082306_2251207849705082306_51677dc509da9a7f2ae3b3b674ae2c8a.jpg",
    title: "Bình Rượu SÂM Báo Trụ Tháp Đại Vương",
    category: "san-pham",
    desc: "Bình rượu sâm dáng trụ tháp ngâm những củ sâm tuyển chọn, tỏa sắc hổ phách rực rỡ.",
    tag: "Rượu Sâm Nghệ Thuật",
  },
  {
    id: 9,
    src: "/images/1790691442289_2251207849705082306_2251207849705082306_ea1efa9505c05626aeb4942b73d4488a.jpg",
    title: "Cặp bình rượu SÂM Báo Hoàng Gia",
    category: "san-pham",
    desc: "Trưng bày tại phòng tiếp khách showroom Thanh Hoàng Sâm, đạt chuẩn chứng nhận OCOP xứ Thanh.",
    tag: "Bình Sâm Thượng Hạng",
  },
  {
    id: 10,
    src: "/images/1790691442314_2251207849705082306_2251207849705082306_9703c4794efb0550246cbeaf4930d7c6.jpg",
    title: "Bình ngọc cầu tròn SÂM Báo",
    category: "san-pham",
    desc: "Tuyệt phẩm bình thuỷ tinh cầu tròn cao cấp tôn vinh dáng thế củ sâm tiến vua Đại Việt.",
    tag: "Tuyệt Tác Showroom",
  },
  {
    id: 11,
    src: "/images/1790868362572_2251207849705082306_2251207849705082306_85576a3603bc20c732216a21831ea08e.jpg",
    title: "Hộp Trà Hoa SÂM Báo Thượng Hạng",
    category: "san-pham",
    desc: "Sản phẩm hộp quà tặng đỏ sang trọng, thu hái từ chính những bông hoa sâm Báo nở rộ tại vườn.",
    tag: "Trà Hoa Sâm Báo",
  },
  {
    id: 12,
    src: "/images/1790868372636_2251207849705082306_2251207849705082306_056f7e2751b3cd096b51624cd760c1d3.jpg",
    title: "Hũ SÂM Báo ngâm mật ong rừng",
    category: "san-pham",
    desc: "Lát sâm tươi ngấm đều mật ong nguyên chất sóng sánh, bồi bổ phổi và tăng cường sinh lực.",
    tag: "Sâm Báo Mật Ong",
  },
  {
    id: 13,
    src: "/images/1790868367584_2251207849705082306_2251207849705082306_7dfa8c645fdaf56adc9af0c64b6e245b.jpg",
    title: "Hũ Cao SÂM Báo cô đặc",
    category: "san-pham",
    desc: "Tinh chế từ sâm Báo nguyên chất theo phương pháp cô chân không nhiệt độ thấp hiện đại.",
    tag: "Cao Sâm Báo",
  },
];

export default function RealPhotoGalleryPage() {
  const [filter, setFilter] = useState<"all" | "cay-sam" | "cu-sam" | "san-pham">("all");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filtered = filter === "all" ? galleryItems : galleryItems.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen bg-[var(--cream)] pb-24">
      {/* Banner đầu trang */}
      <section className="bg-luxury text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-black/50 px-4 py-1 text-xs font-bold text-[var(--gold-light)] mb-4 backdrop-blur-md">
            <Camera size={14} className="text-[var(--gold)]" />
            <span>KHO TƯ LIỆU HÌNH ẢNH THẬT 100%</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Hình Ảnh Thực Tế <span className="text-[var(--gold)]">Vườn SÂM Báo</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-stone-300 leading-relaxed">
            Mọi hình ảnh được chụp trực tiếp tại cánh đồng sâm Báo Núi Báo, xã Vĩnh Hùng, huyện Vĩnh Lộc, Thanh Hóa.
            Minh chứng xác thực cho nguồn gốc đệ nhất danh sâm tiến vua.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-[var(--gold-light)]">
            <span className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-[var(--gold)]/20">
              <MapPin size={13} className="text-[var(--gold)]" /> Núi Báo, Vĩnh Lộc, Thanh Hóa
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-[var(--gold)]/20">
              <CheckCircle size={13} className="text-emerald-400" /> Chuẩn VietGAP & OCOP
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-[var(--gold)]/20">
              <Sparkles size={13} className="text-[var(--gold)]" /> Không ảnh ảo, không can thiệp AI
            </span>
          </div>
        </div>
      </section>

      {/* Bộ lọc Tab */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { key: "all", label: "Tất cả hình ảnh" },
            { key: "cay-sam", label: "🌿 Cây Sâm & Vườn Hoa Sâm" },
            { key: "cu-sam", label: "🌱 Củ Sâm & Thu Hoạch" },
            { key: "san-pham", label: "🏺 Bình Rượu & Sản Phẩm" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as any)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition shadow-sm ${
                filter === tab.key
                  ? "bg-[var(--red)] text-white shadow-md border-b-2 border-[var(--gold)] scale-105"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Danh sách ảnh lưới Masonry / Grid */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[var(--gold-light)] shadow-md hover:shadow-xl hover:border-[var(--gold)] transition-all duration-300 flex flex-col"
            >
              {/* Khung ảnh */}
              <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm border border-[var(--gold)]/50">
                    <Eye size={14} className="text-[var(--gold)]" /> Bấm xem ảnh gốc
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-bold text-[var(--gold-light)] border border-[var(--gold)]/40 shadow backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Thông tin mô tả */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-[#3a0a10] group-hover:text-[var(--red)] transition">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Khung liên hệ & Đặt mua */}
        <div className="mt-16 rounded-3xl bg-luxury p-8 sm:p-12 text-center text-white relative overflow-hidden border border-[var(--gold)]/40 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest">
              THANH HOÀNG SÂM · TINH HOA SÂM BÁO XỨ THANH
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white">
              Trải Nghiệm Hương Vị SÂM Báo Thực Tế
            </h2>
            <p className="text-sm text-stone-300">
              Quý khách có nhu cầu mua sâm tươi nguyên củ, trà hoa sâm hay tham quan vườn sâm tại Vĩnh Lộc, vui lòng liên hệ ngay với chúng tôi.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link href="/san-pham" className="btn-gold !py-3">
                Xem sản phẩm sâm Báo <ArrowRight size={16} />
              </Link>
              <Link
                href="/lien-he"
                className="rounded-xl border border-[var(--gold)] px-6 py-3 font-bold text-[var(--gold)] text-center transition hover:bg-[var(--gold)] hover:text-[#3a0a10]"
              >
                Liên hệ thăm quan vườn
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal phóng to ảnh */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] max-w-4xl w-full overflow-hidden rounded-2xl bg-stone-900 border border-[var(--gold)]/60 shadow-2xl flex flex-col"
          >
            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 z-20 rounded-full bg-black/80 p-2 text-white hover:text-[var(--gold)] transition border border-[var(--gold)]/40"
              aria-label="Đóng cửa sổ"
            >
              <X size={20} />
            </button>

            {/* Ảnh lớn */}
            <div className="relative flex-1 bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="h-full w-full object-contain max-h-[70vh]"
              />
            </div>

            {/* Chi tiết ảnh bên dưới */}
            <div className="bg-[#1c0205] p-4 sm:p-5 border-t border-[var(--gold)]/40 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-[var(--gold)]/20 px-2.5 py-0.5 text-[10px] font-bold text-[var(--gold-light)] border border-[var(--gold)]/30">
                  {activePhoto.tag}
                </span>
                <span className="text-[11px] text-stone-400">Hình ảnh chụp thực tế tại Núi Báo</span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[var(--gold-light)]">
                {activePhoto.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-stone-300">
                {activePhoto.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
