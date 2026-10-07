import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jjgyvbddopfvyxwbueia.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZ3l2YmRkb3Bmdnl4d2J1ZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4Mjc3MDYsImV4cCI6MjEwNjQwMzcwNn0.h_IHml6XM9Lh-8IwB0RgKYHX9r7Ac5TBu4PLbT5ahx0";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZ3l2YmRkb3Bmdnl4d2J1ZWlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDgyNzcwNiwiZXhwIjoyMTA2NDAzNzA2fQ.FcZT7FZInSooNYaYVsW76Oy4hcy81MDx1cn9W9hQams";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Có thể bỏ qua nếu được gọi từ Server Component thuần túy
          }
        },
      },
    }
  );
}

export function createAdminClient() {
  return createServerClient(
    SUPABASE_URL,
    SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}
