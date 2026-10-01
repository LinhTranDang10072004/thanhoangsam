"use client";

import Reveal from "./Reveal";
import { Play } from "lucide-react";

const galleryItems = [
  {
    type: "image",
    src: "/images/1790691441898_2251207849705082306_2251207849705082306_7a2293e702ff67d82a4a3b2886011494.jpg",
    aspectRatio: "aspect-[4/5]",
  },
  {
    type: "image",
    src: "/images/1790691441922_2251207849705082306_2251207849705082306_49add4d443a5310c1f040d1325d4d802.jpg",
    aspectRatio: "aspect-square",
  },
  {
    type: "image",
    src: "/images/1790691441975_2251207849705082306_2251207849705082306_97f1219099e9b56dc9c0c7e8d40bec80.jpg",
    aspectRatio: "aspect-[3/4]",
  },
  {
    type: "video",
    src: "/images/1790691442241_2251207849705082306_2251207849705082306.mp4",
    aspectRatio: "aspect-[9/16]",
  },
  {
    type: "image",
    src: "/images/1790691441998_2251207849705082306_2251207849705082306_a8baaafcabe1bc4601e12128627d81b0.jpg",
    aspectRatio: "aspect-square",
  },
  {
    type: "image",
    src: "/images/1790691442022_2251207849705082306_2251207849705082306_6ad8864197f32490ffac32f52b5b6ebd.jpg",
    aspectRatio: "aspect-[4/3]",
  },
  {
    type: "image",
    src: "/images/1790691442045_2251207849705082306_2251207849705082306_8df163c6132ac12d701e8c1d5c6145fa.jpg",
    aspectRatio: "aspect-square",
  },
  {
    type: "video",
    src: "/images/1790691442427_2251207849705082306_2251207849705082306.mp4",
    aspectRatio: "aspect-[9/16]",
  },
  {
    type: "image",
    src: "/images/1790691442069_2251207849705082306_2251207849705082306_38971826cc8331ac9d7612bd266f8633.jpg",
    aspectRatio: "aspect-[3/4]",
  },
  {
    type: "image",
    src: "/images/1790691442095_2251207849705082306_2251207849705082306_6d97ca5064721c8d9a1349080f124d78.jpg",
    aspectRatio: "aspect-square",
  },
  {
    type: "image",
    src: "/images/1790691442119_2251207849705082306_2251207849705082306_aedb7d95c80a1affc750e1ba7ce42898.jpg",
    aspectRatio: "aspect-[4/5]",
  },
  {
    type: "image",
    src: "/images/1790691442144_2251207849705082306_2251207849705082306_7c4ce215dbe2225f393b15647133cb84.jpg",
    aspectRatio: "aspect-square",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-[#1a0204] py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-gold-gradient text-center text-4xl font-extrabold md:text-5xl">Hình ảnh thực tế từ vườn sâm</h2>
            <div className="gold-line mx-auto mt-4" />
            <p className="mt-4 text-[var(--gold-light)]/80 max-w-2xl mx-auto">
              Mọi hình ảnh được ghi lại trực tiếp tại vườn sâm Núi Báo, Vĩnh Lộc
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className={`relative overflow-hidden rounded-2xl w-full group ${item.aspectRatio}`}>
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt="Vườn sâm Núi Báo"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/40 rounded-full p-3 backdrop-blur-sm shadow-xl">
                        <Play className="w-8 h-8 text-white fill-white opacity-80" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
