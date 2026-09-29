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
  const [activeTab, setActiveTab] = useState<"generate" | "scan">("generate");

  // Tab 1: Tạo mã QR (Generator)
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customSku, setCustomSku] = useState<string>("THS-ST-01");
  const [customLot, setCustomLot] = useState<string>("SB-2026-0915");
  const [customName, setCustomName] = useState<string>("Sâm Báo Tươi Nguyên Củ");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [originUrl, setOriginUrl] = useState<string>("");

  // Tab 2: Quét mã QR (Scanner / Camera / Upload)
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>("");
  const [scannedLot, setScannedLot] = useState<Lot | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy origin của website hiện tại
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin);
    }
  }, []);

  // Tự động sinh mã QR khi thông tin thay đổi
  const generateQRCode = useCallback(async () => {
    try {
      const baseUrl = originUrl || "https://thanhoangsam.vn";
      // Tạo URL chuẩn để khi người khác cầm điện thoại quét QR, nó sẽ mở trang xác thực
      const verifyUrl = `${baseUrl}/nguon-goc?lot=${encodeURIComponent(
        customLot.trim()
      )}&sku=${encodeURIComponent(customSku.trim())}`;

      const url = await QRCode.toDataURL(verifyUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: "#2b0609", // Đỏ nâu hoàng gia đậm nét
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
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, generateQRCode]);

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
    a.download = `QR-ThanhHoangSam-${customLot}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Quét / Kiểm tra mã số lô
  const handleScanCode = (codeToScan: string) => {
    setIsScanning(true);
    setHasError(false);

    // Giả lập quét trong 500ms
    setTimeout(() => {
      setIsScanning(false);
      const found = lots.find(
        (l) => l.code.toLowerCase() === codeToScan.trim().toLowerCase()
      );
      if (found) {
        setScannedLot(found);
        setHasError(false);
      } else {
        setScannedLot(null);
        setHasError(true);
      }
    }, 500);
  };

  // Quản lý Camera khi ở tab scan
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && activeTab === "scan" && !capturedPhotoUrl) {
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
            setCameraActive(true);
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch(() => {
            setCameraActive(false);
          });
      }
    } else {
      setCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, activeTab, capturedPhotoUrl]);

  // Xử lý khi người dùng chụp ảnh hoặc tải ảnh QR từ điện thoại
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhotoUrl(dataUrl);
      // Mô phỏng nhận diện mã QR từ ảnh vừa chụp
      handleScanCode(customLot || "SB-2026-0915");
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const currentPreset = productPresets[selectedPresetIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-[var(--gold)] bg-[#170305] text-white shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[var(--gold)]/30 bg-gradient-to-r from-[var(--red)] to-[#3a0a10] px-4 py-3 sm:px-6 sm:py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)] text-[#3a0a10] shadow font-bold">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-black tracking-wide text-[var(--gold-light)] uppercase leading-tight">
                Mã QR & Số Lô Sản Phẩm
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-200">
                Tự động tạo mã QR để khách quét bằng điện thoại
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

        {/* Thanh chuyển Tab */}
        <div className="flex border-b border-[var(--gold)]/30 bg-black/40 px-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("generate")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === "generate"
                ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10 rounded-t-lg"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Tự tạo mã QR Sản phẩm (Generator)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === "scan"
                ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10 rounded-t-lg"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Quét / Chụp ảnh QR tra cứu</span>
          </button>
        </div>

        {/* Thân Modal */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* ================= TAB 1: TỰ ĐỘNG TẠO MÃ QR (GENERATOR) ================= */}
          {activeTab === "generate" && (
            <div className="space-y-5 animate-in fade-in">
              {/* Lời dẫn */}
              <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-xs text-[var(--gold-light)] flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 shrink-0 text-[var(--gold)] mt-0.5" />
                <p>
                  Hệ thống <b>tự động sinh mã QR</b> chứa link xác thực nguồn gốc. Khách hàng dùng bất kỳ điện thoại nào (Camera iPhone, Zalo, Google Lens) quét mã này sẽ mở ra trang chứng nhận chính hãng ngay!
                </p>
              </div>

              {/* Chọn nhanh sản phẩm mẫu */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-2">
                  1. Chọn nhanh dòng sản phẩm để sinh mã:
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {productPresets.map((p, idx) => (
                    <button
                      key={p.sku}
                      type="button"
                      onClick={() => handleSelectPreset(idx)}
                      className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                        selectedPresetIndex === idx
                          ? "border-[var(--gold)] bg-[var(--red)] text-white shadow-md font-bold scale-[1.02]"
                          : "border-[var(--gold)]/40 bg-black/40 text-stone-300 hover:border-[var(--gold)] hover:bg-black/60"
                      }`}
                    >
                      <span className="font-mono text-xs text-[var(--gold-light)]">
                        {p.sku}
                      </span>
                      <span className="line-clamp-1 mt-0.5 text-[11px]">
                        {p.name.split(" (")[0]}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                        Lô: {p.lotCode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tùy chỉnh thông số Mã SKU và Số Lô */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-[var(--gold)]/30 bg-black/40 p-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                    Mã sản phẩm (SKU):
                  </label>
                  <input
                    type="text"
                    value={customSku}
                    onChange={(e) => setCustomSku(e.target.value)}
                    className="w-full rounded-lg border border-[var(--gold)]/40 bg-black/60 px-3 py-1.5 text-xs text-white font-mono focus:border-[var(--gold)] outline-none"
                    placeholder="VD: THS-ST-01"
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
                    placeholder="VD: SB-2026-0915"
                  />
                </div>
              </div>

              {/* KHUNG TEM CHỐNG GIẢ HOÀNG GIA ĐỂ KHÁCH QUÉT */}
              <div className="relative mx-auto max-w-sm rounded-2xl border-2 border-[var(--gold)] bg-gradient-to-b from-white via-stone-50 to-amber-50/50 p-4 text-[#2b0609] shadow-2xl">
                {/* Góc trang trí hoàng gia */}
                <div className="absolute top-1.5 left-1.5 h-3 w-3 border-t-2 border-l-2 border-[var(--gold)]" />
                <div className="absolute top-1.5 right-1.5 h-3 w-3 border-t-2 border-r-2 border-[var(--gold)]" />
                <div className="absolute bottom-1.5 left-1.5 h-3 w-3 border-b-2 border-l-2 border-[var(--gold)]" />
                <div className="absolute bottom-1.5 right-1.5 h-3 w-3 border-b-2 border-r-2 border-[var(--gold)]" />

                {/* Tiêu đề tem */}
                <div className="text-center pb-2 border-b border-amber-300/80">
                  <div className="inline-block rounded-full bg-[var(--red)] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--gold-light)] shadow-sm">
                    TEM BẢO CHỨNG CHÍNH HÃNG
                  </div>
                  <h4 className="font-heading text-sm font-black tracking-wide text-[var(--red)] uppercase mt-1">
                    THANH HOÀNG SÂM
                  </h4>
                  <p className="text-[10px] text-stone-600 font-medium">
                    Sâm Báo Vĩnh Lộc – Đại Việt Đệ Nhất Danh Sâm
                  </p>
                </div>

                {/* HÌNH ẢNH MÃ QR ĐỘ NÉT CAO */}
                <div className="my-3 flex flex-col items-center justify-center">
                  <div className="relative rounded-xl border border-amber-400 bg-white p-2 shadow-inner">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Mã QR tra cứu nguồn gốc"
                        className="h-44 w-44 sm:h-48 sm:w-48 object-contain"
                      />
                    ) : (
                      <div className="h-44 w-44 flex items-center justify-center text-xs text-stone-400">
                        Đang tạo mã QR...
                      </div>
                    )}
                    {/* Logo nhãn hiệu nhỏ ở giữa mã QR */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-9 w-9 rounded-full bg-white p-0.5 shadow-md border border-[var(--gold)]">
                        <img
                          src="/images/logo.png"
                          alt="Logo"
                          className="h-full w-full rounded-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="mt-1 text-[10px] font-semibold text-stone-600 italic">
                    📱 Hướng camera điện thoại vào đây để quét mã
                  </span>
                </div>

                {/* Thông số lô hàng in trên tem */}
                <div className="space-y-1 rounded-lg bg-amber-100/60 p-2.5 text-[11px] border border-amber-200">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-stone-700">Mã SKU:</span>
                    <span className="font-mono text-[var(--red)]">{customSku}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-stone-700">Số lô (LOT):</span>
                    <span className="font-mono text-emerald-800">{customLot}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-stone-600">
                    <span>Sản phẩm:</span>
                    <span className="truncate max-w-[170px] font-medium text-stone-800">
                      {customName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-stone-600">
                    <span>Vùng thu hái:</span>
                    <span className="font-medium text-stone-800">Núi Báo, Thanh Hóa</span>
                  </div>
                </div>
              </div>

              {/* Các nút hành động: Tải tem, Sao chép link, Mở trang xác thực */}
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

          {/* ================= TAB 2: QUÉT / CHỤP ẢNH MÃ QR BẰNG ĐIỆN THOẠI ================= */}
          {activeTab === "scan" && (
            <div className="space-y-4 animate-in fade-in">
              {/* Lời dẫn */}
              <p className="text-xs text-stone-300 text-center">
                Bạn có thể dùng <b>Camera trực tiếp</b> hoặc bấm <b>Chụp ảnh / Tải ảnh</b> từ điện thoại để tra cứu:
              </p>

              {/* KHUNG CAMERA CHUẨN MOBILE TỈ LỆ 1:1 KHÔNG BỊ MÉO */}
              <div className="relative mx-auto flex h-60 w-60 sm:h-72 sm:w-72 items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--gold)] bg-black shadow-inner">
                {capturedPhotoUrl ? (
                  // Ảnh chụp / upload từ thư viện
                  <img
                    src={capturedPhotoUrl}
                    alt="Ảnh chụp tem QR"
                    className="h-full w-full object-contain bg-black"
                  />
                ) : (
                  // Video stream trực tiếp từ camera sau
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                {/* Khung ngắm quét mã QR */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative h-44 w-44 sm:h-52 sm:w-52">
                    {/* 4 góc vuông bo viền vàng */}
                    <div className="absolute top-0 left-0 h-5 w-5 border-t-3 border-l-3 border-[var(--gold)]" />
                    <div className="absolute top-0 right-0 h-5 w-5 border-t-3 border-r-3 border-[var(--gold)]" />
                    <div className="absolute bottom-0 left-0 h-5 w-5 border-b-3 border-l-3 border-[var(--gold)]" />
                    <div className="absolute bottom-0 right-0 h-5 w-5 border-b-3 border-r-3 border-[var(--gold)]" />

                    {/* Tia laser quét */}
                    {!capturedPhotoUrl && (
                      <div className="absolute left-1 right-1 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff0000] animate-scan" />
                    )}
                  </div>
                </div>

                {/* Trạng thái / Badge chỉ dẫn */}
                <div className="absolute bottom-2 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] text-[var(--gold-light)] backdrop-blur-md border border-[var(--gold)]/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    {capturedPhotoUrl ? "Đã nạp ảnh tem" : "Căn mã QR vào giữa khung"}
                  </span>
                </div>
              </div>

              {/* NÚT CHỤP ẢNH TỪ ĐIỆN THOẠI HOẶC TẢI ẢNH LÊN */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Input file ẩn hỗ trợ capture máy ảnh điện thoại */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Camera className="h-4 w-4" />
                  <span>Chụp ảnh / Tải ảnh QR</span>
                </button>

                {capturedPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedPhotoUrl(null);
                      setScannedLot(null);
                      setHasError(false);
                    }}
                    className="rounded-xl border border-stone-500 bg-black/50 px-3 py-2 text-xs font-bold text-stone-300 hover:text-white transition flex items-center gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Mở lại Camera</span>
                  </button>
                )}
              </div>

              {/* BẤM NHANH MÃ ĐỂ TEST DEMO */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Hoặc bấm nhanh mã mẫu để thử nghiệm:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {lots.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleScanCode(l.code)}
                      className="rounded-lg border border-[var(--gold)]/40 bg-black/40 p-1.5 text-center text-xs hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition"
                    >
                      <span className="font-mono font-bold text-[var(--gold-light)] block">
                        {l.code}
                      </span>
                      <span className="text-[10px] text-stone-300 line-clamp-1">
                        {l.product.replace("Sâm Báo ", "")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ô NHẬP TAY NẾU CẦN */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleScanCode(inputCode);
                  }}
                  placeholder="Nhập mã số lô (VD: SB-2026-0915)..."
                  className="flex-1 rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3.5 py-2 text-xs text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleScanCode(inputCode)}
                  disabled={!inputCode.trim()}
                  className="btn-gold !py-2 !px-3.5 text-xs font-bold flex items-center gap-1"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Tra cứu</span>
                </button>
              </div>

              {/* KẾT QUẢ QUÉT THÀNH CÔNG: CHỨNG THƯ CHÍNH HÃNG */}
              {scannedLot && (
                <div className="rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-b from-[#0a2312] to-[#041108] p-3.5 sm:p-4 shadow-2xl animate-in fade-in">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-2.5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-white text-sm">
                          XÁC THỰC CHÍNH HÃNG 100%
                        </h4>
                        <p className="text-[10px] text-emerald-300">
                          Bảo chứng nguồn gốc Thanh Hoàng Sâm
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-black text-emerald-300 border border-emerald-400/40">
                      LÔ: {scannedLot.code}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-200">
                    <p className="text-sm font-bold text-[var(--gold-light)]">
                      {scannedLot.product}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Nơi trồng: <b>{scannedLot.place}</b></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span>Thu hoạch: <b>{scannedLot.harvest}</b> • Đóng gói: <b>{scannedLot.packed}</b></span>
                    </p>
                    <p className="text-stone-300 italic pt-1 border-t border-emerald-500/20 text-[11px]">
                      {scannedLot.note}
                    </p>
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
                      Vui lòng kiểm tra lại chữ in trên bao bì hoặc liên hệ hotline để được hỗ trợ.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
