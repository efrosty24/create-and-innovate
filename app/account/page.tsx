"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { useAuth } from "@/app/context/AuthContext";

export default function AccountPage() {
  const { user, linkedDevices, linkDevice, unlinkDevice, isLoading } = useAuth();
  const [shortId, setShortId] = useState("");
  const [linkError, setLinkError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      const next = "/account";
      router.push(`/sign-in?next=${encodeURIComponent(next)}`);
    }
  }, [user, isLoading, router]);

  async function handleLinkDevice(e: React.FormEvent) {
    e.preventDefault();
    setLinkError("");
    const trimmed = shortId.replace(/\D/g, "").slice(-4);
    if (trimmed.length < 4) {
      setLinkError("Enter the 4-digit Short-ID from your Prism device.");
      return;
    }
    const ok = await linkDevice(trimmed);
    if (ok) setShortId("");
    else setLinkError("Could not link device. It may already be linked.");
  }

  if (isLoading || !user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0c0c0c] pt-14 flex items-center justify-center">
          <p className="text-zinc-400">Loading…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0c0c0c] pt-16 sm:pt-14 pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold text-white">Account</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your profile and linked Prism devices.
          </p>

          {/* Profile */}
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium text-white">Profile</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">First name</dt>
                <dd className="mt-1 text-white">{user.first_name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Last name</dt>
                <dd className="mt-1 text-white">{user.last_name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Email</dt>
                <dd className="mt-1 text-white">{user.email}</dd>
              </div>
            </dl>
          </section>

          {/* Linked devices */}
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium text-white">Linked Prism devices</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Devices linked to this account. Use the 4-digit Short-ID from your device to add one.
            </p>

            <form onSubmit={handleLinkDevice} className="mt-6 flex gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={shortId}
                onChange={(e) => setShortId(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="0000"
                className="w-24 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-medium text-white hover:bg-[#e85a2a] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                Link device
              </button>
            </form>
            {linkError && (
              <p className="mt-2 text-sm text-red-400">{linkError}</p>
            )}

            {linkedDevices.length === 0 ? (
              <p className="mt-6 text-sm text-zinc-500">
                No devices linked yet. Enter a 4-digit Short-ID above to link your Prism.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {linkedDevices.map((device) => (
                  <li
                    key={device.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div>
                      <span className="font-mono font-medium text-white">
                        Short-ID: {device.shortId}
                      </span>
                      <span className="ml-3 text-xs text-zinc-500">
                        Linked {new Date(device.linkedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => unlinkDevice(device.id)}
                      className="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      Unlink
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="mt-10 text-center text-sm text-zinc-500">
            <Link href="/" className="text-[#ff6b35] hover:underline">
              Back to Prism
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
/*please work*/