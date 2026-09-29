import { advise } from "@/lib/advisor";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const message =
    typeof body === "object" && body && "message" in body ? (body as { message: unknown }).message : "";

  if (typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "Thiếu nội dung" }, { status: 400 });
  }

  return Response.json(advise(message.slice(0, 500)));
}
