"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  RefreshCw,
  Search,
  Volume2,
} from "lucide-react";
import { lots, products, type Lot } from "@/lib/data";

interface ProductExtra {
  sku: string;
  saponin: string;
  gps: string;
  image: string;
  slug: string;
}

const lotExtras: Record<string, ProductExtra> = {
  "SB-2026-0915": {
    sku: "THS-ST-01",
    saponin: "18.4 mg/g (Chuẩn Dược điển loại 1)",
    gps: "20°01'45.2\"N 105°44'53.6\"E (Đỉnh núi Báo)",
    image: "/images/sam-bao-tuoi.jpg",
    slug: "sam-bao-tuoi",
  },
  "SK-2026-0601": {
    sku: "THS-SK-02",
    saponin: "17.2 mg/g (Sấy thăng hoa chân không)",
    gps: "Xưởng sấy dược liệu công nghệ cao Vĩnh Lộc",
    image: "/images/sam-bao-kho.jpg",
    slug: "sam-bao-kho",
  },
  "CS-2026-0802": {
    sku: "THS-CS-03",
    saponin: "32.8 mg/g (Cô đặc 72 giờ)",
    gps: "Khu chế biến sâu dược liệu Núi Báo",
    image: "/images/cao-sam-bao.jpg",
    slug: "cao-sam-bao",
  },
  "RS-2026-0718": {
    sku: "THS-RS-04",
    saponin: "15.6 mg/g (Ngâm củ sâm 3 năm tuổi)",
    gps: "Hầm ủ rượu truyền thống Vĩnh Lộc",
    image: "/images/ruou-sam-bao.jpg",
    slug: "ruou-sam-bao",
  },
};

export default function QRScanModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeCode, setActiveCode] = useState<string>("");
  const [inputVal, setInputVal] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scannedLot, setScannedLot] = useState<Lot | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Phát âm thanh beep ngắn khi quét trúng mã (Web Audio API)
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Note A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Audio không khả dụng thì bỏ qua
    }
  };

  // Kích hoạt camera thực tế nếu có hỗ trợ
  useEffect(() => {
    if (!isOpen) {
      setScannedLot(null);
      setActiveCode("");
      setInputVal("");
      setHasError(false);
      return;
    }

    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch(() => {
          // Người dùng không cấp quyền camera hoặc không có webcam -> sử dụng chế độ mô phỏng trực quan
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleTriggerScan = (codeToScan: string) => {
    setIsScanning(true);
    setHasError(false);
    setActiveCode(codeToScan);

    // Hiệu ứng quét trong 600ms
    setTimeout(() => {
      setIsScanning(false);
      playBeep();
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
    }, 600);
  };

  if (!isOpen) return null;

  const extra = scannedLot ? lotExtras[scannedLot.code] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-3 border-[var(--gold)] bg-[#1a0305] text-white shadow-2xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-[var(--gold)]/30 bg-gradient-to-r from-[var(--red)] to-[#3a0a10] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)] text-[#3a0a10] shadow">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-black tracking-wide text-[var(--gold-light)] uppercase">
                Quét Mã QR & Tra Cứu Lô Sâm
              </h3>
              <p className="text-[11px] text-stone-200">
                Xác thực nguồn gốc xuất xứ chính hãng Thanh Hoàng Sâm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--gold-light)] hover:bg-white/10 hover:text-white transition"
            aria-label="Đóng bảng quét QR"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung chính */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Khung máy ảnh Camera Scanner */}
          <div className="relative mx-auto flex h-64 sm:h-72 w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border-2 border-[var(--gold)] bg-black shadow-inner">
            {/* Video stream hoặc nền mô phỏng */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

            {/* Khung ngắm quét mã QR (Target Box) */}
            <div className="relative flex h-48 w-48 items-center justify-center">
              {/* 4 góc vuông bo viền vàng */}
              <div className="absolute top-0 left-0 h-6 w-6 border-t-3 border-l-3 border-[var(--gold)]" />
              <div className="absolute top-0 right-0 h-6 w-6 border-t-3 border-r-3 border-[var(--gold)]" />
              <div className="absolute bottom-0 left-0 h-6 w-6 border-b-3 border-l-3 border-[var(--gold)]" />
              <div className="absolute bottom-0 right-0 h-6 w-6 border-b-3 border-r-3 border-[var(--gold)]" />

              {/* Tia laser quét lên xuống */}
              <div className="absolute left-1 right-1 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff0000] animate-scan" />

              {/* Icon Camera mờ ở tâm */}
              <Camera className="h-10 w-10 text-[var(--gold)]/40 animate-pulse" />
            </div>

            {/* Trạng thái máy quét */}
            <div className="absolute bottom-2.5 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-xs text-[var(--gold-light)] backdrop-blur-md border border-[var(--gold)]/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Hướng camera vào mã QR in trên tem niêm phong</span>
            </div>
          </div>

          {/* Dải nút Demo nhanh các mã lô (1-Click Instant Demo) */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Bấm nhanh mã mẫu để thử nghiệm quét (Demo):
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {lots.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleTriggerScan(l.code)}
                  className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                    activeCode === l.code
                      ? "border-[var(--gold)] bg-[var(--red)] text-white shadow-md scale-102"
                      : "border-[var(--gold)]/40 bg-black/40 text-stone-300 hover:border-[var(--gold)] hover:bg-black/60"
                  }`}
                >
                  <span className="font-mono text-xs font-extrabold text-[var(--gold-light)]">
                    {l.code}
                  </span>
                  <span className="line-clamp-1 mt-0.5 text-[10px] text-stone-300">
                    {l.product.replace("Sâm Báo ", "")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Ô nhập tay mã số nếu khách muốn gõ */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTriggerScan(inputVal);
                }}
                placeholder="Hoặc nhập mã số lô (VD: SB-2026-0915)..."
                className="w-full rounded-xl border border-[var(--gold)]/50 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)]"
              />
            </div>
            <button
              type="button"
              onClick={() => handleTriggerScan(inputVal)}
              disabled={!inputVal.trim()}
              className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Tra cứu</span>
            </button>
          </div>

          {/* KẾT QUẢ QUÉT THÀNH CÔNG: CHỨNG THƯ XÁC THỰC LÔ HÀNG */}
          {scannedLot && extra && (
            <div className="rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-b from-[#0a2312] to-[#041108] p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-top-3">
              {/* Huy hiệu xác thực */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <div>
                    <h4 className="font-extrabold text-white text-base">
                      XÁC THỰC CHÍNH HÃNG 100%
                    </h4>
                    <p className="text-[11px] text-emerald-300">
                      Sản phẩm đạt chuẩn kiểm định & bảo hộ chỉ dẫn địa lý
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-black text-emerald-300 border border-emerald-400/40">
                  MÃ LÔ: {scannedLot.code}
                </span>
              </div>

              {/* Thông tin chi tiết sản phẩm và nguồn gốc */}
              <div className="grid gap-4 sm:grid-cols-[100px_1fr]">
                {/* Ảnh thật sản phẩm */}
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-emerald-400/40 bg-black/50 shadow">
                  <img
                    src={extra.image}
                    alt={scannedLot.product}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-stone-200">
                  <p className="text-base font-bold text-[var(--gold-light)]">
                    {scannedLot.product}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Mã sản phẩm (SKU): <b className="text-white">{extra.sku}</b></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>Vùng thu hái: <b>{scannedLot.place}</b></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-sky-400" />
                    <span>Thu hoạch: <b>{scannedLot.harvest}</b> • Đóng gói: <b>{scannedLot.packed}</b></span>
                  </p>
                  <p className="text-stone-300 italic pt-1 border-t border-emerald-500/20">
                    Ghi chú: {scannedLot.note}
                  </p>
                </div>
              </div>

              {/* Nút xem chi tiết sản phẩm */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/30 pt-3">
                <span className="text-[11px] text-emerald-300">
                  Dược tính: {extra.saponin}
                </span>
                <Link
                  href={`/san-pham/${extra.slug}`}
                  onClick={onClose}
                  className="btn-gold !py-1.5 !px-3 text-xs flex items-center gap-1 font-bold"
                >
                  <span>Xem chi tiết sản phẩm này</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* BÁO LỖI KHÔNG TÌM THẤY */}
          {hasError && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-500/60 bg-rose-950/40 p-4 text-xs text-rose-200 animate-in fade-in">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">Không tìm thấy mã số này trong sổ lưu trữ</p>
                <p className="mt-1">
                  Mã &quot;{activeCode}&quot; chưa được kích hoạt hoặc không phải sản phẩm do Thanh Hoàng Sâm phân phối. Bạn vui lòng kiểm tra lại tem chống giả trên bao bì hoặc gọi Hotline 0918 168 888 để được hỗ trợ.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
