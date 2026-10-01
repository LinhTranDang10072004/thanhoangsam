import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const path = request.nextUrl.pathname;

  // Tối ưu tốc độ: Chỉ kiểm tra Auth khi truy cập các trang nhạy cảm
  const isProtected = path.startsWith("/admin") || path.startsWith("/tai-khoan");
  const isAuthPage = path === "/dang-nhap" || path === "/dang-ky";

  // Nếu là các trang xem sản phẩm, trang chủ, nguồn gốc... thì trả về ngay lập tức (0ms delay)
  if (!isProtected && !isAuthPage) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Lấy user hiện tại
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Bảo vệ khu vực ADMIN (/admin)
  if (path.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dang-nhap";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    // Kiểm tra nhanh trong user_metadata trước để không cần query database nếu đã có
    if (user.user_metadata?.role === "admin") {
      return supabaseResponse;
    }

    // Kiểm tra role trong bảng profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      // Không phải admin -> đưa về trang chủ
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // 2. Bảo vệ trang Người Mua (/tai-khoan)
  if (path.startsWith("/tai-khoan")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dang-nhap";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }
  }

  // 3. Nếu đã đăng nhập mà lại vào /dang-nhap hoặc /dang-ky -> điều hướng theo role
  if (user && isAuthPage) {
    let role = user.user_metadata?.role;
    if (!role) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      role = profile?.role;
    }

    const url = request.nextUrl.clone();
    if (role === "admin") {
      url.pathname = "/admin";
    } else {
      url.pathname = "/tai-khoan";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
