import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="section-title">Không thấy trang này</h1>
      <div className="gold-line" />
      <p>Đường dẫn không còn, hoặc sản phẩm chưa có trên shop.</p>
      <Link href="/" className="btn-gold mt-6">
        Về trang chủ
      </Link>
    </div>
  );
}
