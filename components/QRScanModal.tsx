"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Upload,
  RefreshCw,
  Search,
  Check,
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

const productPresets: ProductPreset[] = [
  {
    name: "Sâm Báo Tươi Nguyên Củ (Hộp 1kg)",
    sku: "THS-ST-01",
    lotCode: "SB-2026-0915",
    harvest: "15/09/2026",
    packed: "16/09/2026",
    place: "Đỉnh núi Báo, xã Vĩnh Hùng, Vĩnh Lộc, Thanh Hóa",
    saponin: "18.4 mg/g (Dược điển loại 1)",
    image: "/images/sam-bao-tuoi.jpg",
    slug: "sam-bao-tuoi",
  },
  {
    name: "Sâm Báo Khô Thái Lát Thượng Hạng (Hộp 500g)",
    sku: "THS-SK-02",
    lotCode: "SK-2026-0601",
    harvest: "01/06/2026",
    packed: "05/06/2026",
    place: "Xưởng sấy thăng hoa chân không Vĩnh Lộc",
    saponin: "17.2 mg/g (Sấy lạnh chân không)",
    image: "/images/sam-bao-kho.jpg",
    slug: "sam-bao-kho",
  },
  {
    name: "Cao Sâm Báo Hoàng Triều (Hũ 200g)",
    sku: "THS-CS-03",
    lotCode: "CS-2026-0802",
    harvest: "02/08/2026",
    packed: "10/08/2026",
    place: "Khu chế biến sâu dược liệu Núi Báo",
    saponin: "32.8 mg/g (Cô đặc 72 giờ)",
    image: "/images/cao-sam-bao.jpg",
    slug: "cao-sam-bao",
  },
  {
    name: "Rượu Sâm Báo Hoàng Gia (Bình 2 Lít)",
    sku: "THS-RS-04",
    lotCode: "RS-2026-0718",
    harvest: "18/07/2026",
    packed: "22/07/2026",
    place: "Hầm ủ rượu truyền thống Vĩnh Lộc",
    saponin: "15.6 mg/g (Ngâm củ sâm 3 năm tuổi)",
    image: "/images/ruou-sam-bao.jpg",
    slug: "ruou-sam-bao",
  },
];

export default function QRScanModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Mặc định mở Tab Quét / Chụp ảnh tra cứu số lô cho khách hàng mua về kiểm tra
  const [activeTab, setActiveTab] = useState<"scan" | "generate">("scan");

  // Tab 1 (scan): Tra cứu số lô & Chụp ảnh tem
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>("");
  const [scannedLot, setScannedLot] = useState<Lot | null>(lots[0]); // Mặc định hiển thị sẵn lô đầu tiên để khách thấy rõ mẫu
  const [hasError, setHasError] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab 2 (generate): Tự tạo tem QR
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customSku, setCustomSku] = useState<string>("THS-ST-01");
  const [customLot, setCustomLot] = useState<string>("SB-2026-0915");
  const [customName, setCustomName] = useState<string>("Sâm Báo Tươi Nguyên Củ");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [originUrl, setOriginUrl] = useState<string>("");

  // Lấy origin của website hiện tại
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin);
    }
  }, []);

  // Tự động sinh mã QR khi ở tab generate
  const generateQRCode = useCallback(async () => {
    try {
      const baseUrl = originUrl || "https://thanhoangsam.vn";
      const verifyUrl = `${baseUrl}/nguon-goc?lot=${encodeURIComponent(
        customLot.trim()
      )}&sku=${encodeURIComponent(customSku.trim())}`;

      const url = await QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#2b0609",
          light: "#ffffff",
        },
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

  // Khi chọn preset sản phẩm
  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    const p = productPresets[index];
    setCustomName(p.name);
    setCustomSku(p.sku);
    setCustomLot(p.lotCode);
  };

  // Sao chép link xác thực
  const handleCopyLink = () => {
    const baseUrl = originUrl || "https://thanhoangsam.vn";
    const link = `${baseUrl}/nguon-goc?lot=${encodeURIComponent(customLot.trim())}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  // Tải tem QR về máy
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `Tem-QR-ThanhHoangSam-${customLot}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Quét / Tra cứu mã số lô
  const handleScanCode = (codeToScan: string) => {
    const trimmed = codeToScan.trim();
    if (!trimmed) return;
    setIsScanning(true);
    setHasError(false);

    setTimeout(() => {
      setIsScanning(false);
      const found = lots.find(
        (l) => l.code.toLowerCase() === trimmed.toLowerCase()
      );
      if (found) {
        setScannedLot(found);
        setHasError(false);
      } else {
        setScannedLot(null);
        setHasError(true);
      }
    }, 400);
  };

  // Quản lý Camera trực tiếp
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && activeTab === "scan" && cameraActive && !capturedPhotoUrl) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 640 },
              height: { ideal: 640 },
            },
          })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch(() => {
            setCameraActive(false);
          });
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, activeTab, cameraActive, capturedPhotoUrl]);

  // Xử lý khi khách hàng bấm "Chụp ảnh / Tải ảnh tem trên vỏ hộp"
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhotoUrl(dataUrl);
      setCameraActive(false);
      // Giả lập nhận diện mã QR từ ảnh chụp tem thực tế của khách hàng
      handleScanCode("SB-2026-0915");
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-2 sm:p-4 backdrop-blur-md overscroll-contain animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative my-auto flex w-full max-w-xl md:max-w-2xl max-h-[92vh] flex-col rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-[var(--gold)] bg-[#160204] text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal - Cố định trên đỉnh (shrink-0) */}
        <div className="shrink-0 flex items-center justify-between border-b border-[var(--gold)]/30 bg-gradient-to-r from-[var(--red)] to-[#3a0a10] px-4 py-3 sm:px-6 sm:py-3.5">
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
            aria-label="Đóng bảng tra cứu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Thanh chuyển Tab - Cố định (shrink-0) */}
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
            <span>Quét / Chụp ảnh tra cứu số lô</span>
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
            <span>Tự tạo tem QR (In ấn)</span>
          </button>
        </div>

        {/* Thân Modal - Cuộn mượt mà 100% với flex-1 min-h-0 overflow-y-auto */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 touch-pan-y scrollbar-thin">
          {/* ================= TAB 1: QUÉT / CHỤP ẢNH TRA CỨU SỐ LÔ SẢN PHẨM ================= */}
          {activeTab === "scan" && (
            <div className="space-y-4 animate-in fade-in">
              {/* Lời dẫn dành cho khách mua hàng về kiểm tra */}
              <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-xs text-[var(--gold-light)] flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--gold)] mt-0.5" />
                <p>
                  Quý khách đã mua sản phẩm về có thể <b>Chụp ảnh tem QR trên vỏ hộp</b> hoặc <b>bật Camera quét trực tiếp</b> để tra cứu ngày thu hoạch, số lô sản xuất và vùng trồng sâm chính hãng.
                </p>
              </div>

              {/* NÚT CHỤP ẢNH TEM TRÊN VỎ HỘP CHO KHÁCH (NỔI BẬT NHẤT) */}
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
                    <span>Chụp ảnh tem trên vỏ hộp của bạn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCameraActive(!cameraActive);
                      setCapturedPhotoUrl(null);
                    }}
                    className="w-full sm:w-auto rounded-xl border border-[var(--gold)]/50 bg-black/60 px-4 py-3 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#3a0a10] transition flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>{cameraActive ? "Tắt Camera quét" : "Mở Camera quét trực tiếp"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-stone-300">
                  📱 Bấm chụp bằng điện thoại hoặc chọn ảnh chụp tem từ máy tính
                </p>
              </div>

              {/* KHUNG HIỂN THỊ CAMERA HOẶC ẢNH VỪA CHỤP */}
              {(cameraActive || capturedPhotoUrl) && (
                <div className="relative mx-auto flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--gold)] bg-black shadow-inner">
                  {capturedPhotoUrl ? (
                    <div className="relative h-full w-full">
                      <img
                        src={capturedPhotoUrl}
                        alt="Ảnh chụp tem của bạn"
                        className="h-full w-full object-contain bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => setCapturedPhotoUrl(null)}
                        className="absolute top-2 right-2 rounded-full bg-red-600/80 p-1 text-white hover:bg-red-700"
                        title="Chụp lại"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}

                  {/* Khung ngắm quét mã QR */}
                  {!capturedPhotoUrl && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
                        <div className="absolute top-0 left-0 h-5 w-5 border-t-3 border-l-3 border-[var(--gold)]" />
                        <div className="absolute top-0 right-0 h-5 w-5 border-t-3 border-r-3 border-[var(--gold)]" />
                        <div className="absolute bottom-0 left-0 h-5 w-5 border-b-3 border-l-3 border-[var(--gold)]" />
                        <div className="absolute bottom-0 right-0 h-5 w-5 border-b-3 border-r-3 border-[var(--gold)]" />
                        <div className="absolute left-1 right-1 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff0000] animate-scan" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-2 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] text-[var(--gold-light)] backdrop-blur-md border border-[var(--gold)]/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>
                      {capturedPhotoUrl ? "Đã nạp ảnh tem của bạn" : "Hướng camera vào tem hộp sâm"}
                    </span>
                  </div>
                </div>
              )}

              {/* Ô NHẬP TAY MÃ SỐ IN TRÊN TEM */}
              <div className="rounded-xl border border-[var(--gold)]/30 bg-black/40 p-3 space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                  Hoặc nhập mã số lô in trên tem:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleScanCode(inputCode);
                    }}
                    placeholder="VD: SB-2026-0915..."
                    className="flex-1 rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleScanCode(inputCode)}
                    disabled={!inputCode.trim()}
                    className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Tra cứu</span>
                  </button>
                </div>

                {/* Bấm nhanh mã mẫu để thử nghiệm */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className="text-stone-400">Thử nhanh mã:</span>
                  {lots.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setInputCode(l.code);
                        handleScanCode(l.code);
                      }}
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

              {/* KẾT QUẢ XÁC THỰC LÔ HÀNG CHÍNH HÃNG */}
              {scannedLot && (
                <div className="rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-b from-[#0a2312] to-[#041108] p-4 shadow-2xl animate-in fade-in">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-2.5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base">
                          CHỨNG THỰC CHÍNH HÃNG 100%
                        </h4>
                        <p className="text-[10px] sm:text-xs text-emerald-300">
                          Bảo chứng nguồn gốc Thanh Hoàng Sâm Vĩnh Lộc
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-black text-emerald-300 border border-emerald-400/40">
                      SỐ LÔ: {scannedLot.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-3 items-start">
                    {/* Ảnh sản phẩm theo lô */}
                    <div className="h-20 w-20 overflow-hidden rounded-xl border border-emerald-400/40 bg-black shadow mx-auto sm:mx-0">
                      <img
                        src={
                          scannedLot.code.startsWith("SB")
                            ? "/images/sam-bao-tuoi.jpg"
                            : scannedLot.code.startsWith("SK")
                            ? "/images/sam-bao-kho.jpg"
                            : scannedLot.code.startsWith("CS")
                            ? "/images/cao-sam-bao.jpg"
                            : "/images/ruou-sam-bao.jpg"
                        }
                        alt={scannedLot.product}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 text-xs text-stone-200">
                      <p className="text-sm font-bold text-[var(--gold-light)]">
                        {scannedLot.product}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>Nơi trồng: <b>{scannedLot.place}</b></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <span>
                          Thu hoạch: <b>{scannedLot.harvest}</b> • Đóng gói: <b>{scannedLot.packed}</b>
                        </span>
                      </p>
                      <p className="text-stone-300 italic pt-1 border-t border-emerald-500/20 text-[11px]">
                        {scannedLot.note}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* BÁO LỖI KHÔNG TÌM THẤY */}
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

          {/* ================= TAB 2: TỰ TẠO MÃ QR & TEM BẢO CHỨNG (DÀNH CHO IN ẤN) ================= */}
          {activeTab === "generate" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-xs text-[var(--gold-light)] flex items-start gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-[var(--gold)] mt-0.5" />
                <p>
                  Tự động sinh tem QR chính hãng để in ấn dán lên hộp sản phẩm. Khách mua về quét tem sẽ ra đúng số lô này.
                </p>
              </div>

              {/* Chọn sản phẩm */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-1.5">
                  Chọn sản phẩm để tạo tem:
                </label>
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
                      <span className="font-mono text-xs text-[var(--gold-light)]">
                        {p.sku}
                      </span>
                      <span className="line-clamp-1 mt-0.5 text-[11px]">
                        {p.name.split(" (")[0]}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {p.lotCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhập mã SKU & Số Lô */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl border border-[var(--gold)]/30 bg-black/40 p-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                    Mã sản phẩm (SKU):
                  </label>
                  <input
                    type="text"
                    value={customSku}
                    onChange={(e) => setCustomSku(e.target.value)}
                    className="w-full rounded-lg border border-[var(--gold)]/40 bg-black/60 px-3 py-1.5 text-xs text-white font-mono focus:border-[var(--gold)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                    Số lô sản xuất (LOT):
                  </label>
                  <input
                    type="text"
                    value={customLot}
                    onChange={(e) => setCustomLot(e.target.value)}
                    className="w-full rounded-lg border border-[var(--gold)]/40 bg-black/60 px-3 py-1.5 text-xs text-white font-mono focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>

              {/* KHUNG TEM CHỐNG GIẢ GỌN GÀNG ĐẸP MẮT */}
              <div className="relative mx-auto max-w-xs rounded-2xl border-2 border-[var(--gold)] bg-gradient-to-b from-white via-stone-50 to-amber-50/50 p-3.5 text-[#2b0609] shadow-2xl">
                <div className="text-center pb-1.5 border-b border-amber-300/80">
                  <div className="inline-block rounded-full bg-[var(--red)] px-2 py-0.5 text-[9px] font-black uppercase text-[var(--gold-light)] shadow-sm">
                    TEM BẢO CHỨNG CHÍNH HÃNG
                  </div>
                  <h4 className="font-heading text-xs font-black tracking-wide text-[var(--red)] uppercase mt-0.5">
                    THANH HOÀNG SÂM
                  </h4>
                  <p className="text-[9px] text-stone-600">
                    Sâm Báo Vĩnh Lộc – Đại Việt Đệ Nhất Danh Sâm
                  </p>
                </div>

                <div className="my-2 flex flex-col items-center justify-center">
                  <div className="relative rounded-lg border border-amber-400 bg-white p-1.5 shadow-inner">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Mã QR tra cứu nguồn gốc"
                        className="h-36 w-36 sm:h-40 sm:w-40 object-contain"
                      />
                    ) : (
                      <div className="h-36 w-36 flex items-center justify-center text-xs text-stone-400">
                        Đang tạo mã...
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-7 w-7 rounded-full bg-white p-0.5 shadow border border-[var(--gold)]">
                        <img
                          src="/images/logo.png"
                          alt="Logo"
                          className="h-full w-full rounded-full object-contain"
                        />
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

              {/* Các nút hành động */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="btn-gold !py-2 !px-3.5 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Download className="h-4 w-4" />
                  <span>Tải ảnh Tem QR (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-xl border border-[var(--gold)]/60 bg-black/50 px-3.5 py-2 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#3a0a10] transition flex items-center gap-1.5"
                >
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
    </div>
  );
}
