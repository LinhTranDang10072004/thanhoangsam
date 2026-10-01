import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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

  const path = request.nextUrl.pathname;

  // 1. Bảo vệ khu vực ADMIN (/admin)
  if (path.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dang-nhap";
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    // Kiểm tra role admin trong bảng profiles
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
  if (user && (path === "/dang-nhap" || path === "/dang-ky")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (profile?.role === "admin") {
      url.pathname = "/admin";
    } else {
      url.pathname = "/tai-khoan";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
