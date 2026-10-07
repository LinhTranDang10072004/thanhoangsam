"use client";

import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "admin" | "buyer";
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = async (userId: string, currentUser?: User | null) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      } else if (currentUser) {
        const metaRole = currentUser.user_metadata?.role;
        setProfile({
          id: userId,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "",
          phone: currentUser.user_metadata?.phone || null,
          address: null,
          role: metaRole === "admin" ? "admin" : "buyer",
          avatar_url: null,
        });
      }
    } catch (err) {
      console.error("Lỗi tải thông tin profile:", err);
      if (currentUser) {
        const metaRole = currentUser.user_metadata?.role;
        setProfile({
          id: userId,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "",
          phone: currentUser.user_metadata?.phone || null,
          address: null,
          role: metaRole === "admin" ? "admin" : "buyer",
          avatar_url: null,
        });
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  };

  useEffect(() => {
    // 1. Kiểm tra session hiện tại
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Lỗi khởi tạo session:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Lắng nghe thay đổi trạng thái đăng nhập/đăng xuất
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
