"use client";

import { useState } from "react";
import { FiLoader } from "react-icons/fi";

export default function PrismWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      // Placeholder: in production, POST to your waitlist API or Supabase
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setMessage("You're on the list. We'll be in touch.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={status === "loading"}
          className="min-h-[48px] flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35] disabled:opacity-50 sm:max-w-xs"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-[48px] shrink-0 rounded-full bg-[#ff6b35] px-6 py-3 text-sm font-medium text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all inline-flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <FiLoader className="h-4 w-4 animate-spin shrink-0" aria-hidden />
              Joining…
            </>
          ) : (
            "Sign up for waitlist"
          )}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
