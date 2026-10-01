"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Save,
  LogOut,
  Package,
  Award,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function TaiKhoanPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);
    setNotifyMsg(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        setNotifyMsg({ type: "error", text: "Cập nhật thất bại: " + error.message });
      } else {
        await refreshProfile();
        setNotifyMsg({ type: "success", text: "Thông tin cá nhân đã được lưu thành công!" });
        setTimeout(() => setNotifyMsg(null), 3000);
      }
    } catch (err: unknown) {
      setNotifyMsg({ type: "error", text: "Có lỗi xảy ra khi lưu thông tin." });
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-luxury text-white">
        <div className="flex items-center gap-3 text-[var(--gold)]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
          <span className="text-sm font-bold">Đang tải thông tin tài khoản...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury text-white py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Banner chào mừng */}
        <div className="rounded-3xl border-2 border-[var(--gold)]/50 bg-gradient-to-r from-[#2b0508] via-[#1a0305] to-black p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gold)] text-[#2b0508] font-black text-2xl shadow-lg border border-[var(--gold-light)]">
              {fullName ? fullName.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-black text-[var(--gold)]">
                  {fullName || "Quý Khách Hàng"}
                </h1>
                <span className="rounded-full bg-[var(--gold)]/20 px-2.5 py-0.5 text-[10px] font-bold text-[var(--gold-light)] border border-[var(--gold)]/40">
                  {profile?.role === "admin" ? "QUẢN TRỊ VIÊN" : "THÀNH VIÊN HOÀNG GIA"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="btn-gold !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Vào trang Quản trị</span>
              </Link>
            )}

            <button
              type="button"
              onClick={signOut}
              className="rounded-xl border border-rose-500/50 bg-rose-950/40 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Nội dung chính chia 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Cột 1 & 2: Form cập nhật thông tin */}
          <div className="md:col-span-2 rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-4">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[var(--gold-light)] flex items-center gap-2">
                <User className="h-5 w-5 text-[var(--gold)]" />
                <span>Thông tin cá nhân & Giao nhận</span>
              </h2>
            </div>

            {notifyMsg && (
              <div
                className={`flex items-center gap-2 rounded-xl p-3.5 text-xs ${
                  notifyMsg.type === "success"
                    ? "border border-emerald-500/50 bg-emerald-950/60 text-emerald-200"
                    : "border border-rose-500/50 bg-rose-950/60 text-rose-200"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p>{notifyMsg.text}</p>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-500 focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Địa chỉ Email (Định danh)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full rounded-xl border border-stone-800 bg-black/80 pl-10 pr-4 py-2.5 text-sm text-stone-400 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Số điện thoại nhận hàng
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0918 168 888"
                      className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-500 focus:border-[var(--gold)] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Địa chỉ giao nhận mặc định
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-500 focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-gold !py-2.5 !px-6 text-xs font-bold flex items-center gap-2 shadow disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isUpdating ? "Đang lưu..." : "Lưu thay đổi"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Cột 3: Quyền lợi & Đơn hàng */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-[var(--gold-light)] flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--gold)]" />
                <span>Đặc quyền Thành viên</span>
              </h3>
              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
                  <span>Tích lũy điểm thưởng chiết khấu cho mọi đơn hàng sâm tươi và thành phẩm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bảo chứng truy xuất nguồn gốc số lô chính xác 100% từ đỉnh Núi Báo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Miễn phí vận chuyển hỏa tốc toàn quốc khi đặt hàng từ 1.000.000đ.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-3 text-center">
              <Package className="h-8 w-8 text-[var(--gold)]/60 mx-auto" />
              <h4 className="font-bold text-sm text-[var(--gold-light)]">Đơn hàng của bạn</h4>
              <p className="text-xs text-stone-400">
                Quý khách chưa có đơn hàng nào đang chờ giao.
              </p>
              <Link
                href="/san-pham"
                className="inline-block mt-2 rounded-xl border border-[var(--gold)]/50 px-4 py-2 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508] transition"
              >
                Khám phá sản phẩm sâm
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
