"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { priceQuote, products, type Product } from "@/lib/data";

const KEY = "ths-cart";

export type CartItem = { slug: string; variant: string; qty: number };

export type CartLine = CartItem & {
  product: Product;
  unit: number;
  rate: number;
  subtotal: number;
  total: number;
  save: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  notice: string | null;
  add: (slug: string, variant: string, qty: number) => void;
  setQty: (slug: string, variant: string, qty: number) => void;
  remove: (slug: string, variant: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function validItem(item: CartItem) {
  return (
    item &&
    typeof item.slug === "string" &&
    typeof item.variant === "string" &&
    typeof item.qty === "number" &&
    item.qty > 0
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter(validItem));
      }
    } catch {
      localStorage.removeItem(KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2400);
    return () => clearTimeout(timer);
  }, [notice]);

  const add = (slug: string, variant: string, qty: number) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.slug === slug && item.variant === variant);
      if (index === -1) return [...prev, { slug, variant, qty }];
      const next = [...prev];
      next[index] = { ...next[index], qty: Math.min(20, next[index].qty + qty) };
      return next;
    });
    setNotice("Đã thêm vào giỏ hàng");
  };

  const setQty = (slug: string, variant: string, qty: number) => {
    setItems((prev) =>
      qty < 1
        ? prev.filter((item) => !(item.slug === slug && item.variant === variant))
        : prev.map((item) =>
            item.slug === slug && item.variant === variant ? { ...item, qty: Math.min(20, qty) } : item,
          ),
    );
  };

  const remove = (slug: string, variant: string) => {
    setItems((prev) => prev.filter((item) => !(item.slug === slug && item.variant === variant)));
  };

  const clear = () => setItems([]);

  const lines = useMemo(() => {
    return items.flatMap((item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      const variant = product?.variants.find((entry) => entry.label === item.variant);
      if (!product || !variant) return [];
      return [{ ...item, product, unit: variant.price, ...priceQuote(variant.price, item.qty) }];
    });
  }, [items]);

  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + line.total, 0);

  return (
    <CartContext.Provider value={{ lines, count, total, notice, add, setQty, remove, clear }}>
      {children}
      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-4 z-50 rounded-xl bg-[var(--red-dark)] px-4 py-3 font-semibold text-[var(--gold-light)] shadow-xl"
        >
          {notice}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải nằm trong CartProvider");
  return context;
}
