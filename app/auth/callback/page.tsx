"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/app/components/Skeleton";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setStatus("error");
      return;
    }

    const next = searchParams.get("next") ?? "/reset-password";

    function redirect() {
      router.replace(next);
    }

    // Read from hash first (Supabase default), then from query (some clients strip hash)
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const query = typeof window !== "undefined" ? window.location.search : "";
    const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
    const queryParams = new URLSearchParams(query);

    const getParam = (name: string) =>
      hashParams.get(name) ?? queryParams.get(name);

    const accessToken = getParam("access_token");
    const refreshToken = getParam("refresh_token");
    const type = getParam("type");

    if (type === "recovery" && accessToken) {
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken ?? "",
        })
        .then(() => {
          setStatus("done");
          if (window.history.replaceState) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }
          redirect();
        })
        .catch(() => {
          setStatus("error");
          setTimeout(redirect, 2000);
        });
    } else {
      setStatus("done");
      redirect();
    }
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6">
      <div className="text-center text-zinc-400 flex flex-col items-center gap-4">
        {status === "loading" && (
          <>
            <FiLoader className="h-10 w-10 animate-spin text-white/60" aria-hidden />
            <p>Confirming your link…</p>
          </>
        )}
        {status === "done" && (
          <>
            <FiLoader className="h-10 w-10 animate-spin text-white/60" aria-hidden />
            <p>Redirecting…</p>
          </>
        )}
        {status === "error" && (
          <p>Something went wrong. Redirecting you to reset password…</p>
        )}
      </div>
    </main>
  );
}

/**
 * Auth callback: Supabase redirects here with tokens in the URL hash (or query).
 * We set the session and redirect to the intended page (e.g. /reset-password).
 */
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-6 gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-40 rounded" />
        </main>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
