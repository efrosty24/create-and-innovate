"use client";

import { useEffect, useState, useRef } from "react";
import type { SafePlaceEntry } from "./data";

type UserLocation = { lat: number; lng: number } | null;

type Props = {
  places: SafePlaceEntry[];
  onLocationError?: (message: string) => void;
};

export default function SafeSpaceMap({ places, onLocationError }: Props) {
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapInnerProps> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!cancelled) setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        if (!cancelled) {
          const msg = err.message || "Could not get your location.";
          setLocationError(msg);
          onLocationError?.(msg);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
    return () => { cancelled = true; };
  }, [onLocationError]);

  useEffect(() => {
    import("./MapInner").then((m) => setMapComponent(() => m.default));
  }, []);

  if (!MapComponent) {
    return (
      <div className="h-[60vh] min-h-[280px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500">
        Loading map…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locationError && (
        <p className="text-sm text-amber-400">
          Location: {locationError} Showing default view; enable location for your position.
        </p>
      )}
      <div className="h-[60vh] min-h-[280px] rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
        <MapComponent
          userLocation={userLocation}
          places={places}
        />
      </div>
    </div>
  );
}

export type MapInnerProps = {
  userLocation: UserLocation;
  places: SafePlaceEntry[];
};
