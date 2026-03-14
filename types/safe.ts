export type SafeLocation = {
  id: string;
  establishment_name: string;
  location: string | null;
  lat: number;
  lng: number;
  created_at: string;
};

export type SafeAreaType = "city" | "town" | "street" | "neighborhood" | "region" | "other";

export type SafeArea = {
  id: string;
  name: string;
  area_type: SafeAreaType;
  region: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export type LocationFeedback = {
  id: string;
  user_id: string;
  safe_location_id: string | null;
  safe_area_id: string | null;
  content: string;
  created_at: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

export function feedbackAuthorName(f: LocationFeedback): string {
  if (f.username) return f.username;
  const first = f.first_name ?? "";
  const last = f.last_name ?? "";
  const name = [first, last].filter(Boolean).join(" ");
  return name || "Community member";
}
