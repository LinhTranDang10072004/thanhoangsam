"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import type { Advice } from "@/lib/advisor";

type Msg = { from: "bot" | "user"; text: string; links?: Advice["links"] };

const greeting: Msg = {
  from: "bot",
  text: "Xin chào! Bác cho con biết nhu cầu (ngủ ngon, tăng sức đề kháng, bồi bổ...) để con gợi ý loại sâm phù hợp nhé.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, open, busy]);

  async function send() {
    const text = input.trim();
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
        { from: "bot", text: "Con chưa trả lời được lúc này. Bác gọi hotline hoặc xem trang Sản phẩm giúp con." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-24 z-50 w-80 max-w-[90vw] overflow-hidden rounded-2xl border-2 border-[var(--gold)] bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[var(--red)] px-4 py-3 font-bold text-[var(--gold)]">
            Tư vấn sâm
            <button type="button" aria-label="Đóng khung chat" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="h-80 space-y-2 overflow-y-auto p-3 text-base" aria-live="polite">
            {msgs.map((message, index) => (
              <div key={index} className={message.from === "user" ? "text-right" : ""}>
                <span
                  className={`inline-block rounded-xl px-3 py-2 whitespace-pre-wrap ${
                    message.from === "user" ? "bg-[var(--gold-light)]" : "bg-gray-100"
                  }`}
                >
                  {message.text}
                </span>
                {message.links && message.links.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {message.links.map((link) => (
                      <Link key={link.href} href={link.href} className="text-sm font-bold text-[var(--red)] underline">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {busy && <p className="text-sm text-[var(--red)]">Đang soạn câu trả lời...</p>}
            <div ref={endRef} />
          </div>
          <div className="flex border-t">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") send();
              }}
              placeholder="Nhập câu hỏi..."
              className="flex-1 px-3 py-3 outline-none"
              aria-label="Câu hỏi tư vấn"
            />
            <button type="button" onClick={send} disabled={busy} className="px-4 text-[var(--red)]" aria-label="Gửi">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="btn-gold fixed right-4 bottom-6 z-50 !rounded-full !p-4 shadow-xl"
        aria-label={open ? "Đóng tư vấn" : "Mở tư vấn sâm"}
      >
        <MessageCircle size={28} />
      </button>
    </>
  );
}
