import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Giỏ hàng Thanh Hoàng Sâm. Shop gọi xác nhận trước khi giao.",
};

export default function CartPage() {
  return <CartView />;
}
