import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Collection from "@/components/Collection";
import Stats from "@/components/Stats";
import Story from "@/components/Story";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import GallerySection from "@/components/GallerySection";
import { products } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Marquee />
      <Hero />
      <Collection />

      <section className="bg-[var(--cream)] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <h2 className="section-title">Sản phẩm đang có</h2>
            <div className="gold-line" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {products.map((product) => (
              <Reveal key={product.slug}>
                <ProductCard p={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats />
      <GallerySection />
      <Story />

      <section className="bg-luxury py-24 text-center text-white">
        <Reveal>
          <h2 className="text-gold-gradient text-4xl font-extrabold md:text-5xl">Trân trọng từng củ sâm</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--gold-light)]/85">
            Quét mã QR trên bao bì để xem sâm được trồng ở đâu, thu hoạch khi nào.
          </p>
          <Link href="/nguon-goc" className="btn-gold mt-8">
            Tra cứu mã lô hàng
          </Link>
        </Reveal>
      </section>
    </>
  );
}
