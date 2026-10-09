import { createClient as createServerClient, createAdminClient } from "@/lib/supabase/server";

export async function verifyAdminUser(request: Request) {
  try {
    // 1. Thử lấy token từ header Authorization: Bearer <token>
    const authHeader = request.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    const adminClient = createAdminClient();
    let user = null;

    if (token) {
      const { data, error } = await adminClient.auth.getUser(token);
      if (!error && data?.user) {
        user = data.user;
      }
    }

    // 2. Nếu không có token trong header, thử đọc session từ Cookie
    if (!user) {
      const serverClient = await createServerClient();
      const { data, error } = await serverClient.auth.getUser();
      if (!error && data?.user) {
        user = data.user;
      }
    }

    if (!user) {
      return {
        authorized: false,
        error: "Bạn chưa đăng nhập hoặc phiên làm việc đã kết thúc.",
        status: 401,
      };
    }

    // 3. Kiểm tra vai trò Admin (Metadata hoặc bảng profiles hoặc email admin)
    const metaRole = user.user_metadata?.role;
    const email = user.email;

    if (metaRole === "admin" || email === "admin@thanhoangsam.vn") {
      return { authorized: true, user };
    }

    // Tra cứu thêm trong bảng profiles bằng adminClient
    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return { authorized: true, user };
    }

    return {
      authorized: false,
      error: "Từ chối truy cập: Chỉ Quản trị viên (Admin) mới có quyền thực hiện thao tác này!",
      status: 403,
    };
  } catch (err) {
    console.error("Lỗi xác thực Admin:", err);
    return {
      authorized: false,
      error: "Lỗi hệ thống khi xác thực quyền Admin.",
      status: 500,
    };
  }
}
