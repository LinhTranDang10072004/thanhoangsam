"use client";

import { useState, useEffect } from "react";
import { useAuth, Profile } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { lots, products as fallbackProducts, type Product, type Variant, type ProductType, vnd, minPrice } from "@/lib/data";
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
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Filter,
  Image as ImageIcon,
  UserCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";

// Danh sách ảnh thực tế có sẵn trong hệ thống để chọn nhanh
const availableImages = [
  "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg",
  "/images/1790691441922_2251207849705082306_2251207849705082306_49add4d443a5310c1f040d1325d4d802.jpg",
  "/images/1790691441975_2251207849705082306_2251207849705082306_97f1219099e9b56dc9c0c7e8d40bec80.jpg",
  "/images/1790691441998_2251207849705082306_2251207849705082306_a8baaafcabe1bc4601e12128627d81b0.jpg",
  "/images/1790691442022_2251207849705082306_2251207849705082306_6ad8864197f32490ffac32f52b5b6ebd.jpg",
  "/images/1790691442045_2251207849705082306_2251207849705082306_8df163c6132ac12d701e8c1d5c6145fa.jpg",
  "/images/1790691442069_2251207849705082306_2251207849705082306_38971826cc8331ac9d7612bd266f8633.jpg",
  "/images/1790691442095_2251207849705082306_2251207849705082306_6d97ca5064721c8d9a1349080f124d78.jpg",
  "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg",
  "/images/1790691442144_2251207849705082306_2251207849705082306_7c4ce215dbe2225f393b15647133cb84.jpg",
  "/images/1790691442264_2251207849705082306_2251207849705082306_51677dc509da9a7f2ae3b3b674ae2c8a.jpg",
];

// Hàm chuyển tiêu đề có dấu thành slug không dấu
function generateSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminDashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"products" | "users" | "lots">("products");

  // State Quản lý User
  const [profilesList, setProfilesList] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "buyer">("all");
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  // State Quản lý Sản phẩm (CRUD)
  const [productList, setProductList] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchProduct, setSearchProduct] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    slug: "",
    type: "Sâm tươi",
    age: "3 năm tuổi",
    image: availableImages[0],
    summary: "",
    detail: "",
    usage: "",
    variants: [{ label: "1 hộp", price: 500000 }],
    audience: ["Người cao tuổi", "Nam", "Nữ"],
    needs: ["Tăng sức đề kháng", "Bồi bổ cơ thể"],
  });

  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  // Helper lấy headers kèm Auth token
  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return headers;
  };

  // 1. Tải danh sách User (qua API route bảo mật)
  const fetchAllProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/users", { headers });
      const data = await res.json();
      if (res.ok && data.profiles) {
        setProfilesList(data.profiles as Profile[]);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách profiles:", err);
    } finally {
      setLoadingProfiles(false);
    }
  };

  // 2. Tải danh sách Sản phẩm (ưu tiên từ API/Supabase)
  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok && data.products && data.products.length > 0) {
        setProductList(data.products as Product[]);
      } else {
        const local = localStorage.getItem("ths_custom_products");
        if (local) {
          try {
            setProductList(JSON.parse(local));
          } catch {
            setProductList(fallbackProducts);
          }
        } else {
          setProductList(fallbackProducts);
        }
      }
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      setProductList(fallbackProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (
      profile?.role === "admin" ||
      user?.user_metadata?.role === "admin" ||
      user?.email === "admin@thanhoangsam.vn"
    ) {
      fetchAllProfiles();
      fetchAllProducts();
    }
  }, [profile, user]);

  // ===================== CRUD SẢN PHẨM =====================

  // Mở modal Thêm mới
  const handleOpenCreateProduct = () => {
    setProductForm({
      name: "",
      slug: "",
      type: "Sâm tươi",
      age: "3 năm tuổi",
      image: availableImages[0],
      summary: "",
      detail: "",
      usage: "",
      variants: [
        { label: "500g", price: 450000 },
        { label: "1kg", price: 850000 },
      ],
      audience: ["Người cao tuổi", "Nam", "Nữ"],
      needs: ["Tăng sức đề kháng", "Bồi bổ cơ thể"],
    });
    setEditingProduct(null);
    setIsCreatingProduct(true);
  };

  // Mở modal Sửa
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setIsCreatingProduct(false);
  };

  // Lưu sản phẩm (Thêm mới hoặc Cập nhật - CHỈ ADMIN)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.slug) {
      setActionMsg({ type: "error", text: "Vui lòng nhập tên và đường dẫn (slug) cho sản phẩm!" });
      return;
    }

    const payload: Product = {
      name: productForm.name.trim(),
      slug: productForm.slug.trim(),
      type: (productForm.type as ProductType) || "Sâm tươi",
      age: productForm.age || "3 năm tuổi",
      image: productForm.image || availableImages[0],
      summary: productForm.summary || "",
      detail: productForm.detail || "",
      usage: productForm.usage || "",
      variants: productForm.variants && productForm.variants.length > 0
        ? productForm.variants
        : [{ label: "Hộp tiêu chuẩn", price: 500000 }],
      audience: productForm.audience || ["Người cao tuổi", "Nam", "Nữ"],
      needs: productForm.needs || ["Tăng sức đề kháng", "Bồi bổ cơ thể"],
    };

    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        setActionMsg({ type: "error", text: result.error || "Không thể lưu sản phẩm." });
        return;
      }

      await fetchAllProducts();

      let updated: Product[];
      if (editingProduct) {
        updated = productList.map((p) => (p.slug === editingProduct.slug ? payload : p));
        setActionMsg({ type: "success", text: `Đã cập nhật sản phẩm "${payload.name}" thành công!` });
      } else {
        updated = [payload, ...productList.filter((p) => p.slug !== payload.slug)];
        setActionMsg({ type: "success", text: `Đã thêm mới sản phẩm "${payload.name}" thành công!` });
      }

      localStorage.setItem("ths_custom_products", JSON.stringify(updated));

      // Đóng modal
      setIsCreatingProduct(false);
      setEditingProduct(null);
      setTimeout(() => setActionMsg(null), 3500);
    } catch (err: unknown) {
      console.error(err);
      setActionMsg({ type: "error", text: "Có lỗi khi lưu sản phẩm." });
    }
  };

  // Xóa sản phẩm (CHỈ ADMIN)
  const handleDeleteProduct = async (slug: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers,
      });
      const result = await res.json();

      if (!res.ok) {
        setActionMsg({ type: "error", text: result.error || "Không thể xóa sản phẩm lúc này." });
        return;
      }

      await fetchAllProducts();
      const updated = productList.filter((p) => p.slug !== slug);
      localStorage.setItem("ths_custom_products", JSON.stringify(updated));

      setActionMsg({ type: "success", text: `Đã xóa sản phẩm "${name}" thành công!` });
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err) {
      console.error(err);
      setActionMsg({ type: "error", text: "Không thể xóa sản phẩm lúc này." });
    }
  };

  // ===================== QUẢN LÝ USER =====================

  // Đổi vai trò Admin / Buyer
  const handleChangeRole = async (targetUserId: string, newRole: "admin" | "buyer") => {
    setUpdatingRoleId(targetUserId);
    setActionMsg(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers,
        body: JSON.stringify({ id: targetUserId, role: newRole }),
      });
      const result = await res.json();

      if (!res.ok) {
        setActionMsg({ type: "error", text: "Lỗi cập nhật quyền: " + (result.error || "") });
      } else {
        setActionMsg({
          type: "success",
          text: `Đã đổi vai trò người dùng sang ${newRole === "admin" ? "QUẢN TRỊ VIÊN" : "KHÁCH MUA"}!`,
        });
        await fetchAllProfiles();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setActionMsg({ type: "error", text: "Có lỗi xảy ra khi cập nhật vai trò." });
    } finally {
      setUpdatingRoleId(null);
    }
  };

  // Lưu thông tin chỉnh sửa user
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          id: editingUser.id,
          full_name: editingUser.full_name?.trim() || "",
          phone: editingUser.phone?.trim() || "",
          address: editingUser.address?.trim() || "",
          role: editingUser.role,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        setActionMsg({ type: "error", text: "Lỗi lưu thông tin user: " + (result.error || "") });
      } else {
        setActionMsg({ type: "success", text: "Đã cập nhật thông tin người dùng thành công!" });
        setEditingUser(null);
        await fetchAllProfiles();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setActionMsg({ type: "error", text: "Có lỗi xảy ra khi cập nhật." });
    }
  };

  // Xóa user khỏi profiles
  const handleDeleteUser = async (u: Profile) => {
    if (u.id === user?.id) {
      alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${u.full_name || u.id}" không?`)) {
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(u.id)}`, {
        method: "DELETE",
        headers,
      });
      const result = await res.json();

      if (!res.ok) {
        setActionMsg({ type: "error", text: "Lỗi khi xóa tài khoản: " + (result.error || "") });
      } else {
        setActionMsg({ type: "success", text: "Đã xóa tài khoản khỏi hệ thống!" });
        await fetchAllProfiles();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
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

  const isAdmin =
    profile?.role === "admin" ||
    user?.user_metadata?.role === "admin" ||
    user?.email === "admin@thanhoangsam.vn";

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-luxury text-white p-4">
        <div className="max-w-md text-center space-y-4 rounded-3xl border border-rose-500/50 bg-rose-950/60 p-8 shadow-2xl">
          <ShieldAlert className="h-12 w-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white uppercase">Khu Vực Giới Hạn Quản Trị</h2>
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

  // Lọc sản phẩm
  const filteredProducts = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.slug.includes(searchProduct.toLowerCase());
    const matchType = filterType === "all" || p.type === filterType;
    return matchSearch && matchType;
  });

  // Lọc người dùng
  const filteredUsers = profilesList.filter((p) => {
    const matchSearch =
      p.full_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
      p.phone?.includes(searchUser) ||
      p.id.includes(searchUser);
    const matchRole = filterRole === "all" || p.role === filterRole;
    return matchSearch && matchRole;
  });

  const adminCount = profilesList.filter((p) => p.role === "admin").length;
  const buyerCount = profilesList.filter((p) => p.role === "buyer").length;

  return (
    <div className="min-h-screen bg-luxury text-white py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── Header Admin ── */}
        <div className="rounded-3xl border-2 border-[var(--gold)]/60 bg-gradient-to-r from-[#2b0508] via-[#1c0306] to-black p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gold)] text-[#2b0508] font-black text-2xl shadow border border-[var(--gold-light)]">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-black text-[var(--gold)] uppercase">
                  Bảng Quản Trị Hệ Thống
                </h1>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-400/40">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Quản trị viên: <b className="text-white">{profile?.full_name || user?.email}</b>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fetchAllProfiles();
                fetchAllProducts();
              }}
              className="rounded-xl border border-[var(--gold)]/50 bg-black/60 px-3.5 py-2 text-xs font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508] transition flex items-center gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Đồng bộ</span>
            </button>

            <button
              type="button"
              onClick={signOut}
              className="rounded-xl border border-rose-500/50 bg-rose-950/40 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* ── 4 Thẻ KPI thống kê nhanh ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-[var(--gold)]/40 bg-black/50 p-4 shadow text-center">
            <Package className="h-5 w-5 text-[var(--gold)] mx-auto mb-1.5" />
            <p className="text-2xl font-black text-white">{productList.length}</p>
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Tổng sản phẩm</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-black/50 p-4 shadow text-center">
            <Users className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-2xl font-black text-emerald-300">{buyerCount}</p>
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Khách mua hàng</p>
          </div>

          <div className="rounded-2xl border border-amber-500/40 bg-black/50 p-4 shadow text-center">
            <ShieldAlert className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
            <p className="text-2xl font-black text-amber-300">{adminCount}</p>
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Quản trị viên</p>
          </div>

          <div className="rounded-2xl border border-sky-500/40 bg-black/50 p-4 shadow text-center">
            <QrCode className="h-5 w-5 text-sky-400 mx-auto mb-1.5" />
            <p className="text-2xl font-black text-sky-300">{lots.length}</p>
            <p className="text-[10px] text-stone-400 uppercase font-semibold">Lô hàng xác thực</p>
          </div>
        </div>

        {/* ── Thông báo kết quả thao tác ── */}
        {actionMsg && (
          <div
            className={`flex items-center gap-2.5 rounded-2xl p-3.5 text-xs font-bold animate-in fade-in ${
              actionMsg.type === "success"
                ? "border border-emerald-500/60 bg-emerald-950/70 text-emerald-200"
                : "border border-rose-500/60 bg-rose-950/70 text-rose-200"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* ── Thanh chuyển Tab Quản Trị ── */}
        <div className="flex border-b border-[var(--gold)]/30 bg-black/40 rounded-2xl p-1 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "products"
                ? "bg-[var(--gold)] text-[#2b0508] shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Quản Lý Sản Phẩm ({productList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "users"
                ? "bg-[var(--gold)] text-[#2b0508] shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Quản Lý Người Dùng ({profilesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lots")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === "lots"
                ? "bg-[var(--gold)] text-[#2b0508] shadow"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>Sổ Lô Hàng ({lots.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: QUẢN LÝ SẢN PHẨM (CRUD HOÀN CHỈNH) */}
        {/* ======================================================== */}
        {activeTab === "products" && (
          <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-5">
            {/* Header tab + Nút Thêm mới */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
                  <Package className="h-5 w-5 text-[var(--gold)]" />
                  <span>Danh Sách Sản Phẩm & Thay Đổi Giá</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Thêm mới, chỉnh sửa thông tin, giá bán và hình ảnh sản phẩm
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateProduct}
                className="btn-gold !py-2.5 !px-4 text-xs font-bold flex items-center gap-1.5 shadow-lg shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm sản phẩm mới</span>
              </button>
            </div>

            {/* Bộ lọc & Tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-black/50 p-3 rounded-2xl border border-[var(--gold)]/20">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                {["all", "Sâm tươi", "Sâm khô", "Cao sâm", "Rượu sâm"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilterType(t)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition ${
                      filterType === t
                        ? "bg-[var(--gold)] text-[#2b0508]"
                        : "border border-[var(--gold)]/30 bg-black/40 text-stone-300 hover:text-white"
                    }`}
                  >
                    {t === "all" ? "Tất cả loại" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            {loadingProducts ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Đang tải danh sách sản phẩm...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.slug}
                    className="rounded-2xl border border-[var(--gold)]/40 bg-gradient-to-b from-[#250407] to-black p-4 flex gap-4 items-start shadow-xl hover:border-[var(--gold)] transition"
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--gold)]/30">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>

                    {/* Thông tin */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[var(--gold)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--gold-light)] border border-[var(--gold)]/30">
                          {p.type} • {p.age}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white truncate">{p.name}</h3>
                      <p className="text-xs text-[var(--gold-light)] font-bold">
                        Từ {vnd(minPrice(p))}
                      </p>
                      <p className="text-[11px] text-stone-400 line-clamp-1">{p.summary}</p>

                      {/* Các gói giá (variants) */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.variants?.map((v, i) => (
                          <span
                            key={i}
                            className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-stone-300 border border-white/10"
                          >
                            {v.label}: {vnd(v.price)}
                          </span>
                        ))}
                      </div>

                      {/* Nút hành động */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="rounded-lg border border-[var(--gold)]/60 bg-[var(--gold)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508] transition flex items-center gap-1"
                        >
                          <Edit2 size={12} />
                          <span>Sửa sản phẩm</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.slug, p.name)}
                          className="rounded-lg border border-rose-500/50 bg-rose-950/40 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-900 transition flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          <span>Xóa</span>
                        </button>

                        <Link
                          href={`/san-pham/${p.slug}`}
                          target="_blank"
                          className="text-[11px] text-stone-400 hover:text-[var(--gold)] hover:underline ml-auto flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Xem live</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: QUẢN LÝ NGƯỜI DÙNG & TÀI KHOẢN (PROFILES) */}
        {/* ======================================================== */}
        {activeTab === "users" && (
          <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
                  <Users className="h-5 w-5 text-[var(--gold)]" />
                  <span>Quản Lý Người Dùng & Phân Quyền</span>
                </h2>
                <p className="text-xs text-stone-400">
                  Dữ liệu trực tiếp từ Supabase Database bảng profiles
                </p>
              </div>

              {/* Lọc vai trò */}
              <div className="flex items-center gap-2">
                {(["all", "admin", "buyer"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilterRole(r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      filterRole === r
                        ? "bg-[var(--gold)] text-[#2b0508]"
                        : "border border-[var(--gold)]/30 bg-black/40 text-stone-300 hover:text-white"
                    }`}
                  >
                    {r === "all" ? "Tất cả" : r === "admin" ? "Quản trị viên" : "Khách mua"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tìm kiếm user */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Tìm theo họ tên, số điện thoại, ID..."
                className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 outline-none focus:border-[var(--gold)]"
              />
            </div>

            {/* Bảng danh sách user */}
            {loadingProfiles ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Đang tải dữ liệu từ Supabase...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Không tìm thấy người dùng nào phù hợp.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--gold)]/30 text-[var(--gold-light)] uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-3">Người dùng</th>
                      <th className="py-3 px-3">Vai trò</th>
                      <th className="py-3 px-3">Số điện thoại</th>
                      <th className="py-3 px-3">Địa chỉ nhận hàng</th>
                      <th className="py-3 px-3">Ngày tạo</th>
                      <th className="py-3 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)] font-bold text-xs border border-[var(--gold)]/40 shrink-0">
                              {u.full_name ? u.full_name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="font-bold text-white">{u.full_name || "(Chưa có tên)"}</p>
                              <p className="text-[10px] text-stone-400 font-mono">{u.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 font-bold uppercase text-[10px] ${
                              u.role === "admin"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                            }`}
                          >
                            {u.role === "admin" ? "Quản trị viên" : "Khách mua"}
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
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút sửa */}
                            <button
                              type="button"
                              onClick={() => setEditingUser(u)}
                              className="rounded-lg border border-[var(--gold)]/50 bg-black/40 p-1.5 text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508] transition"
                              title="Sửa thông tin"
                            >
                              <Edit2 size={13} />
                            </button>

                            {/* Đổi vai trò */}
                            {u.id !== user?.id && (
                              <button
                                type="button"
                                disabled={updatingRoleId === u.id}
                                onClick={() =>
                                  handleChangeRole(u.id, u.role === "admin" ? "buyer" : "admin")
                                }
                                className={`rounded-lg border px-2 py-1 text-[10px] font-bold transition ${
                                  u.role === "admin"
                                    ? "border-rose-500/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900"
                                    : "border-[var(--gold)]/50 bg-[var(--gold)]/20 text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508]"
                                }`}
                              >
                                {updatingRoleId === u.id
                                  ? "..."
                                  : u.role === "admin"
                                  ? "Hạ Buyer"
                                  : "Nâng Admin"}
                              </button>
                            )}

                            {/* Nút xóa */}
                            {u.id !== user?.id && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                className="rounded-lg border border-rose-500/40 p-1.5 text-rose-400 hover:bg-rose-900 transition"
                                title="Xóa tài khoản"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: QUẢN LÝ SỔ LÔ & QR TRUY XUẤT */}
        {/* ======================================================== */}
        {activeTab === "lots" && (
          <div className="rounded-3xl border border-[var(--gold)]/30 bg-black/40 p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-[var(--gold-light)] flex items-center gap-2">
              <QrCode className="h-5 w-5 text-[var(--gold)]" />
              <span>Sổ Lô Hàng Khắc Mã Tra Cứu Tem QR</span>
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

      </div>

      {/* ======================================================== */}
      {/* MODAL THÊM / SỬA SẢN PHẨM (CREATE / UPDATE PRODUCT MODAL) */}
      {/* ======================================================== */}
      {(isCreatingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-[var(--gold)] bg-[#1a0204] text-white shadow-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="shrink-0 flex items-center justify-between border-b border-[var(--gold)]/30 bg-gradient-to-r from-[var(--red)] to-[#3a0a10] px-5 py-3.5">
              <h3 className="font-heading text-base font-bold text-[var(--gold-light)] uppercase flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--gold)]" />
                <span>{editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingProduct(false);
                  setEditingProduct(null);
                }}
                className="rounded-full p-1 text-stone-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form cuộn */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">
                    Tên sản phẩm (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProductForm((prev) => ({
                        ...prev,
                        name: val,
                        // Tự sinh slug nếu đang tạo mới
                        slug: isCreatingProduct ? generateSlug(val) : prev.slug,
                      }));
                    }}
                    placeholder="VD: Sâm Báo Hoàng Gia..."
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">
                    Đường dẫn URL Slug (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.slug || ""}
                    onChange={(e) => setProductForm({ ...productForm, slug: generateSlug(e.target.value) })}
                    placeholder="VD: sam-bao-hoang-gia"
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white font-mono focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">
                    Loại sản phẩm
                  </label>
                  <select
                    value={productForm.type}
                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value as ProductType })}
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/80 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                  >
                    <option value="Sâm tươi">Sâm tươi</option>
                    <option value="Sâm khô">Sâm khô</option>
                    <option value="Cao sâm">Cao sâm</option>
                    <option value="Rượu sâm">Rượu sâm</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">
                    Độ tuổi sâm
                  </label>
                  <input
                    type="text"
                    value={productForm.age || ""}
                    onChange={(e) => setProductForm({ ...productForm, age: e.target.value })}
                    placeholder="VD: 3 năm tuổi"
                    className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>

              {/* Ảnh sản phẩm */}
              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Đường dẫn ảnh đại diện
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productForm.image || ""}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="/images/..."
                    className="flex-1 rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white font-mono focus:border-[var(--gold)] outline-none text-[11px]"
                  />
                  {productForm.image && (
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-black shrink-0 border border-[var(--gold)]">
                      <img src={productForm.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Danh sách ảnh thật chọn nhanh */}
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] text-stone-400 shrink-0">Chọn nhanh ảnh:</span>
                  {availableImages.slice(0, 6).map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: imgUrl })}
                      className={`h-8 w-8 rounded-lg overflow-hidden shrink-0 border transition ${
                        productForm.image === imgUrl ? "border-[var(--gold)] ring-2 ring-[var(--gold)]" : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Mô tả tóm tắt (Summary)
                </label>
                <textarea
                  rows={2}
                  value={productForm.summary || ""}
                  onChange={(e) => setProductForm({ ...productForm, summary: e.target.value })}
                  placeholder="Mô tả ngắn gọn về sản phẩm hiển thị trên card..."
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Chi tiết nguồn gốc & công dụng (Detail)
                </label>
                <textarea
                  rows={3}
                  value={productForm.detail || ""}
                  onChange={(e) => setProductForm({ ...productForm, detail: e.target.value })}
                  placeholder="Chi tiết về vùng trồng, dược tính Saponin..."
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Hướng dẫn sử dụng (Usage)
                </label>
                <textarea
                  rows={2}
                  value={productForm.usage || ""}
                  onChange={(e) => setProductForm({ ...productForm, usage: e.target.value })}
                  placeholder="Cách dùng, liều lượng, đối tượng sử dụng..."
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                />
              </div>

              {/* Bảng phân loại giá (Variants) */}
              <div className="space-y-2 border-t border-[var(--gold)]/20 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[var(--gold-light)] uppercase tracking-wider">
                    Các phân loại & giá bán (Variants)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = productForm.variants || [];
                      setProductForm({
                        ...productForm,
                        variants: [...cur, { label: "Gói mới", price: 500000 }],
                      });
                    }}
                    className="rounded-lg border border-[var(--gold)]/50 bg-[var(--gold)]/20 px-2 py-0.5 text-[11px] font-bold text-[var(--gold-light)] hover:bg-[var(--gold)] hover:text-[#2b0508] transition flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Thêm gói giá</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {productForm.variants?.map((v, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={v.label}
                        onChange={(e) => {
                          const updated = [...(productForm.variants || [])];
                          updated[idx].label = e.target.value;
                          setProductForm({ ...productForm, variants: updated });
                        }}
                        placeholder="Tên gói (VD: 500g, 1kg...)"
                        className="flex-1 rounded-lg border border-[var(--gold)]/30 bg-black/60 px-3 py-1.5 text-white outline-none"
                      />
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => {
                          const updated = [...(productForm.variants || [])];
                          updated[idx].price = Number(e.target.value) || 0;
                          setProductForm({ ...productForm, variants: updated });
                        }}
                        placeholder="Giá bán (VND)"
                        className="w-32 rounded-lg border border-[var(--gold)]/30 bg-black/60 px-3 py-1.5 text-white font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (productForm.variants || []).filter((_, i) => i !== idx);
                          setProductForm({ ...productForm, variants: updated });
                        }}
                        className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-900/50"
                        title="Xóa phân loại"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút Submit */}
              <div className="pt-3 border-t border-[var(--gold)]/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="rounded-xl border border-stone-600 px-4 py-2 text-xs font-bold text-stone-300 hover:text-white"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="btn-gold !py-2 !px-5 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL SỬA THÔNG TIN NGƯỜI DÙNG (EDIT USER MODAL) */}
      {/* ======================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-[var(--gold)] bg-[#1a0204] text-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--gold)]/30 pb-3">
              <h3 className="font-heading text-base font-bold text-[var(--gold-light)] uppercase flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--gold)]" />
                <span>Chỉnh Sửa Thông Tin Người Dùng</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-full p-1 text-stone-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  ID Tài Khoản (Supabase Auth UID)
                </label>
                <input
                  type="text"
                  disabled
                  value={editingUser.id}
                  className="w-full rounded-xl border border-stone-800 bg-black/80 px-3 py-2 text-stone-500 font-mono text-[10px] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={editingUser.full_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="0918 168 888"
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Địa chỉ giao nhận
                </label>
                <textarea
                  rows={2}
                  value={editingUser.address || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                  placeholder="Số nhà, đường, quận/huyện..."
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/60 px-3 py-2 text-white focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">
                  Vai trò hệ thống
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as "admin" | "buyer" })}
                  className="w-full rounded-xl border border-[var(--gold)]/40 bg-black/80 px-3 py-2 text-white focus:border-[var(--gold)] outline-none font-bold"
                >
                  <option value="buyer">Khách mua (Buyer)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[var(--gold)]/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl border border-stone-600 px-4 py-2 text-xs font-bold text-stone-300 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-gold !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Save className="h-4 w-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
