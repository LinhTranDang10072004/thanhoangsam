"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, LogIn, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

function DangNhapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const isVerified = searchParams.get("verified") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Email hoặc mật khẩu không chính xác. Quý khách vui lòng kiểm tra lại.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("Tài khoản chưa được kích hoạt. Quý khách vui lòng kiểm tra hòm thư email.");
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        setLoginSuccess(true);

        // Lấy role để xác định điểm đến
        let target = redirectUrl;
        if (!target) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          target = profile?.role === "admin" ? "/admin" : "/tai-khoan";
        }

        // Chuyển hướng trực tiếp giúp cookie được nạp đầy đủ và loại bỏ hoàn toàn delay
        window.location.href = target;
      }
    } catch (err: unknown) {
      setErrorMsg("Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-luxury text-white relative">
      <div className="w-full max-w-md rounded-3xl border-2 border-[var(--gold)]/60 bg-gradient-to-b from-[#2b0508] to-[#120204] p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
        
        {/* Header thương hiệu */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gold)]/20 border border-[var(--gold)]/50 shadow-inner">
            <ShieldCheck className="h-8 w-8 text-[var(--gold)]" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[var(--gold)] uppercase">
            Đăng Nhập
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Hệ thống quản lý & tài khoản khách hàng Thanh Hoàng Sâm
          </p>
        </div>

        {/* Thông báo thành công */}
        {loginSuccess && (
          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-emerald-500/50 bg-emerald-950/60 p-3.5 text-xs text-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <p className="font-bold">Đăng nhập thành công! Đang chuyển hướng...</p>
          </div>
        )}

        {isVerified && !loginSuccess && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-emerald-500/50 bg-emerald-950/60 p-3.5 text-xs text-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <p>Xác nhận email thành công! Quý khách có thể đăng nhập vào tài khoản ngay bây giờ.</p>
          </div>
        )}

        {/* Thông báo lỗi */}
        {errorMsg && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-500/50 bg-rose-950/60 p-3.5 text-xs text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Form đăng nhập */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold-light)] mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold-light)] mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-10 py-3 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold !w-full !py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? "Đang xác thực..." : "Đăng Nhập"}</span>
          </button>
        </form>

        {/* Chuyển hướng sang đăng ký */}
        <div className="mt-6 border-t border-[var(--gold)]/20 pt-4 text-center text-xs text-stone-300">
          Chưa có tài khoản?{" "}
          <Link
            href="/dang-ky"
            className="font-bold text-[var(--gold)] hover:underline"
          >
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DangNhapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-luxury text-white">
          <div className="flex items-center gap-3 text-[var(--gold)]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
            <span className="text-sm font-bold">Đang tải trang đăng nhập...</span>
          </div>
        </div>
      }
    >
      <DangNhapContent />
    </Suspense>
  );
}
