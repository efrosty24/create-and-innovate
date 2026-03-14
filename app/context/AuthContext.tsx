"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

export type User = {
  id: string;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export type LinkedDevice = {
  id: string;
  shortId: string;
  productName: string | null;
  linkedAt: string;
};

type AuthContextType = {
  user: User | null;
  linkedDevices: LinkedDevice[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    meta: { first_name: string; last_name: string }
  ) => Promise<boolean>;
  signOut: () => void;
  linkDevice: (shortId: string) => Promise<boolean>;
  unlinkDevice: (id: string) => Promise<void>;
  updateProfile: (updates: {
    username?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  }) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  resetPasswordForEmail: (email: string, redirectTo?: string) => Promise<{ ok: boolean; message?: string }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "prism_user";
const DEVICES_KEY = "prism_linked_devices";
const USERS_KEY = "prism_users";

function loadUserFallback(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      id: string;
      email: string;
      name: string;
      first_name?: string;
      last_name?: string;
    };
    return {
      ...parsed,
      first_name: parsed.first_name ?? null,
      last_name: parsed.last_name ?? null,
      username: null,
      avatar_url: null,
    };
  } catch {
    return null;
  }
}

function loadLinkedDevicesFallback(): LinkedDevice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DEVICES_KEY);
    return raw
      ? (JSON.parse(raw) as Array<{ id: string; shortId: string; linkedAt: string }>).map(
          (d) => ({ ...d, productName: "Prism" })
        )
      : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [linkedDevices, setLinkedDevices] = useState<LinkedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (uid: string) => {
      if (!supabase) return null;
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, username, avatar_url")
        .eq("id", uid)
        .single();
      return data;
    },
    [supabase]
  );

  const fetchProducts = useCallback(async () => {
    if (!supabase?.auth?.getUser) return;
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (!u) return;
    const { data } = await supabase
      .from("user_products")
      .select("id, short_id, product_name, registered_at")
      .eq("user_id", u.id)
      .order("registered_at", { ascending: false });
    setLinkedDevices(
      (data ?? []).map((r) => ({
        id: r.id,
        shortId: r.short_id,
        productName: r.product_name ?? "Prism",
        linkedAt: r.registered_at,
      }))
    );
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) return;
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (!u) return;
    const profile = await fetchProfile(u.id);
    setUser((prev) =>
      prev && prev.id === u.id
        ? {
            ...prev,
            first_name: profile?.first_name ?? null,
            last_name: profile?.last_name ?? null,
            email: profile?.email ?? prev.email,
            username: profile?.username ?? null,
            avatar_url: profile?.avatar_url ?? null,
          }
        : prev
    );
  }, [supabase, fetchProfile]);

  useEffect(() => {
    if (!supabase) {
      setUser(loadUserFallback());
      setLinkedDevices(loadLinkedDevicesFallback());
      setIsLoading(false);
      return;
    }

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        const firstName = profile?.first_name ?? session.user.user_metadata?.first_name ?? "";
        const lastName = profile?.last_name ?? session.user.user_metadata?.last_name ?? "";
        const name = [firstName, lastName].filter(Boolean).join(" ") || (session.user.email ?? "");
        setUser({
          id: session.user.id,
          email: profile?.email ?? session.user.email ?? "",
          name,
          first_name: profile?.first_name ?? null,
          last_name: profile?.last_name ?? null,
          username: profile?.username ?? null,
          avatar_url: profile?.avatar_url ?? null,
        });
        const { data } = await supabase
          .from("user_products")
          .select("id, short_id, product_name, registered_at")
          .eq("user_id", session.user.id)
          .order("registered_at", { ascending: false });
        setLinkedDevices(
          (data ?? []).map((r) => ({
            id: r.id,
            shortId: r.short_id,
            productName: r.product_name ?? "Prism",
            linkedAt: r.registered_at,
          }))
        );
      } else {
        setUser(null);
        setLinkedDevices([]);
      }
      setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setLinkedDevices([]);
        return;
      }
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        const firstName = profile?.first_name ?? session.user.user_metadata?.first_name ?? "";
        const lastName = profile?.last_name ?? session.user.user_metadata?.last_name ?? "";
        const name = [firstName, lastName].filter(Boolean).join(" ") || (session.user.email ?? "");
        setUser({
          id: session.user.id,
          email: profile?.email ?? session.user.email ?? "",
          name,
          first_name: profile?.first_name ?? null,
          last_name: profile?.last_name ?? null,
          username: profile?.username ?? null,
          avatar_url: profile?.avatar_url ?? null,
        });
        fetchProducts();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile, fetchProducts]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return !error;
      }
      try {
        const raw = localStorage.getItem(USERS_KEY);
        const users: Array<{ email: string; password: string; id: string; name: string }> = raw
          ? JSON.parse(raw)
          : [];
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) return false;
        const userData: User = {
          id: found.id,
          email: found.email,
          name: found.name,
          first_name: null,
          last_name: null,
          username: null,
          avatar_url: null,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        setLinkedDevices(loadLinkedDevicesFallback());
        return true;
      } catch {
        return false;
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      meta: { first_name: string; last_name: string }
    ) => {
      if (supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: meta.first_name,
              last_name: meta.last_name,
            },
          },
        });
        return !error;
      }
      try {
        const raw = localStorage.getItem(USERS_KEY);
        const name = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || email;
        const users: Array<{ email: string; password: string; id: string; name: string }> = raw
          ? JSON.parse(raw)
          : [];
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return false;
        const id = crypto.randomUUID();
        users.push({ id, email, password, name });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        const userData: User = {
          id,
          email,
          name,
          first_name: meta.first_name || null,
          last_name: meta.last_name || null,
          username: null,
          avatar_url: null,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        setLinkedDevices([]);
        return true;
      } catch {
        return false;
      }
    },
    [supabase]
  );

  const signOut = useCallback(() => {
    if (supabase) {
      supabase.auth.signOut();
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setLinkedDevices([]);
    }
  }, [supabase]);

  const linkDevice = useCallback(
    async (shortId: string) => {
      const normalized = shortId.replace(/\D/g, "").padStart(4, "0").slice(-4);
      if (normalized.length < 4) return false;
      if (supabase) {
        const {
          data: { user: u },
        } = await supabase.auth.getUser();
        if (!u) return false;
        const { error } = await supabase.from("user_products").insert({
          user_id: u.id,
          short_id: normalized,
        });
        if (!error) await fetchProducts();
        return !error;
      }
      const device: LinkedDevice = {
        id: crypto.randomUUID(),
        shortId: normalized,
        productName: "Prism",
        linkedAt: new Date().toISOString(),
      };
      setLinkedDevices((prev) => {
        const next = [...prev, device];
        localStorage.setItem(
          DEVICES_KEY,
          JSON.stringify(next.map((d) => ({ id: d.id, shortId: d.shortId, linkedAt: d.linkedAt })))
        );
        return next;
      });
      return true;
    },
    [supabase, fetchProducts]
  );

  const unlinkDevice = useCallback(
    async (id: string) => {
      if (supabase) {
        await supabase.from("user_products").delete().eq("id", id);
        await fetchProducts();
      } else {
        setLinkedDevices((prev) => {
          const next = prev.filter((d) => d.id !== id);
          localStorage.setItem(
            DEVICES_KEY,
            JSON.stringify(next.map((d) => ({ id: d.id, shortId: d.shortId, linkedAt: d.linkedAt })))
          );
          return next;
        });
      }
    },
    [supabase, fetchProducts]
  );

  const updateProfile = useCallback(
    async (updates: {
      username?: string;
      avatar_url?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
    }) => {
      if (!supabase) return false;
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (!u) return false;
      const { error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", u.id);
      if (!error) await refreshProfile();
      return !error;
    },
    [supabase, refreshProfile]
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      if (!supabase) return false;
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return !error;
    },
    [supabase]
  );

  const resetPasswordForEmail = useCallback(
    async (email: string, redirectTo?: string): Promise<{ ok: boolean; message?: string }> => {
      if (!supabase) return { ok: false, message: "Auth is not configured." };
      const url = redirectTo ?? (typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: url,
      });
      if (error) return { ok: false, message: error.message };
      return { ok: true };
    },
    [supabase]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        linkedDevices,
        isLoading,
        signIn,
        signUp,
        signOut,
        linkDevice,
        unlinkDevice,
        updateProfile,
        updatePassword,
        resetPasswordForEmail,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
