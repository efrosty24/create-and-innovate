"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { PasswordInput } from "@/app/components/PasswordInput";
import { useAuth } from "@/app/context/AuthContext";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const ok = await signUp(email, password, { first_name: firstName, last_name: lastName });
    if (ok) {
      const next = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } else setError("An account with this email already exists.");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0c0c0c] pt-16 sm:pt-14 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign up to link your Prism device and manage your community.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                placeholder="Last name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                placeholder="you@example.com"
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-full bg-[#ff6b35] py-3 text-sm font-medium text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              Sign up
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-[#ff6b35] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
