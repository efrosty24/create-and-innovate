export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export type UserProduct = {
  id: string;
  user_id: string;
  short_id: string;
  product_name: string | null;
  registered_at: string;
};

export type SafePlace = {
  id: string;
  name: string;
  type: "establishment" | "meeting_area";
  lat: number;
  lng: number;
  description: string | null;
};
