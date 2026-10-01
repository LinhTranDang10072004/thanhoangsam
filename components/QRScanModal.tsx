"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import QRCode from "qrcode";
import {
  QrCode,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Download,
  Copy,
  ExternalLink,
  RefreshCw,
  Search,
  Play,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { lots, type Lot } from "@/lib/data";

interface ProductPreset {
  name: string;
  sku: string;
  lotCode: string;
  harvest: string;
  packed: string;
  place: string;
  saponin: string;
  image: string;
  slug: string;
}

// Media gallery cho từng lô – ảnh thật + video từ /public/images/
const lotMediaMap: Record<string, Array<{ type: "image" | "video"; src: string; thumb?: string }>> = {
  "SB-2026-0915": [
    { type: "image", src: "/images/sam-bao-tuoi.jpg" },
    { type: "image", src: "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg" },
    { type: "image", src: "/images/1790691441922_2251207849705082306_2251207849705082306_49add4d443a5310c1f040d1325d4d802.jpg" },
    { type: "image", src: "/images/1790691441975_2251207849705082306_2251207849705082306_97f1219099e9b56dc9c0c7e8d40bec80.jpg" },
    { type: "image", src: "/images/1790691441998_2251207849705082306_2251207849705082306_a8baaafcabe1bc4601e12128627d81b0.jpg" },
    { type: "video", src: "/images/1790691441845_2251207849705082306_2251207849705082306.mp4" },
    { type: "video", src: "/images/1790691441875_2251207849705082306_2251207849705082306.mp4" },
  ],
  "SK-2026-0601": [
    { type: "image", src: "/images/sam-bao-kho.jpg" },
    { type: "image", src: "/images/1790691442022_2251207849705082306_2251207849705082306_6ad8864197f32490ffac32f52b5b6ebd.jpg" },
    { type: "image", src: "/images/1790691442045_2251207849705082306_2251207849705082306_8df163c6132ac12d701e8c1d5c6145fa.jpg" },
    { type: "image", src: "/images/1790691442069_2251207849705082306_2251207849705082306_38971826cc8331ac9d7612bd266f8633.jpg" },
    { type: "image", src: "/images/1790691442095_2251207849705082306_2251207849705082306_6d97ca5064721c8d9a1349080f124d78.jpg" },
    { type: "video", src: "/images/1790691441952_2251207849705082306_2251207849705082306.mp4" },
  ],
  "CS-2026-0802": [
    { type: "image", src: "/images/cao-sam-bao.jpg" },
    { type: "image", src: "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg" },
    { type: "image", src: "/images/1790691442144_2251207849705082306_2251207849705082306_7c4ce215dbe2225f393b15647133cb84.jpg" },
    { type: "image", src: "/images/1790691442168_2251207849705082306_2251207849705082306_051a85d7dfd861e704025cb3efdbb529.jpg" },
    { type: "image", src: "/images/1790691442192_2251207849705082306_2251207849705082306_261714ea9c39c974959288ba34fa0843.jpg" },
    { type: "video", src: "/images/1790691442241_2251207849705082306_2251207849705082306.mp4" },
  ],
  "RS-2026-0718": [
    { type: "image", src: "/images/ruou-sam-bao.jpg" },
    { type: "image", src: "/images/1790691442264_2251207849705082306_2251207849705082306_51677dc509da9a7f2ae3b3b674ae2c8a.jpg" },
    { type: "image", src: "/images/1790691442289_2251207849705082306_2251207849705082306_ea1efa9505c05626aeb4942b73d4488a.jpg" },
    { type: "image", src: "/images/1790691442314_2251207849705082306_2251207849705082306_9703c4794efb0550246cbeaf4930d7c6.jpg" },
    { type: "image", src: "/images/1790691442355_2251207849705082306_2251207849705082306_17ee32629c1429b7a8ac65adf693c575.jpg" },
    { type: "video", src: "/images/1790691442427_2251207849705082306_2251207849705082306.mp4" },
  ],
};

const lotExtras: Record<string, { sku: string; saponin: string; image: string; slug: string }> = {
  "SB-2026-0915": { sku: "THS-ST-01", saponin: "18.4 mg/g (Dược điển loại 1)", image: "/images/sam-bao-tuoi.jpg", slug: "sam-bao-tuoi" },
  "SK-2026-0601": { sku: "THS-SK-02", saponin: "17.2 mg/g (Sấy lạnh chân không)", image: "/images/sam-bao-kho.jpg", slug: "sam-bao-kho" },
  "CS-2026-0802": { sku: "THS-CS-03", saponin: "32.8 mg/g (Cô đặc 72 giờ)", image: "/images/cao-sam-bao.jpg", slug: "cao-sam-bao" },
  "RS-2026-0718": { sku: "THS-RS-04", saponin: "15.6 mg/g (Ngâm củ sâm 3 năm tuổi)", image: "/images/ruou-sam-bao.jpg", slug: "ruou-sam-bao" },
};

const productPresets: ProductPreset[] = [
  { name: "Sâm Báo Tươi Nguyên Củ (Hộp 1kg)", sku: "THS-ST-01", lotCode: "SB-2026-0915", harvest: "15/09/2026", packed: "16/09/2026", place: "Đỉnh núi Báo, xã Vĩnh Hùng, Vĩnh Lộc, Thanh Hóa", saponin: "18.4 mg/g (Dược điển loại 1)", image: "/images/sam-bao-tuoi.jpg", slug: "sam-bao-tuoi" },
  { name: "Sâm Báo Khô Thái Lát Thượng Hạng (Hộp 500g)", sku: "THS-SK-02", lotCode: "SK-2026-0601", harvest: "01/06/2026", packed: "05/06/2026", place: "Xưởng sấy thăng hoa chân không Vĩnh Lộc", saponin: "17.2 mg/g (Sấy lạnh chân không)", image: "/images/sam-bao-kho.jpg", slug: "sam-bao-kho" },
  { name: "Cao Sâm Báo Hoàng Triều (Hũ 200g)", sku: "THS-CS-03", lotCode: "CS-2026-0802", harvest: "02/08/2026", packed: "10/08/2026", place: "Khu chế biến sâu dược liệu Núi Báo", saponin: "32.8 mg/g (Cô đặc 72 giờ)", image: "/images/cao-sam-bao.jpg", slug: "cao-sam-bao" },
  { name: "Rượu Sâm Báo Hoàng Gia (Bình 2 Lít)", sku: "THS-RS-04", lotCode: "RS-2026-0718", harvest: "18/07/2026", packed: "22/07/2026", place: "Hầm ủ rượu truyền thống Vĩnh Lộc", saponin: "15.6 mg/g (Ngâm củ sâm 3 năm tuổi)", image: "/images/ruou-sam-bao.jpg", slug: "ruou-sam-bao" },
];

// ─── Gallery Component ───────────────────────────────────────────────
function MediaGallery({ lotCode }: { lotCode: string }) {
  const media = lotMediaMap[lotCode] ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = media[activeIdx];
  const prev = () => setActiveIdx((i) => (i - 1 + media.length) % media.length);
  const next = () => setActiveIdx((i) => (i + 1) % media.length);

  useEffect(() => {
    setActiveIdx(0);
  }, [lotCode]);

  if (media.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main viewer */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[var(--gold)]/40 bg-black shadow-2xl"
        style={{ aspectRatio: "16/9" }}>
        {current?.type === "image" ? (
          <img
            key={current.src}
            src={current.src}
            alt="Ảnh sản phẩm"
            className="w-full h-full object-cover animate-in fade-in duration-300"
          />
        ) : current?.type === "video" ? (
          <video
            ref={videoRef}
            key={current.src}
            src={current.src}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover animate-in fade-in duration-300"
          />
        ) : null}

        {/* Badge loại media */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm border border-white/20">
          {current?.type === "video" ? (
            <><Video className="h-3 w-3 text-red-400" /><span className="text-red-300">VIDEO</span></>
          ) : (
            <><ImageIcon className="h-3 w-3 text-amber-400" /><span className="text-amber-300">ẢNH THỰC TẾ</span></>
          )}
        </div>

        {/* Counter */}
        <div className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm border border-white/20">
          {activeIdx + 1} / {media.length}
        </div>

        {/* Prev/Next */}
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-[var(--gold)] hover:text-[#3a0a10] transition backdrop-blur-sm border border-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-[var(--gold)] hover:text-[#3a0a10] transition backdrop-blur-sm border border-white/20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {media.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {media.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative shrink-0 h-14 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === activeIdx
                  ? "border-[var(--gold)] shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                  : "border-white/20 opacity-60 hover:opacity-90 hover:border-[var(--gold)]/60"
              }`}
            >
              {item.type === "image" ? (
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-black/80 flex flex-col items-center justify-center gap-0.5">
                  <Play className="h-5 w-5 text-red-400 fill-red-400" />
                  <span className="text-[9px] text-red-300 font-bold">VIDEO</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────
export default function QRScanModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"scan" | "generate">("scan");

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>("");
  const [scannedLot, setScannedLot] = useState<Lot | null>(lots[0]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customSku, setCustomSku] = useState<string>("THS-ST-01");
  const [customLot, setCustomLot] = useState<string>("SB-2026-0915");
  const [customName, setCustomName] = useState<string>("Sâm Báo Tươi Nguyên Củ");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [originUrl, setOriginUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin);
    }
  }, []);

  const generateQRCode = useCallback(async () => {
    try {
      const baseUrl = originUrl || "https://thanhoangsam.vn";
      const verifyUrl = `${baseUrl}/nguon-goc?lot=${encodeURIComponent(customLot.trim())}&sku=${encodeURIComponent(customSku.trim())}`;
      const url = await QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 2,
        color: { dark: "#2b0609", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error("Lỗi sinh QR code:", err);
    }
  }, [originUrl, customLot, customSku]);

  useEffect(() => {
    if (isOpen && activeTab === "generate") {
      generateQRCode();
    }
  }, [isOpen, activeTab, generateQRCode]);

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    const p = productPresets[index];
    setCustomName(p.name);
    setCustomSku(p.sku);
    setCustomLot(p.lotCode);
  };

  const handleCopyLink = () => {
    const baseUrl = originUrl || "https://thanhoangsam.vn";
    const link = `${baseUrl}/nguon-goc?lot=${encodeURIComponent(customLot.trim())}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `Tem-QR-ThanhHoangSam-${customLot}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleScanCode = (codeToScan: string) => {
    const trimmed = codeToScan.trim();
    if (!trimmed) return;
    setIsScanning(true);
    setHasError(false);
    setTimeout(() => {
      setIsScanning(false);
      const found = lots.find((l) => l.code.toLowerCase() === trimmed.toLowerCase());
      if (found) {
        setScannedLot(found);
        setHasError(false);
      } else {
        setScannedLot(null);
        setHasError(true);
      }
    }, 400);
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && activeTab === "scan" && cameraActive && !capturedPhotoUrl) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 640 } } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch(() => { setCameraActive(false); });
      }
    }
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [isOpen, activeTab, cameraActive, capturedPhotoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhotoUrl(dataUrl);
      setCameraActive(false);
      handleScanCode("SB-2026-0915");
    };
    reader.readAsDataURL(file);
  };

  // Khoá scroll body khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const extra = scannedLot ? lotExtras[scannedLot.code] : null;

  // createPortal: render thẳng vào document.body để thoát khỏi stacking context của <header>
  // Header có backdrop-blur-md (backdrop-filter) → tạo stacking context mới → fixed bị "trap"
  return createPortal(
    /* Overlay – fixed, toàn màn hình, căn giữa hoàn toàn */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ padding: "clamp(8px, 3vw, 24px)" }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" aria-hidden="true" />

      {/* Modal box – tự căn giữa qua flex parent */}
      <div
        className="relative z-10 flex w-full flex-col rounded-2xl sm:rounded-3xl border-2 border-[var(--gold)] bg-[#160204] text-white shadow-[0_32px_80px_rgba(0,0,0,0.95)]"
        style={{
          maxWidth: "680px",
          maxHeight: "calc(100dvh - clamp(16px, 6vw, 48px))",
          minHeight: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between border-b border-[var(--gold)]/30 bg-gradient-to-r from-[var(--red)] to-[#3a0a10] px-4 py-3 sm:px-6 sm:py-3.5 rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)] text-[#3a0a10] shadow font-bold">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-black tracking-wide text-[var(--gold-light)] uppercase leading-tight">
                Tra Cứu Số Lô & Quét Mã Tem
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-200">
                Xác thực nguồn gốc hộp sâm chính hãng Thanh Hoàng Sâm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--gold-light)] hover:bg-white/10 hover:text-white transition"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="shrink-0 flex border-b border-[var(--gold)]/30 bg-black/50 px-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === "scan"
                ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/15 rounded-t-lg"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Quét / Tra cứu số lô</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("generate")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === "generate"
                ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/15 rounded-t-lg"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Tự tạo tem QR</span>
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 touch-pan-y">

          {/* ═══ TAB 1: QUÉT / TRA CỨU ═══ */}
          {activeTab === "scan" && (
            <div className="space-y-4 animate-in fade-in">
              {/* Hướng dẫn */}
              <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-xs text-[var(--gold-light)] flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--gold)] mt-0.5" />
                <p>
                  Quý khách đã mua sản phẩm về có thể <b>Chụp ảnh tem QR</b> hoặc <b>bật Camera quét trực tiếp</b> để tra cứu ngày thu hoạch, số lô sản xuất và vùng trồng sâm chính hãng.
                </p>
              </div>

              {/* Nút chụp / camera */}
              <div className="rounded-2xl border-2 border-[var(--gold)]/60 bg-gradient-to-b from-[#2b0508] to-black/60 p-4 text-center space-y-3 shadow-lg">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-gold w-full sm:w-auto !py-3 !px-6 text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition"
                  >
                    <Camera className="h-5 w-5 text-[#3a0a10]" />
                    <span>Chụp ảnh tem trên vỏ hộp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCameraActive(!cameraActive); setCapturedPhotoUrl(null); }}
                    className="w-full sm:w-auto rounded-xl border border-[var(--gold)]/50 bg-black/60 px-4 py-3 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#3a0a10] transition flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>{cameraActive ? "Tắt Camera" : "Mở Camera quét trực tiếp"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-300">📱 Bấm chụp bằng điện thoại hoặc chọn ảnh chụp tem từ máy tính</p>
              </div>

              {/* Khung camera / ảnh đã chụp */}
              {(cameraActive || capturedPhotoUrl) && (
                <div className="relative mx-auto flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--gold)] bg-black shadow-inner">
                  {capturedPhotoUrl ? (
                    <div className="relative h-full w-full">
                      <img src={capturedPhotoUrl} alt="Ảnh chụp tem" className="h-full w-full object-contain bg-black" />
                      <button
                        type="button"
                        onClick={() => setCapturedPhotoUrl(null)}
                        className="absolute top-2 right-2 rounded-full bg-red-600/80 p-1 text-white hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <video ref={videoRef} playsInline muted autoPlay className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  {!capturedPhotoUrl && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                        <div className="absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-[var(--gold)]" />
                        <div className="absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-[var(--gold)]" />
                        <div className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-[var(--gold)]" />
                        <div className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-[var(--gold)]" />
                        <div className="absolute left-1 right-1 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] text-[var(--gold-light)] backdrop-blur-md border border-[var(--gold)]/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{capturedPhotoUrl ? "Đã nạp ảnh tem" : "Hướng camera vào tem hộp"}</span>
                  </div>
                </div>
              )}

              {/* Nhập tay mã lô */}
              <div className="rounded-xl border border-[var(--gold)]/30 bg-black/40 p-3 space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Hoặc nhập mã số lô in trên tem:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleScanCode(inputCode); }}
                    placeholder="VD: SB-2026-0915..."
                    className="flex-1 rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleScanCode(inputCode)}
                    disabled={!inputCode.trim() || isScanning}
                    className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1 shadow disabled:opacity-50"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>{isScanning ? "..." : "Tra cứu"}</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className="text-stone-400">Thử nhanh mã:</span>
                  {lots.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => { setInputCode(l.code); handleScanCode(l.code); }}
                      className={`rounded-lg border px-2 py-0.5 font-mono text-[11px] transition ${
                        scannedLot?.code === l.code
                          ? "border-[var(--gold)] bg-[var(--gold)] text-[#3a0a10] font-bold"
                          : "border-[var(--gold)]/40 bg-black/50 text-[var(--gold-light)] hover:bg-[var(--gold)]/20"
                      }`}
                    >
                      {l.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* KẾT QUẢ XÁC THỰC – redesigned với gallery */}
              {scannedLot && (
                <div className="rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-b from-[#0a2312] to-[#041108] p-4 shadow-2xl animate-in fade-in space-y-4">
                  {/* Header kết quả */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base">CHỨNG THỰC CHÍNH HÃNG 100%</h4>
                        <p className="text-[10px] text-emerald-300">Bảo chứng nguồn gốc Thanh Hoàng Sâm Vĩnh Lộc</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-black text-emerald-300 border border-emerald-400/40">
                      SỐ LÔ: {scannedLot.code}
                    </span>
                  </div>

                  {/* Gallery ảnh thật + video */}
                  <MediaGallery lotCode={scannedLot.code} />

                  {/* Thông tin lô hàng */}
                  <div className="rounded-xl border border-emerald-500/30 bg-black/40 p-3 space-y-2 text-xs text-stone-200">
                    <p className="text-sm font-bold text-[var(--gold-light)]">{scannedLot.product}</p>
                    {extra && (
                      <p className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Mã SKU: <b className="text-white font-mono">{extra.sku}</b></span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Nơi trồng: <b>{scannedLot.place}</b></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span>Thu hoạch: <b>{scannedLot.harvest}</b> • Đóng gói: <b>{scannedLot.packed}</b></span>
                    </p>
                    {extra && (
                      <p className="text-xs text-emerald-300 font-semibold">
                        Dược chất Saponin: {extra.saponin}
                      </p>
                    )}
                    <p className="text-[11px] text-stone-400 italic pt-1 border-t border-emerald-500/20">
                      {scannedLot.note}
                    </p>
                  </div>

                  {/* CTA */}
                  {extra && (
                    <div className="flex justify-end">
                      <Link
                        href={`/san-pham/${extra.slug}`}
                        onClick={onClose}
                        className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>Xem chi tiết sản phẩm</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Lỗi không tìm thấy */}
              {hasError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/60 bg-rose-950/40 p-3 text-xs text-rose-200 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Không tìm thấy mã số này</p>
                    <p className="text-[11px] mt-0.5 text-stone-300">
                      Vui lòng kiểm tra lại tem in trên vỏ hộp hoặc gọi hotline 0918 168 888 để được hỗ trợ.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB 2: TẠO TEM QR ═══ */}
          {activeTab === "generate" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-xs text-[var(--gold-light)] flex items-start gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-[var(--gold)] mt-0.5" />
                <p>Tự động sinh tem QR chính hãng để in ấn dán lên hộp sản phẩm. Khách mua về quét tem sẽ ra đúng số lô này.</p>
              </div>

              {/* Chọn sản phẩm */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-1.5">Chọn sản phẩm để tạo tem:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {productPresets.map((p, idx) => (
                    <button
                      key={p.sku}
                      type="button"
                      onClick={() => handleSelectPreset(idx)}
                      className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                        selectedPresetIndex === idx
                          ? "border-[var(--gold)] bg-[var(--red)] text-white shadow font-bold scale-[1.02]"
                          : "border-[var(--gold)]/40 bg-black/40 text-stone-300 hover:border-[var(--gold)]"
                      }`}
                    >
                      <span className="font-mono text-xs text-[var(--gold-light)]">{p.sku}</span>
                      <span className="line-clamp-1 mt-0.5 text-[11px]">{p.name.split(" (")[0]}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{p.lotCode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhập SKU & Số lô */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl border border-[var(--gold)]/30 bg-black/40 p-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Mã sản phẩm (SKU):</label>
                  <input
                    type="text"
                    value={customSku}
                    onChange={(e) => setCustomSku(e.target.value)}
                    className="w-full rounded-lg border border-[var(--gold)]/40 bg-black/60 px-3 py-1.5 text-xs text-white font-mono focus:border-[var(--gold)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Số lô sản xuất (LOT):</label>
                  <input
                    type="text"
                    value={customLot}
                    onChange={(e) => setCustomLot(e.target.value)}
                    className="w-full rounded-lg border border-[var(--gold)]/40 bg-black/60 px-3 py-1.5 text-xs text-white font-mono focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>

              {/* Tem QR */}
              <div className="relative mx-auto max-w-xs rounded-2xl border-2 border-[var(--gold)] bg-gradient-to-b from-white via-stone-50 to-amber-50/50 p-3.5 text-[#2b0609] shadow-2xl">
                <div className="text-center pb-1.5 border-b border-amber-300/80">
                  <div className="inline-block rounded-full bg-[var(--red)] px-2 py-0.5 text-[9px] font-black uppercase text-[var(--gold-light)] shadow-sm">
                    TEM BẢO CHỨNG CHÍNH HÃNG
                  </div>
                  <h4 className="font-heading text-xs font-black tracking-wide text-[var(--red)] uppercase mt-0.5">THANH HOÀNG SÂM</h4>
                  <p className="text-[9px] text-stone-600">Sâm Báo Vĩnh Lộc – Đại Việt Đệ Nhất Danh Sâm</p>
                </div>
                <div className="my-2 flex flex-col items-center justify-center">
                  <div className="relative rounded-lg border border-amber-400 bg-white p-1.5 shadow-inner">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="Mã QR" className="h-36 w-36 sm:h-40 sm:w-40 object-contain" />
                    ) : (
                      <div className="h-36 w-36 flex items-center justify-center text-xs text-stone-400">Đang tạo mã...</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-7 w-7 rounded-full bg-white p-0.5 shadow border border-[var(--gold)]">
                        <img src="/images/logo.png" alt="Logo" className="h-full w-full rounded-full object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-0.5 rounded-lg bg-amber-100/60 p-2 text-[10px] border border-amber-200">
                  <div className="flex justify-between font-bold">
                    <span>Mã SKU:</span>
                    <span className="font-mono text-[var(--red)]">{customSku}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Số lô (LOT):</span>
                    <span className="font-mono text-emerald-800">{customLot}</span>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button type="button" onClick={handleDownloadQR} className="btn-gold !py-2 !px-3.5 text-xs font-bold flex items-center gap-1.5 shadow">
                  <Download className="h-4 w-4" />
                  <span>Tải ảnh Tem QR (PNG)</span>
                </button>
                <button type="button" onClick={handleCopyLink} className="rounded-xl border border-[var(--gold)]/60 bg-black/50 px-3.5 py-2 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#3a0a10] transition flex items-center gap-1.5">
                  <Copy className="h-4 w-4" />
                  <span>{copiedLink ? "Đã chép link!" : "Sao chép link"}</span>
                </button>
                <Link
                  href={`/nguon-goc?lot=${encodeURIComponent(customLot)}`}
                  onClick={onClose}
                  className="rounded-xl border border-emerald-500/60 bg-emerald-950/50 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition flex items-center gap-1.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Xem trang xác thực</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
