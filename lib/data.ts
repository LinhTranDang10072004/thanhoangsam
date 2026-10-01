export type Variant = { label: string; price: number };
export type ProductType = "Sâm tươi" | "Sâm khô" | "Cao sâm" | "Rượu sâm";

export type Product = {
  slug: string;
  name: string;
  type: ProductType;
  audience: string[];
  needs: string[];
  age: string;
  image: string;
  summary: string;
  detail: string;
  usage: string;
  variants: Variant[];
};

export const audiences = ["Người cao tuổi", "Người tập thể thao", "Nam", "Nữ"] as const;
export const needs = ["Tăng sức đề kháng", "Cải thiện giấc ngủ", "Bồi bổ cơ thể"] as const;
export const productTypes: ProductType[] = ["Sâm tươi", "Sâm khô", "Cao sâm", "Rượu sâm"];

export const products: Product[] = [
  {
    slug: "sam-bao-tuoi",
    name: "Sâm Báo tươi (hoa vàng)",
    type: "Sâm tươi",
    audience: ["Người cao tuổi", "Nam", "Nữ"],
    needs: ["Tăng sức đề kháng", "Bồi bổ cơ thể"],
    age: "2 năm tuổi",
    image: "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg",
    summary: "Củ sâm Báo tươi, hoa vàng, thu tại núi Báo. Dùng nấu canh, hãm nước hoặc thái mỏng.",
    detail:
      "Sâm mọc tự nhiên trên núi Báo nên người dân gọi là sâm Báo. Củ tươi giữ mùi thơm đặc trưng, phù hợp nhà có người lớn tuổi muốn bồi bổ bữa ăn hằng ngày.",
    usage:
      "Rửa sạch, thái lát mỏng. Có thể nấu với gà hoặc hãm nước ấm. Không dùng thay thuốc. Người đang điều trị bệnh nên hỏi bác sĩ trước khi dùng thường xuyên.",
    variants: [
      { label: "500g", price: 450000 },
      { label: "1kg", price: 850000 },
      { label: "3kg", price: 2400000 },
    ],
  },
  {
    slug: "sam-bao-kho",
    name: "Sâm Báo khô thái lát",
    type: "Sâm khô",
    audience: ["Người cao tuổi", "Nam", "Nữ"],
    needs: ["Bồi bổ cơ thể", "Cải thiện giấc ngủ"],
    age: "4 năm tuổi",
    image: "/images/1790691442022_2251207849705082306_2251207849705082306_6ad8864197f32490ffac32f52b5b6ebd.jpg",
    summary: "Củ thái lát, sấy khô, dễ bảo quản và sắc nước dùng dần.",
    detail:
      "Lát sâm khô từ củ 4 năm tuổi, đóng túi kín. Phù hợp nhà xa muốn cất trữ vài tháng mà không phải dùng hết củ tươi ngay.",
    usage:
      "Lấy 3–5 lát hãm nước sôi để nguội bớt, uống trong ngày. Không sắc lại nhiều lần đến khi nhạt hẳn. Không dùng thay thuốc.",
    variants: [
      { label: "100g", price: 520000 },
      { label: "250g", price: 1200000 },
    ],
  },
  {
    slug: "cao-sam-bao",
    name: "Cao Sâm Báo",
    type: "Cao sâm",
    audience: ["Người cao tuổi", "Nữ"],
    needs: ["Cải thiện giấc ngủ", "Bồi bổ cơ thể"],
    age: "3 năm tuổi",
    image: "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg",
    summary: "Cao cô đặc từ củ sâm Báo, tiện pha với nước ấm mỗi ngày.",
    detail:
      "Cao được nấu từ củ 3 năm tuổi, đóng hũ thủy tinh. Vị đậm, dễ chia liều hơn củ tươi, hợp người muốn dùng đều mà không phải chế biến lâu.",
    usage:
      "Pha khoảng một thìa cà phê với nước ấm. Phụ nữ mang thai, người đang dùng thuốc hoặc có bệnh nền nên hỏi bác sĩ trước. Không dùng thay thuốc.",
    variants: [
      { label: "Hũ 100g", price: 620000 },
      { label: "Hũ 250g", price: 1450000 },
    ],
  },
  {
    slug: "ruou-sam-bao",
    name: "Rượu Sâm Báo",
    type: "Rượu sâm",
    audience: ["Nam", "Người tập thể thao"],
    needs: ["Tăng sức đề kháng"],
    age: "3 năm tuổi",
    image: "/images/1790691442264_2251207849705082306_2251207849705082306_51677dc509da9a7f2ae3b3b674ae2c8a.jpg",
    summary: "Rượu ngâm củ sâm Báo, dành cho người trưởng thành.",
    detail:
      "Chai rượu ngâm từ củ sâm Báo 3 năm tuổi, niêm phong và gắn mã lô. Vị ấm, thường được dùng ít sau bữa tối.",
    usage:
      "Chỉ dành cho người từ đủ 18 tuổi. Dùng một chén nhỏ sau bữa ăn. Không dùng khi lái xe, đang mang thai, cho con bú hoặc đang dùng thuốc có tương tác với rượu.",
    variants: [
      { label: "500ml", price: 380000 },
      { label: "1 lít", price: 700000 },
    ],
  },
];

export type Lot = {
  code: string;
  product: string;
  place: string;
  harvest: string;
  packed: string;
  note: string;
};

export const lots: Lot[] = [
  {
    code: "SB-2026-0915",
    product: "Sâm Báo tươi (hoa vàng)",
    place: "Núi Báo, xã Vĩnh Hùng, huyện Vĩnh Lộc, Thanh Hóa",
    harvest: "15/09/2026",
    packed: "16/09/2026",
    note: "Lô củ tươi, gắn mã trên túi lưới. Dữ liệu minh họa để thử tra cứu.",
  },
  {
    code: "SK-2026-0601",
    product: "Sâm Báo khô thái lát",
    place: "Xưởng sấy Vĩnh Lộc",
    harvest: "01/06/2026",
    packed: "08/06/2026",
    note: "Lát khô đóng túi hút chân không. Dữ liệu minh họa để thử tra cứu.",
  },
  {
    code: "CS-2026-0802",
    product: "Cao Sâm Báo",
    place: "Xưởng chế biến Vĩnh Lộc",
    harvest: "02/08/2026",
    packed: "20/08/2026",
    note: "Hũ cao từ củ 3 năm tuổi. Dữ liệu minh họa để thử tra cứu.",
  },
  {
    code: "RS-2026-0718",
    product: "Rượu Sâm Báo",
    place: "Hầm ngâm Vĩnh Lộc",
    harvest: "18/07/2026",
    packed: "18/09/2026",
    note: "Chai đã niêm phong. Dữ liệu minh họa để thử tra cứu.",
  },
];

export function findLot(code: string) {
  const key = code.trim().toUpperCase();
  return lots.find((lot) => lot.code.toUpperCase() === key) ?? null;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function minPrice(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.price));
}

export function priceQuote(unit: number, qty: number) {
  const rate = qty >= 5 ? 0.1 : qty >= 3 ? 0.05 : 0;
  const subtotal = unit * qty;
  const total = Math.round(subtotal * (1 - rate));
  return { rate, subtotal, total, save: subtotal - total };
}

export const vnd = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
