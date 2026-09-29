import type { Metadata } from "next";
import Link from "next/link";
import Studio360Experience from "@/components/Studio360Experience";

export const metadata: Metadata = {
  title: "Studio Camera 360° & Trải nghiệm 3D | Sâm Báo Núi Báo",
  description: "Trải nghiệm xoay camera 360 độ tương tác, khám phá chi tiết từng sản phẩm sâm Báo từ nhiều góc độ.",
};

const story = [
  { t: "Núi Báo", d: "Sâm mọc tự nhiên ở xã Vĩnh Hùng, huyện Vĩnh Lộc. Tên gọi đến từ ngọn núi, không phải từ loài báo." },
  { t: "Thu hoạch", d: "Củ được nhổ theo mùa, giữ nguyên rễ con rồi chuyển về xưởng trong ngày." },
  { t: "Chế biến", d: "Một phần bán tươi, phần còn lại thái lát sấy khô, nấu cao hoặc ngâm rượu." },
  { t: "Gắn mã lô", d: "Mỗi túi và chai có mã. Khách nhập mã trên website để xem nơi thu và ngày đóng gói." },
];

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="section-title">Studio Camera 360° Sản Phẩm</h1>
      <div className="gold-line" />
      <p className="mx-auto mb-8 max-w-3xl text-center text-lg">
        Chọn từng sản phẩm bên dưới để xoay camera 360°, phóng to chi tiết vân sâm, chất cao và khám phá các điểm nhận diện đặc trưng.
      </p>
      <Studio360Experience />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {story.map((item, index) => (
          <article key={item.t} className="card p-5">
            <p className="font-extrabold text-[var(--gold)]">0{index + 1}</p>
            <h2 className="text-xl font-extrabold text-[var(--red)]">{item.t}</h2>
            <p className="mt-2">{item.d}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/san-pham" className="btn-gold">
          Chọn sản phẩm
        </Link>
      </div>
    </div>
  );
}
