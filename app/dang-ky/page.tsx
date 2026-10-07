"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Lock, Mail, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DangKyPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có tối thiểu 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "https://thanhhoangsam.com/auth/callback";

      // Đăng ký qua Supabase Auth kèm theo metadata và emailRedirectTo
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            role: "buyer",
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrorMsg("Email này đã được đăng ký tài khoản. Quý khách vui lòng đăng nhập.");
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess(true);
        // Nếu không có session tức là Supabase đang yêu cầu xác thực email (Confirm Email = ON)
        if (!data.session) {
          setNeedsEmailConfirmation(true);
        } else {
          setNeedsEmailConfirmation(false);
          setTimeout(() => {
            router.push("/tai-khoan");
            router.refresh();
          }, 1500);
        }
      }
    } catch (err: unknown) {
      setErrorMsg("Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-luxury text-white relative">
      <div className="w-full max-w-md rounded-3xl border-2 border-[var(--gold)]/60 bg-gradient-to-b from-[#2b0508] to-[#120204] p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
        
        {/* Header thương hiệu */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gold)]/20 border border-[var(--gold)]/50 shadow-inner">
            <UserPlus className="h-8 w-8 text-[var(--gold)]" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[var(--gold)] uppercase">
            Đăng Ký Tài Khoản
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Trải nghiệm mua sắm & tích lũy ưu đãi cùng Thanh Hoàng Sâm
          </p>
        </div>

        {/* Thông báo thành công */}
        {success ? (
          <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/60 bg-emerald-950/60 p-6 text-center animate-in fade-in">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <h3 className="font-bold text-emerald-300 text-lg">Đăng ký thành công!</h3>
            {needsEmailConfirmation ? (
              <div className="space-y-3 text-xs text-stone-200 text-left bg-black/40 p-4 rounded-xl border border-emerald-500/30 mt-2">
                <p className="leading-relaxed">
                  ✉️ Chúng tôi đã gửi một email xác nhận kích hoạt tài khoản tới: <b className="text-[var(--gold)] break-all">{email}</b>.
                </p>
                <p className="leading-relaxed text-stone-300">
                  Quý khách vui lòng kiểm tra hộp thư đến (hoặc thư mục <b>Spam / Thư rác / Quảng cáo</b>) và bấm vào liên kết trong thư để hoàn tất kích hoạt tài khoản.
                </p>
                <div className="pt-2 text-center">
                  <Link href="/dang-nhap" className="btn-gold !py-2 !px-5 text-xs font-bold inline-block">
                    Đi tới trang Đăng nhập
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-200">
                Đang chuyển hướng quý khách về trang tài khoản cá nhân...
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Thông báo lỗi */}
            {errorMsg && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-500/50 bg-rose-950/60 p-3.5 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Form đăng ký */}
            <form onSubmit={handleRegister} className="mt-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold-light)] mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold-light)] mb-1">
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
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold-light)] mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0918 168 888"
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold-light)] mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-10 py-2.5 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--gold-light)] mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu..."
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-400 outline-none focus:border-[var(--gold)] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold !w-full !py-3 mt-2 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" />
                <span>{loading ? "Đang tạo tài khoản..." : "Đăng Ký Tài Khoản"}</span>
              </button>
            </form>
          </>
        )}

        {/* Chuyển hướng sang đăng nhập */}
        <div className="mt-5 border-t border-[var(--gold)]/20 pt-4 text-center text-xs text-stone-300">
          Đã có tài khoản?{" "}
          <Link
            href="/dang-nhap"
            className="font-bold text-[var(--gold)] hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
