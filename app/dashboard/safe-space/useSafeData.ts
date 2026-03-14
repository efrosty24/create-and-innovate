"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SafeLocation, SafeArea, LocationFeedback } from "@/types/safe";
import type { SafePlaceEntry } from "./data";

export function useSafeLocationsAndAreas() {
  const [locations, setLocations] = useState<SafeLocation[]>([]);
  const [areas, setAreas] = useState<SafeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    Promise.all([
      supabase.from("safe_locations").select("*").order("establishment_name"),
      supabase.from("safe_areas").select("*").order("name"),
    ])
      .then(([locRes, areaRes]) => {
        if (locRes.error) setError(locRes.error.message);
        else setLocations((locRes.data as SafeLocation[]) ?? []);
        if (areaRes.error) setError(areaRes.error.message);
        else setAreas((areaRes.data as SafeArea[]) ?? []);
      })
      .finally(() => setLoading(false));
  }, [supabase]);

  const placesForMap: SafePlaceEntry[] = [
    ...locations.map((l) => ({
      id: l.id,
      name: l.establishment_name,
      type: "establishment" as const,
      lat: l.lat,
      lng: l.lng,
      description: l.location,
    })),
    ...areas
      .filter((a) => a.lat != null && a.lng != null)
      .map((a) => ({
        id: a.id,
        name: a.name,
        type: "meeting_area" as const,
        lat: a.lat!,
        lng: a.lng!,
        description: a.region ?? `${a.area_type}`,
      })),
  ];

  return { locations, areas, placesForMap, loading, error };
}

export function useLocationFeedback(
  safeLocationId: string | null,
  safeAreaId: string | null
) {
  const [feedback, setFeedback] = useState<LocationFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(() => {
    if (!supabase || (!safeLocationId && !safeAreaId)) {
      setFeedback([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const table = "location_feedback_with_author";
    let q = supabase.from(table).select("id, user_id, content, created_at, username, first_name, last_name").order("created_at", { ascending: false });
    if (safeLocationId) q = q.eq("safe_location_id", safeLocationId);
    else if (safeAreaId) q = q.eq("safe_area_id", safeAreaId);
    q.then(({ data }) => {
      setFeedback((data as (LocationFeedback & { username?: string; first_name?: string; last_name?: string })[]) ?? []);
      setLoading(false);
    });
  }, [supabase, safeLocationId, safeAreaId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addFeedback = useCallback(
    async (content: string) => {
      if (!supabase || (!safeLocationId && !safeAreaId)) return false;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;
      const { error } = await supabase.from("location_feedback").insert({
        user_id: user.id,
        safe_location_id: safeLocationId || null,
        safe_area_id: safeAreaId || null,
        content: content.trim(),
      });
      if (!error) fetch();
      return !error;
    },
    [supabase, safeLocationId, safeAreaId, fetch]
  );

  return { feedback, loading, addFeedback, refetch: fetch };
}
