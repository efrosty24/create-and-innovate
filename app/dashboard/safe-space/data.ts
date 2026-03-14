export type SafePlaceType = "establishment" | "meeting_area";

export type SafePlaceEntry = {
  id: string;
  name: string;
  type: SafePlaceType;
  lat: number;
  lng: number;
  description: string | null;
};

// Demo data: sample queer-friendly establishments and safe meeting areas.
// Replace with Supabase or an external API for production.
export const DEMO_SAFE_PLACES: SafePlaceEntry[] = [
  {
    id: "1",
    name: "The Center",
    type: "establishment",
    lat: 40.7484,
    lng: -73.9857,
    description: "Community center and safe space.",
  },
  {
    id: "2",
    name: "Café Pride",
    type: "establishment",
    lat: 40.7520,
    lng: -73.9820,
    description: "Queer-owned café.",
  },
  {
    id: "3",
    name: "Bryant Park (NW corner)",
    type: "meeting_area",
    lat: 40.7542,
    lng: -73.9840,
    description: "Open, visible meeting spot.",
  },
  {
    id: "4",
    name: "Bookstore & Café",
    type: "establishment",
    lat: 40.7510,
    lng: -73.9880,
    description: "Inclusive bookstore.",
  },
  {
    id: "5",
    name: "Riverside Plaza",
    type: "meeting_area",
    lat: 40.7460,
    lng: -73.9900,
    description: "Public plaza, well-lit.",
  },
];
