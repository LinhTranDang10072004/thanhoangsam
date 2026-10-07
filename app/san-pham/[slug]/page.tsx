import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/lib/data";
import ProductDetail from "@/components/ProductDetail";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = true;

async function findProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (data) return data as Product;
  } catch {
    // Fallback nếu không kết nối được
  }

  return getProduct(slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return { title: product.name, description: product.summary };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
