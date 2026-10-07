import { NextResponse } from "next/server";
import { createClient as createServerClient, createAdminClient } from "@/lib/supabase/server";

// Helper xác thực xem người gửi request có phải Admin không
async function verifyAdminUser(request: Request) {
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

// GET: Lấy danh sách sản phẩm (Công khai hoặc Admin)
export async function GET() {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tải sản phẩm";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST: Thêm mới hoặc Cập nhật sản phẩm (CHỈ ADMIN)
export async function POST(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { slug, name, type, age, image, summary, detail, usage, variants, audience, needs } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp đầy đủ tên và đường dẫn (slug) sản phẩm!" },
        { status: 400 }
      );
    }

    const payload = {
      slug: String(slug).trim(),
      name: String(name).trim(),
      type: type || "Sâm tươi",
      age: age || "3 năm tuổi",
      image: image || "",
      summary: summary || "",
      detail: detail || "",
      usage: usage || "",
      variants: Array.isArray(variants) ? variants : [],
      audience: Array.isArray(audience) ? audience : [],
      needs: Array.isArray(needs) ? needs : [],
      updated_at: new Date().toISOString(),
    };

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("products")
      .upsert(payload, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.error("Lỗi lưu sản phẩm vào Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Lưu sản phẩm thành công!",
      product: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi lưu sản phẩm";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Xóa sản phẩm theo slug (CHỈ ADMIN)
export async function DELETE(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Thiếu tham số slug sản phẩm cần xóa." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("products").delete().eq("slug", slug);

    if (error) {
      console.error("Lỗi xóa sản phẩm khỏi Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa sản phẩm ${slug} thành công!`,
      slug,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa sản phẩm";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
