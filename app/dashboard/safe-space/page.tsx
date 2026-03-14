"use client";

import { useState, useMemo, useEffect } from "react";
import SafeSpaceMap from "./SafeSpaceMap";
import LocationFeedbackPanel from "./LocationFeedbackPanel";
import Pagination from "./Pagination";
import { useSafeLocationsAndAreas } from "./useSafeData";
import { DEMO_SAFE_PLACES } from "./data";
import { SkeletonRect, SkeletonListItem } from "@/app/components/Skeleton";
import type { SafeLocation } from "@/types/safe";
import type { SafeArea } from "@/types/safe";

const PAGE_SIZE = 10;

export default function SafeSpacePage() {
  const { locations, areas, placesForMap, loading, error } = useSafeLocationsAndAreas();
  const [selectedLocation, setSelectedLocation] = useState<SafeLocation | null>(null);
  const [selectedArea, setSelectedArea] = useState<SafeArea | null>(null);
  const [establishmentsPage, setEstablishmentsPage] = useState(1);
  const [areasPage, setAreasPage] = useState(1);

  const places = placesForMap.length > 0 ? placesForMap : DEMO_SAFE_PLACES;
  const showFeedback = selectedLocation !== null || selectedArea !== null;

  const establishmentsTotalPages = Math.max(1, Math.ceil(locations.length / PAGE_SIZE));
  const areasTotalPages = Math.max(1, Math.ceil(areas.length / PAGE_SIZE));

  const paginatedLocations = useMemo(() => {
    const start = (establishmentsPage - 1) * PAGE_SIZE;
    return locations.slice(start, start + PAGE_SIZE);
  }, [locations, establishmentsPage]);

  const paginatedAreas = useMemo(() => {
    const start = (areasPage - 1) * PAGE_SIZE;
    return areas.slice(start, start + PAGE_SIZE);
  }, [areas, areasPage]);

  useEffect(() => {
    if (establishmentsTotalPages > 0 && establishmentsPage > establishmentsTotalPages) {
      setEstablishmentsPage(1);
    }
  }, [establishmentsTotalPages, establishmentsPage]);

  useEffect(() => {
    if (areasTotalPages > 0 && areasPage > areasTotalPages) {
      setAreasPage(1);
    }
  }, [areasTotalPages, areasPage]);

  return (
    <div className="min-w-0">
      <h1 className="text-xl font-semibold text-white sm:text-2xl">Safe Space</h1>
      <p className="mt-2 text-zinc-400">
        Your location and nearby queer-friendly establishments and safe areas. Add comments and feedback on a place.
      </p>

      {error && (
        <p className="mt-4 text-sm text-amber-400">Could not load some data. Showing map with demo places.</p>
      )}

      {showFeedback && (
        <LocationFeedbackPanel
          safeLocation={selectedLocation}
          safeArea={selectedArea}
          onClose={() => {
            setSelectedLocation(null);
            setSelectedArea(null);
          }}
        />
      )}

      {/* Layout: on md+ left = scrollable lists, right = sticky map + legend */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr] md:gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Left column: scrollable Establishments and Safe areas */}
        <div className="flex flex-col gap-6 min-w-0 overflow-y-auto max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-8rem)]">
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
              <>
                <ul className="mt-4 space-y-2">
                  {paginatedLocations.map((loc) => (
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
                <Pagination
                  currentPage={establishmentsPage}
                  totalPages={establishmentsTotalPages}
                  onPageChange={setEstablishmentsPage}
                  label="Page"
                />
              </>
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
              <>
                <ul className="mt-4 space-y-2">
                  {paginatedAreas.map((area) => (
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
                <Pagination
                  currentPage={areasPage}
                  totalPages={areasTotalPages}
                  onPageChange={setAreasPage}
                  label="Page"
                />
              </>
            )}
          </section>
        </div>

        {/* Right column: sticky Map + Legend (does not scroll with page) */}
        <div className="flex flex-col gap-4 min-w-0 order-first md:order-none md:sticky md:top-4 md:self-start">
          <div className="min-w-0">
            {loading ? (
              <SkeletonRect className="h-[60vh] min-h-[280px] w-full rounded-xl sm:rounded-2xl border border-white/10" />
            ) : (
              <SafeSpaceMap places={places} />
            )}
          </div>
          <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:rounded-2xl sm:p-6 shrink-0">
            <h2 className="text-lg font-medium text-white">Legend</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-green-500 border-2 border-white shrink-0" aria-hidden />
                Your location
              </li>
              <li className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#ff6b35] border-2 border-white shrink-0" aria-hidden />
                Establishment or safe area
              </li>
            </ul>
            <p className="mt-4 text-xs text-zinc-500">
              Safe locations and areas are read-only from the app; add or edit them in the database. You can post comments and feedback on any place.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
