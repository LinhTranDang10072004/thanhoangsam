import { minPrice, products, vnd, type Product } from "@/lib/data";

export type Advice = {
  text: string;
  links: { href: string; label: string }[];
};

const disclaimer =
  "Đây là gợi ý chọn sản phẩm trên website, không thay thế lời khuyên của bác sĩ.";

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase();
}

function line(product: Product) {
  return `• ${product.name} (${product.type}, ${product.age}) — từ ${vnd(minPrice(product))}. Hợp: ${product.audience.join(", ")}.`;
}

function reply(list: Product[], intro: string): Advice {
  return {
    text: `${intro}\n${list.map(line).join("\n")}\n\nMua từ 3 sản phẩm cùng quy cách giảm 5%, từ 5 sản phẩm giảm 10%.\n${disclaimer}`,
    links: list.map((product) => ({ href: `/san-pham/${product.slug}`, label: product.name })),
  };
}

function pick(slugs: string[]) {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
}

export function advise(raw: string): Advice {
  const query = fold(raw);
  const slugs: string[] = [];
  const add = (slug: string) => {
    if (!slugs.includes(slug)) slugs.push(slug);
  };

  if (/ngu|mat ngu|kho ngu|giac ngu/.test(query)) add("cao-sam-bao");
  if (/de khang|mien dich|om vat|suc khoe/.test(query)) {
    add("sam-bao-tuoi");
    add("ruou-sam-bao");
  }
  if (/the thao|gym|van dong|tap luyen/.test(query)) add("ruou-sam-bao");
  if (/cao tuoi|bo me|(^| )ong( |$)|(^| )ba( |$)|boi bo|met moi|phuc hoi/.test(query)) {
    add("sam-bao-tuoi");
    add("cao-sam-bao");
    add("sam-bao-kho");
  }
  if (/ruou/.test(query) || /(^| )nam( |$)/.test(query)) add("ruou-sam-bao");
  if (/(^| )nu( |$)|phu nu/.test(query)) {
    add("cao-sam-bao");
    add("sam-bao-tuoi");
  }
  if (/sam kho|thai lat|say kho/.test(query)) add("sam-bao-kho");
  if (/sam tuoi|hoa vang|cu tuoi/.test(query)) add("sam-bao-tuoi");
  if (/cao sam|hu cao/.test(query)) add("cao-sam-bao");

  if (/nguon goc|chung nhan|qr|lo hang|truy xuat/.test(query)) {
    return {
      text: `Mỗi túi hoặc chai có mã lô in trên bao bì. Bác vào trang Nguồn gốc, nhập mã để xem nơi thu hoạch. Mã mẫu để thử: SB-2026-0915.\n${disclaimer}`,
      links: [{ href: "/nguon-goc", label: "Tra cứu mã lô" }],
    };
  }

  if (/gia|bao nhieu|tien|bang gia/.test(query) && slugs.length === 0) {
    return {
      text: `${products.map(line).join("\n")}\n\nBác mở trang sản phẩm để chọn quy cách. ${disclaimer}`,
      links: products.map((product) => ({ href: `/san-pham/${product.slug}`, label: product.name })),
    };
  }

  if (/giao hang|ship|van chuyen|thanh toan|doi tra/.test(query)) {
    return {
      text: `Shop giao toàn quốc qua GHTK, GHN và Viettel Post. Phí ship được báo theo địa chỉ khi xác nhận đơn. Thanh toán COD, VietQR, Momo hoặc ZaloPay. Hàng có mã lô thì mới xuất kho.\n${disclaimer}`,
      links: [{ href: "/lien-he", label: "Liên hệ shop" }],
    };
  }

  const list = pick(slugs);
  if (list.length === 0) {
    return {
      text: `Bác nói giúp con đang cần ngủ ngon hơn, bồi bổ, hay tăng sức đề kháng? Hoặc cho con biết bác là nam, nữ, người cao tuổi hay đang tập thể thao.\n${disclaimer}`,
      links: [{ href: "/san-pham", label: "Xem tất cả sản phẩm" }],
    };
  }

  return reply(list, "Con gợi ý mấy loại này, bác bấm tên để xem giá từng quy cách:");
}
