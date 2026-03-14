"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { Skeleton } from "@/app/components/Skeleton";

export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 min-h-[56px] items-center justify-between px-4 sm:px-6 bg-[#0c0c0c]/95 backdrop-blur-xl border-b border-white/5 safe-area-inset-top">
      <Link
        href={!isLoading && user ? "/dashboard" : "/"}
        className="text-base sm:text-lg font-semibold tracking-tight text-white shrink-0"
      >
        Prism
      </Link>

      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-4 md:gap-6">
        {isLoading && (
          <>
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </>
        )}
        {!isLoading &&
          (user ? (
            <>
              <span className="text-sm text-zinc-400 py-2">
                Welcome, <span className="text-white font-medium truncate max-w-[140px] md:max-w-[200px] inline-block align-bottom">{user.username || user.name || user.email}</span>
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors rounded-lg px-3 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/#features" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                Features
              </Link>
              <Link href="/#hardware" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                Hardware
              </Link>
              <Link href="/#security" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                Security
              </Link>
              <Link href="/sign-in" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium px-4 py-2.5 rounded-full bg-[#ff6b35] text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Sign Up
              </Link>
            </>
          ))}
      </nav>

      {/* Mobile: when logged in = welcome + logout; when logged out = menu + Sign up */}
      <div className="flex sm:hidden items-center gap-2">
        {isLoading && (
          <Skeleton className="h-8 w-24 rounded-full" />
        )}
        {!isLoading && user && (
          <>
            <span className="text-sm text-zinc-400 truncate max-w-[100px]">
              Welcome, <span className="text-white font-medium">{user.username || user.name || user.email}</span>
            </span>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-sm font-medium px-3 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Sign Out
            </button>
          </>
        )}
        {!isLoading && !user && (
          <>
            <Link
              href="/sign-up"
              className="text-sm font-medium px-4 py-2.5 rounded-full bg-[#ff6b35] text-white"
            >
              Sign Up
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-tap flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </>
        )}
      </div>
      {/* Mobile dropdown — only when not logged in */}
      {menuOpen && !user && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 sm:hidden" onClick={() => setMenuOpen(false)} aria-hidden />
          <nav className="fixed top-14 left-0 right-0 z-50 sm:hidden flex flex-col gap-0 bg-[#0c0c0c] border-b border-white/10 shadow-xl">
            <Link href="/#features" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-white border-b border-white/5 hover:bg-white/5 active:bg-white/10">
              Features
            </Link>
            <Link href="/#hardware" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-white border-b border-white/5 hover:bg-white/5 active:bg-white/10">
              Hardware
            </Link>
            <Link href="/#security" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-white border-b border-white/5 hover:bg-white/5 active:bg-white/10">
              Security
            </Link>
            <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-white border-b border-white/5 hover:bg-white/5 active:bg-white/10">
              Sign In
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
