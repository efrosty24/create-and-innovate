"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/app/components/PasswordInput";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [handled, setHandled] = useState(false);
  const { updatePassword, refreshProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");
    const type = params.get("type");
    if (type === "recovery" && accessToken) {
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: params.get("refresh_token") ?? "",
        })
        .then(() => {
          setHandled(true);
          if (window.history.replaceState) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        })
        .catch(() => setHandled(true));
    } else {
      setHandled(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    const ok = await updatePassword(password);
    if (ok) {
      setMessage({ type: "success", text: "Password updated. Redirecting…" });
      await refreshProfile();
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setMessage({ type: "error", text: "Could not update password. The link may have expired." });
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0c0c0c] pt-14 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-white">Set new password</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your new password below.
          </p>
          {!handled ? (
            <p className="mt-8 text-zinc-500">Confirming your link…</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <PasswordInput
                id="reset-password"
                label="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
              />
              <PasswordInput
                id="reset-confirm"
                label="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
              />
              {message && (
                <p
                  className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}
                >
                  {message.text}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-[#ff6b35] py-3 text-sm font-medium text-white hover:bg-[#e85a2a] transition-colors"
              >
                Update password
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-zinc-400">
            <a href="/sign-in" className="font-medium text-[#ff6b35] hover:underline">
              Back to sign in
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
