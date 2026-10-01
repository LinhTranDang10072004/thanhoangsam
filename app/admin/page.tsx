"use client";

import { useState, useEffect } from "react";
import { useAuth, Profile } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { lots } from "@/lib/data";
import { products } from "@/lib/data";
import {
  Users,
  ShieldAlert,
  Package,
  QrCode,
  Search,
  RefreshCw,
  LogOut,
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"users" | "lots" | "products">("users");
  const [profilesList, setProfilesList] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  const fetchAllProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProfilesList(data as Profile[]);
      } else if (error) {
        console.error("Lỗi tải danh sách profiles:", error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    if (profile?.role === "admin") {
      fetchAllProfiles();
    }
  }, [profile]);

  // Cập nhật quyền Admin / Buyer trực tiếp
  const handleChangeRole = async (targetUserId: string, newRole: "admin" | "buyer") => {
    setUpdatingRoleId(targetUserId);
    setActionMsg(null);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", targetUserId);

      if (error) {
        setActionMsg({ type: "error", text: "Lỗi cập nhật quyền: " + error.message });
      } else {
        setActionMsg({
          type: "success",
          text: `Đã đổi vai trò thành công sang ${newRole.toUpperCase()}!`,
        });
        await fetchAllProfiles();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setActionMsg({ type: "error", text: "Có lỗi xảy ra khi cập nhật." });
    } finally {
      setUpdatingRoleId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-luxury text-white">
        <div className="flex items-center gap-3 text-[var(--gold)]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
          <span className="text-sm font-bold">Đang kiểm tra quyền Quản trị viên...</span>
        </div>
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-luxury text-white p-4">
        <div className="max-w-md text-center space-y-4 rounded-3xl border border-rose-500/50 bg-rose-950/60 p-8">
          <ShieldAlert className="h-12 w-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Khu Vực Giới Hạn Quản Trị</h2>
          <p className="text-xs text-stone-300">
            Tài khoản hiện tại của bạn không có quyền Quản trị viên để truy cập trang này.
          </p>
          <Link href="/" className="btn-gold !py-2.5 !px-5 text-xs font-bold inline-block">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const filteredUsers = profilesList.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
      p.phone?.includes(searchUser) ||
      p.id.includes(searchUser)
  );

  const adminCount = profilesList.filter((p) => p.role === "admin").length;
  const buyerCount = profilesList.filter((p) => p.role === "buyer").length;

  return (
    <div className="min-h-screen bg-luxury text-white py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Admin */}
        <div className="rounded-3xl border-2 border-[var(--gold)]/60 bg-gradient-to-r from-[#2b0508] via-[#1c0306] to-black p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gold)] text-[#2b0508] font-black text-2xl shadow border border-[var(--gold-light)]">
              👑
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-black text-[var(--gold)] uppercase">
                  Bảng Quản Trị Hệ Thống
                </h1>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-400/40">
                  ONLINE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Quản trị viên: <b>{profile.full_name || user?.email}</b>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchAllProfiles}
              className="rounded-xl border border-[var(--gold)]/50 bg-black/60 px-3.5 py-2.5 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508] transition flex items-center gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Đồng bộ DB</span>
            </button>

            <button
              type="button"
              onClick={signOut}
              className="rounded-xl border border-rose-500/50 bg-rose-950/40 px-3.5 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* 4 Thẻ KPI thống kê nhanh */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[var(--gold)]/40 bg-black/50 p-4 shadow text-center">
            <Users className="h-6 w-6 text-[var(--gold)] mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{profilesList.length}</p>
            <p className="text-[11px] text-stone-400 uppercase font-semibold">Tổng tài khoản</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-black/50 p-4 shadow text-center">
            <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-emerald-300">{buyerCount}</p>
            <p className="text-[11px] text-stone-400 uppercase font-semibold">Khách mua hàng</p>
          </div>

          <div className="rounded-2xl border border-amber-500/40 bg-black/50 p-4 shadow text-center">
            <ShieldAlert className="h-6 w-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-amber-300">{adminCount}</p>
            <p className="text-[11px] text-stone-400 uppercase font-semibold">Quản trị viên</p>
          </div>

          <div className="rounded-2xl border border-sky-500/40 bg-black/50 p-4 shadow text-center">
            <QrCode className="h-6 w-6 text-sky-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-sky-300">{lots.length}</p>
            <p className="text-[11px] text-stone-400 uppercase font-semibold">Lô hàng xác thực</p>
          </div>
        </div>

        {/* Thông báo thao tác */}
        {actionMsg && (
          <div
            className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-bold animate-in fade-in ${
              actionMsg.type === "success"
                ? "border border-emerald-500/60 bg-emerald-950/70 text-emerald-200"
                : "border border-rose-500/60 bg-rose-950/70 text-rose-200"
            }`}
          >
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Thanh chuyển tab quản trị */}
        <div className="flex border-b border-[var(--gold)]/30 bg-black/40 rounded-2xl p-1 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "users"
                ? "bg-[var(--gold)] text-[#2b0508] shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Tài Khoản & Phân Quyền ({profilesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lots")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "lots"
                ? "bg-[var(--gold)] text-[#2b0508] shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>Sổ Lô & Tem QR ({lots.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "products"
                ? "bg-[var(--gold)] text-[#2b0508] shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Danh Mục Sản Phẩm ({products.length})</span>
          </button>
        </div>

        {/* TAB 1: QUẢN LÝ USER & PROFILES */}
        {activeTab === "users" && (
          <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--gold)]" />
                <span>Danh sách tài khoản trong Supabase Database</span>
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Tìm theo tên, SĐT..."
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>

            {loadingProfiles ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Đang tải dữ liệu tài khoản từ Supabase...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Không tìm thấy tài khoản nào khớp với từ khóa.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--gold)]/30 text-[var(--gold-light)] uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-3">Họ và tên</th>
                      <th className="py-3 px-3">Vai trò</th>
                      <th className="py-3 px-3">Số điện thoại</th>
                      <th className="py-3 px-3">Địa chỉ</th>
                      <th className="py-3 px-3">Ngày tạo</th>
                      <th className="py-3 px-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-3 font-bold text-white">
                          {u.full_name || "(Chưa đặt tên)"}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 font-bold uppercase text-[10px] ${
                              u.role === "admin"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                            }`}
                          >
                            {u.role === "admin" ? "Quản trị viên" : "Người mua"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-300 font-mono">
                          {u.phone || "—"}
                        </td>
                        <td className="py-3 px-3 text-stone-400 max-w-[180px] truncate">
                          {u.address || "—"}
                        </td>
                        <td className="py-3 px-3 text-stone-400">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("vi-VN") : "—"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {u.id === user?.id ? (
                            <span className="text-[10px] text-stone-500 italic">Tài khoản này</span>
                          ) : (
                            <button
                              type="button"
                              disabled={updatingRoleId === u.id}
                              onClick={() =>
                                handleChangeRole(u.id, u.role === "admin" ? "buyer" : "admin")
                              }
                              className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                                u.role === "admin"
                                  ? "border-rose-500/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900"
                                  : "border-[var(--gold)]/50 bg-[var(--gold)]/20 text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508]"
                              }`}
                            >
                              {updatingRoleId === u.id
                                ? "Đang đổi..."
                                : u.role === "admin"
                                ? "Hạ về Buyer"
                                : "Nâng làm Admin"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUẢN LÝ SỔ LÔ & TEM QR */}
        {activeTab === "lots" && (
          <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
              <QrCode className="h-5 w-5 text-[var(--gold)]" />
              <span>Sổ lô hàng chính hãng được chứng thực</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lots.map((l) => (
                <div
                  key={l.code}
                  className="rounded-2xl border border-[var(--gold)]/40 bg-gradient-to-b from-[#2b0508]/80 to-black/80 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-2">
                    <span className="rounded-lg bg-[var(--gold)] px-2.5 py-0.5 font-mono text-xs font-black text-[#2b0508]">
                      LÔ: {l.code}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">Chính hãng 100%</span>
                  </div>

                  <h3 className="font-bold text-sm text-[var(--gold-light)]">{l.product}</h3>

                  <div className="space-y-1.5 text-xs text-stone-300">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{l.place}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span>Thu hoạch: <b>{l.harvest}</b> • Đóng gói: <b>{l.packed}</b></span>
                    </p>
                    <p className="text-stone-400 text-[11px] italic pt-1">{l.note}</p>
                  </div>

                  <div className="pt-2 border-t border-[var(--gold)]/20 flex justify-end">
                    <Link
                      href={`/nguon-goc?lot=${l.code}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--gold)] hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Xem trang chứng thực</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DANH MỤC SẢN PHẨM */}
        {activeTab === "products" && (
          <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
              <Package className="h-5 w-5 text-[var(--gold)]" />
              <span>Danh mục sản phẩm Thanh Hoàng Sâm</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <div
                  key={p.slug}
                  className="rounded-2xl border border-[var(--gold)]/30 bg-black/60 overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-36 w-full overflow-hidden bg-black">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="rounded bg-[var(--gold)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--gold-light)]">
                      {p.type} • {p.age}
                    </span>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-stone-400 line-clamp-2">{p.summary}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/san-pham/${p.slug}`}
                      className="btn-gold !w-full !py-2 text-xs font-bold text-center block"
                    >
                      Xem trang sản phẩm
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
