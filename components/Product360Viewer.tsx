"use client";

import { useState, useRef, useEffect } from "react";
import {
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sparkles,
  Compass,
  RotateCw,
} from "lucide-react";
import type { Product } from "@/lib/data";

interface Hotspot {
  id: string;
  title: string;
  desc: string;
  angle: number; // Góc quay tối ưu để nhìn hotspot (độ)
  x: number; // Vị trí % ngang
  y: number; // Vị trí % dọc
  z: number; // Chiều sâu Z (px)
}

const productHotspots: Record<string, Hotspot[]> = {
  "sam-bao-tuoi": [
    {
      id: "flower",
      title: "Hoa vàng 5 cánh núi Báo",
      desc: "Đặc điểm nhận diện duy nhất của sâm Báo mọc tự nhiên trên núi Báo, xã Vĩnh Hùng.",
      angle: 0,
      x: 52,
      y: 16,
      z: 35,
    },
    {
      id: "body",
      title: "Thân củ già 2 năm tuổi",
      desc: "Thớ sâm chắc, màu vàng ngà tự nhiên, chứa hàm lượng saponin và dưỡng chất cao nhất.",
      angle: 45,
      x: 50,
      y: 48,
      z: 25,
    },
    {
      id: "roots",
      title: "Gốc & Rễ chùm tự nhiên",
      desc: "Hệ rễ con tỏa rộng tự nhiên thu hái thủ công, giữ trọn vẹn cả rễ cái và rễ phụ không cắt tỉa.",
      angle: 180,
      x: 48,
      y: 82,
      z: 30,
    },
  ],
  "sam-bao-kho": [
    {
      id: "slice",
      title: "Lát sâm sấy thăng hoa",
      desc: "Giữ 98% hoạt chất quý, màu vàng óng ánh hổ phách và hương thơm thảo mộc dịu nhẹ.",
      angle: 25,
      x: 50,
      y: 35,
      z: 30,
    },
    {
      id: "rings",
      title: "Vân sâm 4 năm tuổi",
      desc: "Vân vòng đồng tâm rõ nét chứng minh độ tuổi củ sâm thu hái đúng chuẩn.",
      angle: 120,
      x: 45,
      y: 55,
      z: 25,
    },
    {
      id: "pack",
      title: "Túi hút chân không 2 lớp",
      desc: "Chống ẩm mốc tuyệt đối, có tem niêm phong và mã QR truy xuất từng mẻ sấy.",
      angle: 240,
      x: 52,
      y: 75,
      z: 20,
    },
  ],
  "cao-sam-bao": [
    {
      id: "cap",
      title: "Nắp kim loại mạ vàng dập nổi",
      desc: "Niêm phong màng nhôm vô trùng kín khí, ngăn oxy hóa và giữ trọn hương vị cao.",
      angle: 0,
      x: 50,
      y: 22,
      z: 35,
    },
    {
      id: "extract",
      title: "Chất cao sâm cô đặc",
      desc: "Nấu cô chân không 72 giờ từ củ sâm tươi 3 năm tuổi, độ sánh dẻo tự nhiên.",
      angle: 135,
      x: 50,
      y: 52,
      z: 30,
    },
    {
      id: "lot",
      title: "Tem truy xuất mã số mẻ nấu",
      desc: "Quét QR để kiểm tra ngày cô cao, kiểm định an toàn vệ sinh thực phẩm.",
      angle: 220,
      x: 52,
      y: 78,
      z: 25,
    },
  ],
  "ruou-sam-bao": [
    {
      id: "seal",
      title: "Nút bấc xi đỏ truyền thống",
      desc: "Niêm phong sáp đỏ thủ công, giữ nồng độ rượu êm dịu và không bị bay hơi.",
      angle: 0,
      x: 50,
      y: 18,
      z: 35,
    },
    {
      id: "submerged",
      title: "Củ sâm ngâm nguyên cây",
      desc: "Chọn củ sâm đẹp nhất 3 năm tuổi, rễ cành bung tỏa trọn vẹn trong bình thủy tinh.",
      angle: 90,
      x: 50,
      y: 52,
      z: 30,
    },
    {
      id: "glass",
      title: "Bình thủy tinh cao cấp",
      desc: "Thủy tinh không chì, trong suốt giúp quan sát màu rượu vàng óng theo thời gian ngâm.",
      angle: 270,
      x: 50,
      y: 80,
      z: 25,
    },
  ],
};

const defaultHotspots: Hotspot[] = [
  {
    id: "d1",
    title: "Mặt trước sản phẩm",
    desc: "Được tuyển chọn kĩ lưỡng từ vùng trồng dược liệu núi Báo.",
    angle: 0,
    x: 50,
    y: 30,
    z: 30,
  },
  {
    id: "d2",
    title: "Chứng nhận chất lượng",
    desc: "Đạt chuẩn OCOP và có mã QR truy xuất nguồn gốc từng mẻ.",
    angle: 120,
    x: 50,
    y: 60,
    z: 25,
  },
  {
    id: "d3",
    title: "Gốc rễ & Đóng gói",
    desc: "Bao bì sang trọng, lót chống sốc cao cấp bảo vệ trọn vẹn sản phẩm.",
    angle: 240,
    x: 50,
    y: 75,
    z: 25,
  },
];

export default function Product360Viewer({ product }: { product: Product }) {
  const [rotation, setRotation] = useState({ y: 0, x: -4 });
  const [zoom, setZoom] = useState(1);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number; ry: number; rx: number } | null>(null);
  const spinInterval = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null);

  const hotspots = productHotspots[product.slug] || defaultHotspots;
  const normalizedAngle = Math.round(((rotation.y % 360) + 360) % 360);

  // Tự động xoay chậm nhẹ nhàng khi chưa tương tác (chuẩn phong cách Apple / Yamaha 360)
  useEffect(() => {
    if (!isAutoSpin || isDragging) {
      if (spinInterval.current) clearInterval(spinInterval.current);
      return;
    }

    spinInterval.current = setInterval(() => {
      setRotation((prev) => ({
        ...prev,
        y: prev.y + 0.45, // Tốc độ xoay êm dịu, không giật
      }));
    }, 30);

    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current);
    };
  }, [isAutoSpin, isDragging]);

  // Kéo chuột / vuốt tay để xoay camera 360 mượt mà
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    setHasInteracted(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);

    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ry: rotation.y,
      rx: rotation.x,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    const newY = dragStart.current.ry + deltaX * 0.55;
    const newX = Math.max(-20, Math.min(18, dragStart.current.rx - deltaY * 0.18));

    setRotation({ y: newY, x: newX });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStart.current = null;

    // Tự động bật lại xoay nhẹ sau 4 giây không tương tác
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      setIsAutoSpin(true);
    }, 4000);
  };

  const handleSelectHotspot = (hs: Hotspot) => {
    setIsAutoSpin(false);
    setHasInteracted(true);
    setActiveHotspot(activeHotspot?.id === hs.id ? null : hs);
    setRotation({ y: hs.angle, x: -4 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
          : "w-full"
      }`}
    >
      {/* Khung sàn Studio 360 (Showroom Floor) - Thiết kế tối giản, sang trọng chuẩn shop quốc tế */}
      <div
        className={`relative w-full overflow-hidden rounded-3xl border-3 border-[var(--gold)]/80 bg-gradient-to-b from-[#240306] via-[#140103] to-[#0a0002] shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all ${
          isFullscreen ? "h-[88vh] max-w-5xl" : "h-[460px] sm:h-[520px]"
        }`}
      >
        {/* Header HUD Tinh tế: Badge 360° & Góc độ */}
        <div className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-black/75 px-3 py-1.5 backdrop-blur-md shadow-md">
            <RotateCw className="h-3.5 w-3.5 text-[var(--gold)] animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-light)]">
              Xoay 360° Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--gold)]/40 bg-black/75 px-3 py-1.5 text-xs font-mono font-bold text-[var(--gold)] backdrop-blur-md shadow-md">
              <Compass className="h-3.5 w-3.5" />
              <span>{normalizedAngle}°</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="pointer-events-auto rounded-full border border-[var(--gold)]/40 bg-black/75 p-2 text-[var(--gold-light)] transition hover:bg-[var(--gold)] hover:text-[#3a0a10]"
              title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
              aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Khung tương tác xoay 3D trực tiếp (Showroom 3D Stage) */}
        <div
          className="relative flex h-full w-full cursor-grab items-center justify-center touch-none active:cursor-grabbing pb-10"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ perspective: "1200px" }}
        >
          {/* Ánh sáng đèn trần Studio chiếu xuống đối tượng */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 transition-transform duration-300"
            style={{
              background: `radial-gradient(ellipse at ${
                50 + Math.sin((rotation.y * Math.PI) / 180) * 28
              }% 25%, rgba(246, 227, 161, 0.45) 0%, rgba(155, 17, 30, 0.15) 50%, transparent 75%)`,
            }}
          />

          {/* Bàn xoay Studio mặt sàn kiểu Yamaha (Turntable Stage) */}
          <div
            className="pointer-events-none absolute bottom-10 flex items-center justify-center transition-transform duration-100"
            style={{
              transform: `rotateX(74deg) rotateZ(${rotation.y}deg) scale(${zoom})`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Vành bàn xoay kim loại viền vàng */}
            <div className="relative flex h-88 w-88 items-center justify-center rounded-full border-4 border-dashed border-[var(--gold)]/60 bg-black/70 shadow-[0_0_60px_rgba(212,160,23,0.35)]">
              <span className="absolute top-2.5 text-[10px] font-black tracking-wider text-[var(--gold)]">
                0° MẶT TRƯỚC
              </span>
              <span className="absolute right-2.5 text-[10px] font-black tracking-wider text-[var(--gold)]">
                90° PHẢI
              </span>
              <span className="absolute bottom-2.5 text-[10px] font-black tracking-wider text-[var(--gold)]">
                180° SAU
              </span>
              <span className="absolute left-2.5 text-[10px] font-black tracking-wider text-[var(--gold)]">
                270° TRÁI
              </span>
              <div className="h-64 w-64 rounded-full border border-[var(--gold)]/30 bg-gradient-to-tr from-[#3a0a10] to-[#120204]" />
            </div>
            {/* Vết bóng đổ tiếp xúc sàn ngay chân rễ */}
            <div className="absolute h-44 w-44 rounded-full bg-black/90 blur-xl" />
          </div>

          {/* VẬT THỂ SẢN PHẨM 3D: CỦ SÂM NGUYÊN GỐC RỄ ĐỨNG TỰ DO */}
          <div
            className="relative flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Đồ họa củ sâm nguyên rễ đứng trực tiếp trên sàn */}
            <div
              className="relative flex items-center justify-center"
              style={{ transform: "translateZ(30px)" }}
            >
              {renderYamahaVisual(product)}
            </div>

            {/* Các điểm Hotspot gắn trên củ sâm (xoay theo không gian 3D) */}
            {hotspots.map((hs) => {
              const rad = ((rotation.y + hs.angle) * Math.PI) / 180;
              const isFacingFront = Math.cos(rad) >= -0.3;
              const isSelected = activeHotspot?.id === hs.id;

              return (
                <div
                  key={hs.id}
                  className={`absolute transition-opacity duration-300 ${
                    isFacingFront ? "opacity-100 pointer-events-auto" : "opacity-20 pointer-events-none"
                  }`}
                  style={{
                    left: `${hs.x}%`,
                    top: `${hs.y}%`,
                    transform: `translate(-50%, -50%) translateZ(${hs.z}px)`,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectHotspot(hs);
                    }}
                    className={`group relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isSelected
                        ? "scale-125 border-white bg-[var(--red)] shadow-[0_0_20px_#f0c24b]"
                        : "border-[var(--gold)] bg-black/85 hover:scale-110 hover:border-white shadow-lg"
                    }`}
                    title={hs.title}
                    aria-label={`Xem đặc điểm: ${hs.title}`}
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--gold)] opacity-60" />
                    <Sparkles className="h-3.5 w-3.5 text-[var(--gold-light)] group-hover:text-white" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dòng chỉ dẫn vuốt xoay trực quan (tự biến mất sau khi người dùng kéo) */}
          <div
            className={`pointer-events-none absolute bottom-4 z-10 flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-black/75 px-4 py-1.5 text-xs text-[var(--gold-light)] backdrop-blur-md shadow-lg transition-opacity duration-500 ${
              hasInteracted && !isDragging ? "opacity-60" : "opacity-100"
            }`}
          >
            <span className="text-[var(--gold)] font-bold text-sm">◄</span>
            <span>Chạm hoặc kéo sang 2 bên để xoay 360°</span>
            <span className="text-[var(--gold)] font-bold text-sm">►</span>
          </div>
        </div>

        {/* Cụm nút điều khiển nổi mờ tinh tế bên góc dưới phải */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
          {/* Nút tự động xoay */}
          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition ${
              isAutoSpin
                ? "border-[var(--gold)] bg-[var(--gold)] text-[#3a0a10] font-bold"
                : "border-[var(--gold)]/40 bg-black/70 text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#3a0a10]"
            }`}
            title={isAutoSpin ? "Dừng tự xoay" : "Bật tự xoay 360°"}
            aria-label={isAutoSpin ? "Dừng tự xoay" : "Bật tự xoay 360°"}
          >
            {isAutoSpin ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
          </button>

          {/* Phóng to */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(1)))}
            disabled={zoom >= 1.6}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-black/70 text-[var(--gold-light)] shadow-md backdrop-blur-md transition hover:bg-[var(--gold)] hover:text-[#3a0a10] disabled:opacity-30"
            title="Phóng to"
            aria-label="Phóng to"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          {/* Thu nhỏ */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}
            disabled={zoom <= 0.8}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-black/70 text-[var(--gold-light)] shadow-md backdrop-blur-md transition hover:bg-[var(--gold)] hover:text-[#3a0a10] disabled:opacity-30"
            title="Thu nhỏ"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          {/* Reset góc 0 */}
          <button
            type="button"
            onClick={() => {
              setRotation({ y: 0, x: -4 });
              setZoom(1);
              setIsAutoSpin(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-black/70 text-[var(--gold-light)] shadow-md backdrop-blur-md transition hover:bg-[var(--gold)] hover:text-[#3a0a10]"
            title="Đặt lại mặt trước (0°)"
            aria-label="Đặt lại mặt trước"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Card hiển thị chi tiết khi bấm Hotspot */}
        {activeHotspot && (
          <div className="absolute bottom-16 left-4 right-16 z-30 max-w-sm rounded-2xl border-2 border-[var(--gold)] bg-[#2a0508]/95 p-4 text-white shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-2 sm:left-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)] text-xs font-bold text-[#3a0a10]">
                  ★
                </span>
                <h4 className="font-extrabold text-[var(--gold-light)]">{activeHotspot.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="text-xs text-[var(--gold-light)] hover:text-white"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-200">
              {activeHotspot.desc}
            </p>
          </div>
        )}
      </div>

      {/* Thẻ mô tả các điểm đặc trưng (Hotspot chips) - Bấm vào là củ sâm tự động xoay tới góc đó */}
      <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {hotspots.map((hs, idx) => (
          <button
            key={hs.id}
            type="button"
            onClick={() => handleSelectHotspot(hs)}
            className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
              activeHotspot?.id === hs.id
                ? "border-[var(--red)] bg-[#fff3f4] ring-2 ring-[var(--red)]/20 shadow-sm"
                : "border-[var(--gold-light)] bg-white hover:border-[var(--gold)] hover:bg-[#fffdf8]"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                activeHotspot?.id === hs.id
                  ? "bg-[var(--red)] text-white"
                  : "bg-[var(--gold-light)] text-[var(--red)]"
              }`}
            >
              0{idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[var(--red)]">{hs.title}</p>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-600">{hs.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Render củ sâm nguyên gốc rễ hoa vàng đứng tự do trong không gian 3D
function renderYamahaVisual(product: Product) {
  const isSamTuoi = product.slug === "sam-bao-tuoi";
  const imgSrc = isSamTuoi
    ? "/images/1790691441922_2251207849705082306_2251207849705082306_49add4d443a5310c1f040d1325d4d802.jpg"
    : product.image || "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg";

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Củ sâm thật nguyên gốc rễ đứng tự do trên sàn */}
      <div className="relative flex items-center justify-center pointer-events-none select-none">
        <img
          src={imgSrc}
          alt={product.name}
          className={`object-contain transition-all duration-150 ${
            isSamTuoi
              ? "h-[330px] sm:h-[400px] w-auto max-w-[340px] sm:max-w-[420px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter"
              : "h-72 w-72 sm:h-80 sm:w-80 rounded-2xl object-cover border-2 border-[var(--gold)]/50 shadow-2xl"
          }`}
          style={
            isSamTuoi
              ? {
                  filter:
                    "drop-shadow(0 20px 25px rgba(0,0,0,0.9)) drop-shadow(0 0 35px rgba(212,160,23,0.4))",
                }
              : undefined
          }
        />
      </div>

      {/* Bóng đổ tiếp xúc mặt sàn ngay chân rễ */}
      <div
        className="pointer-events-none absolute -bottom-4 h-10 w-56 rounded-[100%] bg-black/85 blur-md"
        style={{ transform: "rotateX(75deg)" }}
      />
    </div>
  );
}
