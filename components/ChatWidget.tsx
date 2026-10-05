"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, X, Sparkles, MessageCircle } from "lucide-react";
import type { Advice } from "@/lib/advisor";
import GinsengMascot from "./GinsengMascot";

type Msg = { from: "bot" | "user"; text: string; links?: Advice["links"] };

const greeting: Msg = {
  from: "bot",
  text: "Chào bạn! Tôi là trợ lý AI Sâm Báo 🌿. Bạn cần tư vấn về cách dùng sâm bồi bổ sức khỏe, cải thiện giấc ngủ, hay tìm hiểu nguồn gốc núi Báo?",
};

const quickQuestions = [
  "Người cao tuổi nên dùng loại sâm nào?",
  "Cách dùng cao sâm Báo hiệu quả?",
  "Cách nhận biết sâm Báo hoa vàng chính gốc?",
  "Bảo quản sâm tươi được bao lâu?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, open, busy]);

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || busy) return;
    setMsgs((current) => [...current, { from: "user", text }]);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = (await response.json()) as Advice & { error?: string };
      if (!response.ok) throw new Error(data.error || "Lỗi");
      setMsgs((current) => [...current, { from: "bot", text: data.text, links: data.links }]);
    } catch {
      setMsgs((current) => [
        ...current,
        { from: "bot", text: "Tôi chưa trả lời được lúc này. Bạn vui lòng gọi hotline 0359 821 856 hoặc xem trang Sản phẩm giúp tôi nhé!" },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Khung cửa sổ Chat AI */}
      {open && (
        <div className="fixed right-3 sm:right-4 bottom-20 md:bottom-24 z-50 w-96 max-w-[94vw] overflow-hidden rounded-3xl border-3 border-[var(--gold)] bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          {/* Header với Nhân vật củ sâm */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[var(--red)] via-[var(--red-dark)] to-[#3a0a10] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-black/40 shadow-inner">
                <GinsengMascot className="h-9 w-9" animated={false} />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-[var(--gold-light)] leading-tight">Bé Sâm Báo AI</h4>
                  <Sparkles className="h-3 w-3 text-amber-300" />
                </div>
                <p className="text-[11px] text-stone-200">Trợ lý am hiểu sâm • Đang trực tuyến</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng khung chat"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-[var(--gold-light)] hover:bg-white/10 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Vùng tin nhắn */}
          <div className="h-88 space-y-3 overflow-y-auto p-4 text-sm bg-gradient-to-b from-[#fffbf2] to-white" aria-live="polite">
            {msgs.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${message.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.from === "bot" && (
                  <div className="h-8 w-8 shrink-0 rounded-full border border-[var(--gold)] bg-[var(--cream)] flex items-center justify-center shadow-sm">
                    <GinsengMascot className="h-7 w-7" animated={false} />
                  </div>
                )}
                <div className={`max-w-[80%] ${message.from === "user" ? "text-right" : ""}`}>
                  <span
                    className={`inline-block rounded-2xl px-3.5 py-2.5 shadow-sm whitespace-pre-wrap ${
                      message.from === "user"
                        ? "bg-[var(--red)] text-white font-medium rounded-tr-none"
                        : "bg-white text-stone-800 border border-[var(--gold-light)] rounded-tl-none font-normal"
                    }`}
                  >
                    {message.text}
                  </span>
                  {message.links && message.links.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {message.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-lg bg-[var(--gold-light)] px-2.5 py-1 text-xs font-bold text-[var(--red)] hover:bg-[var(--gold)] hover:text-white transition"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-[var(--red)]">
                <GinsengMascot className="h-6 w-6" animated={true} />
                <span className="font-semibold italic">Bé Sâm đang suy nghĩ câu trả lời...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Gợi ý câu hỏi nhanh */}
          <div className="border-t border-stone-100 bg-[#fffdfa] px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="shrink-0 rounded-full border border-[var(--gold-light)] bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:border-[var(--red)] hover:text-[var(--red)] transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="flex items-center border-t border-stone-200 bg-white p-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              placeholder="Hỏi về cách dùng, công dụng sâm..."
              className="flex-1 px-3 py-2 text-sm outline-none text-stone-800"
              aria-label="Câu hỏi tư vấn"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={busy || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--red)] text-white transition hover:bg-[var(--red-dark)] disabled:opacity-40"
              aria-label="Gửi tin nhắn"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Nút bấm nổi: Nhân vật củ sâm hoạt hình đáng yêu */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group fixed right-3 sm:right-4 bottom-18 md:bottom-6 z-50 flex items-center gap-2 rounded-full border-2 border-[var(--gold)] bg-gradient-to-r from-[var(--red)] to-[#4a0a10] p-1.5 pr-3.5 sm:pr-4 shadow-[0_8px_25px_rgba(155,17,30,0.45)] transition-all hover:scale-105 active:scale-95"
        aria-label={open ? "Đóng tư vấn" : "Mở tư vấn AI củ sâm"}
      >
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)] bg-[#2a0508] shadow-inner">
          <GinsengMascot className="h-10 w-10" animated={!open} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>
        <div className="text-left">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--gold-light)] flex items-center gap-1">
            <span>Hỏi AI Sâm</span>
            <Sparkles className="h-3 w-3 text-amber-300" />
          </p>
          <p className="text-[10px] font-semibold text-stone-300">Tư vấn trực tiếp 24/7</p>
        </div>
      </button>
    </>
  );
}
