"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  email: string;
  name: string;
};

export type LinkedDevice = {
  id: string;
  shortId: string;
  linkedAt: string;
};

type AuthContextType = {
  user: User | null;
  linkedDevices: LinkedDevice[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => void;
  linkDevice: (shortId: string) => void;
  unlinkDevice: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "prism_user";
const DEVICES_KEY = "prism_linked_devices";
const USERS_KEY = "prism_users";

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function loadLinkedDevices(): LinkedDevice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DEVICES_KEY);
    return raw ? (JSON.parse(raw) as LinkedDevice[]) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [linkedDevices, setLinkedDevices] = useState<LinkedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(loadUser());
    setLinkedDevices(loadLinkedDevices());
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const users: Array<{ email: string; password: string; id: string; name: string }> = raw
        ? JSON.parse(raw)
        : [];
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) return false;
      const userData: User = { id: found.id, email: found.email, name: found.name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const users: Array<{ email: string; password: string; id: string; name: string }> = raw
        ? JSON.parse(raw)
        : [];
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return false;
      const id = crypto.randomUUID();
      const newUser = { id, email, password, name };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const userData: User = { id, email, name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const linkDevice = useCallback((shortId: string) => {
    const device: LinkedDevice = {
      id: crypto.randomUUID(),
      shortId: shortId.padStart(4, "0").slice(-4),
      linkedAt: new Date().toISOString(),
    };
    setLinkedDevices((prev) => {
      const next = [...prev, device];
      localStorage.setItem(DEVICES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const unlinkDevice = useCallback((id: string) => {
    setLinkedDevices((prev) => {
      const next = prev.filter((d) => d.id !== id);
      localStorage.setItem(DEVICES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

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
