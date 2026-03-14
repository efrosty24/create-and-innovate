"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { user, isLoading, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-6 bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/5">
      <Link href="/" className="text-lg font-semibold tracking-tight text-white">
        Prism
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/#features"
          className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:inline"
        >
          Features
        </Link>
        <Link
          href="/#hardware"
          className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:inline"
        >
          Hardware
        </Link>
        <Link
          href="/#security"
          className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:inline"
        >
          Security
        </Link>
        {!isLoading &&
          (user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/account"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Account
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                Sign Out
              </button>
              <Link
                href="/account"
                className="text-sm font-medium px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                {user.username || user.name || user.email}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium px-4 py-2 rounded-full bg-[#ff6b35] text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Sign Up
              </Link>
            </>
          ))}
      </nav>
    </header>
  );
}
