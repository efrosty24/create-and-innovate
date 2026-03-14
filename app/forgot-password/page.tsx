"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import { useAuth } from "@/app/context/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { resetPasswordForEmail } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const { ok, message: msg } = await resetPasswordForEmail(email);
    if (ok) {
      setStatus("success");
      setMessage("Check your email for a link to reset your password.");
    } else {
      setStatus("error");
      setMessage(msg ?? "Something went wrong. Try again.");
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0c0c0c] pt-14 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-white">Reset password</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          {status === "success" ? (
            <div className="mt-8 space-y-3 rounded-lg bg-green-500/20 p-4 text-green-400 text-sm">
              <p>{message}</p>
              <p className="text-zinc-400">
                If the link doesn&apos;t work when you click it, copy the full link from the email and paste it into your browser&apos;s address bar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                  disabled={status === "sending"}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35] disabled:opacity-60"
                  placeholder="you@example.com"
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-red-400">{message}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-[#ff6b35] py-3 text-sm font-medium text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 transition-all"
              >
                {status === "sending" ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-zinc-400">
            <Link
              href="/sign-in"
              className="inline-block py-2 font-medium text-[#ff6b35] hover:underline cursor-pointer focus:outline-none focus:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
