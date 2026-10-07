import { NextResponse } from "next/server";
import { createClient as createServerClient, createAdminClient } from "@/lib/supabase/server";

// Helper xác thực quyền Admin
async function verifyAdminUser(request: Request) {
  try {
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

    const metaRole = user.user_metadata?.role;
    const email = user.email;

    if (metaRole === "admin" || email === "admin@thanhoangsam.vn") {
      return { authorized: true, user };
    }

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
      error: "Từ chối truy cập: Chỉ Quản trị viên (Admin) mới có quyền truy cập!",
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

// GET: Lấy danh sách toàn bộ User (profiles) kèm email từ Auth
export async function GET(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const adminClient = createAdminClient();
    
    // 1. Lấy profiles
    const { data: profiles, error: pErr } = await adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    // 2. Lấy auth users để ghép email chính xác
    const { data: authData } = await adminClient.auth.admin.listUsers();
    const emailMap = new Map<string, string>();
    if (authData?.users) {
      authData.users.forEach((u) => {
        if (u.email) emailMap.set(u.id, u.email);
      });
    }

    const merged = (profiles || []).map((p) => ({
      ...p,
      email: emailMap.get(p.id) || p.email || "",
    }));

    return NextResponse.json({ profiles: merged });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi lấy danh sách người dùng";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT: Cập nhật thông tin / vai trò user
export async function PUT(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { id, role, full_name, phone, address } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID người dùng." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    
    // Cập nhật bảng profiles
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (role !== undefined) updatePayload.role = role;
    if (full_name !== undefined) updatePayload.full_name = full_name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (address !== undefined) updatePayload.address = address;

    const { error: pErr } = await adminClient
      .from("profiles")
      .update(updatePayload)
      .eq("id", id);

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    // Nếu đổi role, cập nhật luôn user_metadata trong auth.users để đồng bộ
    if (role !== undefined) {
      await adminClient.auth.admin.updateUserById(id, {
        user_metadata: { role },
      });
    }

    return NextResponse.json({ success: true, message: "Cập nhật thành công!" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi cập nhật người dùng";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Xóa profile
export async function DELETE(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID người dùng." }, { status: 400 });
    }

    if (auth.user?.id === id) {
      return NextResponse.json({ error: "Không thể tự xóa tài khoản của chính mình!" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("profiles").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa người dùng thành công!" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa người dùng";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
