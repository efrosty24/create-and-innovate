"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const { user, isLoading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 min-h-[56px] items-center justify-between px-4 sm:px-6 bg-[#0c0c0c]/95 backdrop-blur-xl border-b border-white/5 safe-area-inset-top">
      <Link href="/" className="text-base sm:text-lg font-semibold tracking-tight text-white shrink-0">
        Prism
      </Link>

      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-4 md:gap-6">
        <Link href="/#features" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
          Features
        </Link>
        <Link href="/#hardware" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
          Hardware
        </Link>
        <Link href="/#security" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
          Security
        </Link>
        {!isLoading &&
          (user ? (
            <>
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                Dashboard
              </Link>
              <Link href="/account" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                Account
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm text-zinc-400 hover:bg-white/10 hover:text-white transition-colors rounded-lg px-3 py-2"
              >
                Sign Out
              </button>
              <Link
                href="/account"
                className="text-sm font-medium px-4 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                <span className="truncate max-w-[120px] md:max-w-none">{user.username || user.name || user.email}</span>
              </Link>
            </>
          ) : (
            <>
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

      {/* Mobile: menu button + primary CTA */}
      <div className="flex sm:hidden items-center gap-2">
        {!isLoading && user && (
          <Link
            href="/account"
            className="text-sm font-medium px-3 py-2.5 rounded-full bg-white/10 text-white truncate max-w-[100px]"
          >
            {user.username || user.name || user.email}
          </Link>
        )}
        {!isLoading && !user && (
          <Link
            href="/sign-up"
            className="text-sm font-medium px-4 py-2.5 rounded-full bg-[#ff6b35] text-white"
          >
            Sign Up
          </Link>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="inline-tap flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
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
            {!isLoading && user && (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-white border-b border-white/5 hover:bg-white/5 active:bg-white/10">
                  Dashboard
                </Link>
                <Link href="/account" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-white border-b border-white/5 hover:bg-white/5 active:bg-white/10">
                  Account
                </Link>
                <button type="button" onClick={() => { signOut(); setMenuOpen(false); }} className="px-4 py-4 text-left text-zinc-400 hover:bg-white/5 active:bg-white/10 w-full border-b border-white/5">
                  Sign Out
                </button>
              </>
            )}
            {!isLoading && !user && (
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-white border-b border-white/5 hover:bg-white/5 active:bg-white/10">
                Sign In
              </Link>
            )}
          </nav>
        </>
      )}
    </header>
  );
}
