"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardProductsPage() {
  const { user, linkedDevices, linkDevice, unlinkDevice } = useAuth();
  const [shortId, setShortId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = shortId.replace(/\D/g, "").slice(-4);
    if (trimmed.length < 4) {
      setError("Enter the 4-digit Short-ID from your Prism device.");
      return;
    }
    setLoading(true);
    const ok = await linkDevice(trimmed);
    setLoading(false);
    if (ok) setShortId("");
    else setError("Could not register device. You may already have it registered.");
  }

  async function handleUnlink(id: string) {
    await unlinkDevice(id);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Your Products</h1>
      <p className="mt-2 text-zinc-400">
        Prism devices linked to your account. Register a new device with its 4-digit Short-ID.
      </p>

      {/* Registry */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium text-white">Register a device</h2>
        <form onSubmit={handleRegister} className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={shortId}
            onChange={(e) => setShortId(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="0000"
            className="w-24 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-center text-white placeholder-zinc-500 focus:border-[#ff6b35] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-medium text-white hover:bg-[#e85a2a] disabled:opacity-50 transition-colors"
          >
            {loading ? "Registering…" : "Register device"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </section>

      {/* Product list */}
      <section className="mt-8">
        <h2 className="text-lg font-medium text-white">Registered devices</h2>
        {linkedDevices.length === 0 ? (
          <p className="mt-4 text-zinc-500">
            No devices yet. Register your Prism above using the 4-digit Short-ID shown on the device.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {linkedDevices.map((device) => (
              <li
                key={device.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff6b35]/20 text-2xl">
                    📻
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {device.productName ?? "Prism"} · Short-ID {device.shortId}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Registered {new Date(device.linkedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnlink(device.id)}
                  className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
                >
                  Unlink
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
