"use client";

import { useState } from "react";
import SafeSpaceMap from "./SafeSpaceMap";
import LocationFeedbackPanel from "./LocationFeedbackPanel";
import { useSafeLocationsAndAreas } from "./useSafeData";
import { DEMO_SAFE_PLACES } from "./data";
import { SkeletonRect, SkeletonListItem } from "@/app/components/Skeleton";
import type { SafeLocation } from "@/types/safe";
import type { SafeArea } from "@/types/safe";

export default function SafeSpacePage() {
  const { locations, areas, placesForMap, loading, error } = useSafeLocationsAndAreas();
  const [selectedLocation, setSelectedLocation] = useState<SafeLocation | null>(null);
  const [selectedArea, setSelectedArea] = useState<SafeArea | null>(null);

  const places = placesForMap.length > 0 ? placesForMap : DEMO_SAFE_PLACES;
  const showFeedback = selectedLocation !== null || selectedArea !== null;

  return (
    <div className="mx-auto max-w-4xl min-w-0 px-0">
      <h1 className="text-xl font-semibold text-white sm:text-2xl">Safe Space</h1>
      <p className="mt-2 text-zinc-400">
        Your location and nearby queer-friendly establishments and safe areas. Add comments and feedback on a place.
      </p>

      {error && (
        <p className="mt-4 text-sm text-amber-400">Could not load some data. Showing map with demo places.</p>
      )}

      <div className="mt-6 sm:mt-8">
        {loading ? (
          <SkeletonRect className="h-[280px] w-full sm:h-[360px] md:h-[400px] rounded-xl sm:rounded-2xl border border-white/10" />
        ) : (
          <SafeSpaceMap places={places} />
        )}
      </div>

      {showFeedback && (
        <div className="mt-6">
          <LocationFeedbackPanel
            safeLocation={selectedLocation}
            safeArea={selectedArea}
            onClose={() => {
              setSelectedLocation(null);
              setSelectedArea(null);
            }}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 sm:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6">
          <h2 className="text-lg font-medium text-white">Establishments</h2>
          <p className="mt-1 text-sm text-zinc-500">Queer-friendly venues. Click to view or add feedback.</p>
          {loading ? (
            <div className="mt-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonListItem key={i} className="!p-4" />
              ))}
            </div>
          ) : locations.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No establishments in the database yet. Add them at the DBMS level.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedArea(null);
                      setSelectedLocation(loc);
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    {loc.establishment_name}
                    {loc.location && <span className="block text-zinc-500 text-xs mt-1">{loc.location}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6">
          <h2 className="text-lg font-medium text-white">Safe areas</h2>
          <p className="mt-1 text-sm text-zinc-500">Cities, towns, streets. Click to view or add feedback.</p>
          {loading ? (
            <div className="mt-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonListItem key={i} className="!p-4" />
              ))}
            </div>
          ) : areas.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No safe areas in the database yet. Add them at the DBMS level.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {areas.map((area) => (
                <li key={area.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocation(null);
                      setSelectedArea(area);
                    }}
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    {area.name}
                    <span className="block text-zinc-500 text-xs mt-1 capitalize">{area.area_type}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 sm:mt-8 sm:rounded-2xl sm:p-6">
        <h2 className="text-lg font-medium text-white">Legend</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-400">
          <li className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-500 border-2 border-white" aria-hidden />
            Your location
          </li>
          <li className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-[#ff6b35] border-2 border-white" aria-hidden />
            Establishment or safe area
          </li>
        </ul>
        <p className="mt-4 text-xs text-zinc-500">
          Safe locations and areas are read-only from the app; add or edit them in the database. You can post comments and feedback on any place above.
        </p>
      </section>
    </div>
  );
}
