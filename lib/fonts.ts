import localFont from "next/font/local";

export const beVietnamLatin = localFont({
  src: [
    { path: "../fonts/bvp-400-lat.woff2", weight: "400", style: "normal" },
    { path: "../fonts/bvp-500-lat.woff2", weight: "500", style: "normal" },
    { path: "../fonts/bvp-600-lat.woff2", weight: "600", style: "normal" },
    { path: "../fonts/bvp-700-lat.woff2", weight: "700", style: "normal" },
    { path: "../fonts/bvp-800-lat.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-latin",
  adjustFontFallback: false,
});

export const beVietnamViet = localFont({
  src: [
    { path: "../fonts/bvp-400-vi.woff2", weight: "400", style: "normal" },
    { path: "../fonts/bvp-500-vi.woff2", weight: "500", style: "normal" },
    { path: "../fonts/bvp-600-vi.woff2", weight: "600", style: "normal" },
    { path: "../fonts/bvp-700-vi.woff2", weight: "700", style: "normal" },
    { path: "../fonts/bvp-800-vi.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-viet",
  adjustFontFallback: false,
  preload: false,
});
