"use client";

import SafeSpaceMap from "./SafeSpaceMap";
import { DEMO_SAFE_PLACES } from "./data";

export default function SafeSpacePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-white">Safe Space</h1>
      <p className="mt-2 text-zinc-400">
        Your location and nearby queer-friendly establishments and safe meeting areas.
      </p>

      <div className="mt-8">
        <SafeSpaceMap places={DEMO_SAFE_PLACES} />
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium text-white">Legend</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full bg-green-500 border-2 border-white"
              aria-hidden
            />
            Your location
          </li>
          <li className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full bg-[#ff6b35] border-2 border-white"
              aria-hidden
            />
            Queer-friendly establishment or safe meeting area
          </li>
        </ul>
        <p className="mt-4 text-xs text-zinc-500">
          Demo data shown. Connect a places API or Supabase table for your area.
        </p>
      </section>
    </div>
  );
}
