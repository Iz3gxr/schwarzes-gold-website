import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://equosdejalufakpqryvz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_quIqb11nnxhWb8Gxsq7hLQ_MYpUm9Ks";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  tire_size: string | null;
  quantity: string | null;
  message: string | null;
  product: string | null;
  status: string;
};

export const PRODUCT_CATEGORIES = [
  "Reifen & Räder",
  "Motor & Antriebsstrang",
  "Bremsanlage",
  "Beleuchtung & Elektrik",
  "Wartung & Verschleißteile",
  "Karosserie & Rahmen",
  "Sonstiges & Zubehör",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type Product = {
  id: string;
  created_at: string;
  category: ProductCategory | string;
  brand: string;
  product_name: string;
  image_url: string | null;
  status: "Sofort verfügbar" | "Auf Anfrage" | string;
  description: string | null;
  // Webshop-Erweiterung (siehe supabase-shop-upgrade.sql) — optional, damit Bestandsdaten gültig bleiben.
  images?: string[] | null;        // Galerie (zusätzlich zu image_url)
  specs?: Record<string, string> | null; // technische Daten als Schlüssel/Wert
  price?: number | null;           // leer/null => "Preis auf Anfrage"
};
