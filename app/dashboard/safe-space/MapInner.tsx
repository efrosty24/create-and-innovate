"use client";

import { useRef, useEffect } from "react";
import L from "leaflet";
import type { SafePlaceEntry } from "./data";
import type { MapInnerProps } from "./SafeSpaceMap";

// Fix default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const safeIcon = L.divIcon({
  className: "safe-marker",
  html: `<span style="
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #ff6b35;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const userIcon = L.divIcon({
  className: "user-marker",
  html: `<span style="
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #22c55e;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  "></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function MapInner({ userLocation, places }: MapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const center = userLocation ?? { lat: 40.7484, lng: -73.9857 };
    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, []);

  // Update center and user marker when location changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], map.getZoom());
      const m = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip("You", { permanent: false });
      markersRef.current.push(m);
    }
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [userLocation]);

  // Place markers for safe places
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const list: L.Marker[] = [];
    places.forEach((p) => {
      const m = L.marker([p.lat, p.lng], { icon: safeIcon })
        .addTo(map)
        .bindTooltip(`${p.name} (${p.type === "establishment" ? "Establishment" : "Meeting area"})`, {
          permanent: false,
        });
      list.push(m);
    });
    markersRef.current = (markersRef.current ?? []).concat(list);
    return () => list.forEach((m) => m.remove());
  }, [places]);

  return <div ref={containerRef} className="h-full w-full" />;
}
