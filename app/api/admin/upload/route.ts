import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAdminUser } from "@/lib/auth-server";

export async function POST(request: Request) {
  const auth = await verifyAdminUser(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Vui lòng chọn file ảnh để tải lên." }, { status: 400 });
    }

    // Lấy cấu hình Cloudinary từ biến môi trường hoặc từ form data admin gửi lên
    const cloudName =
      (formData.get("cloud_name") as string) ||
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const apiKey =
      (formData.get("api_key") as string) ||
      process.env.CLOUDINARY_API_KEY;

    const apiSecret =
      (formData.get("api_secret") as string) ||
      process.env.CLOUDINARY_API_SECRET;

    const uploadPreset =
      (formData.get("upload_preset") as string) ||
      process.env.CLOUDINARY_UPLOAD_PRESET;

    // Chuyển File thành base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // 1. Nếu có đầy đủ API Key & Secret -> Upload qua Cloudinary SDK
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });

      const uploadResult = await cloudinary.uploader.upload(base64Data, {
        folder: "thanhoangsam/products",
        resource_type: "image",
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
      });
    }

    // 2. Nếu có Cloud Name & Upload Preset -> Upload qua REST API Cloudinary
    if (cloudName && uploadPreset) {
      const cldForm = new FormData();
      cldForm.append("file", base64Data);
      cldForm.append("upload_preset", uploadPreset);
      cldForm.append("folder", "thanhoangsam/products");

      const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cldForm,
      });

      const cldData = await cldRes.json();
      if (!cldRes.ok) {
        return NextResponse.json(
          { error: cldData.error?.message || "Lỗi tải ảnh lên Cloudinary" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        url: cldData.secure_url,
        public_id: cldData.public_id,
      });
    }

    // 3. Nếu chưa cấu hình Cloudinary
    return NextResponse.json(
      {
        error:
          "Chưa thiết lập Cloudinary. Vui lòng thêm CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET vào .env.local hoặc nhập cấu hình trong trang Admin.",
        needsConfig: true,
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Lỗi upload Cloudinary:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Lỗi xử lý tải ảnh" },
      { status: 500 }
    );
  }
}
