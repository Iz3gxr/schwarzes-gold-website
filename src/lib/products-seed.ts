import type { Product } from "./supabase";
import tireImg from "@/assets/hero-tire.jpg";

// Fallback seed used until the `products` table exists / is populated.
// Ein paar Einträge sind als Demo mit Bild/Beschreibung/Specs angereichert, damit
// die Webshop-Detailseite auch ohne gepflegte Supabase-Daten realistisch aussieht.
export const PRODUCTS_SEED: Product[] = [
  // Reifen & Räder
  {
    id: "s1", created_at: "", category: "Reifen & Räder", brand: "Continental",
    product_name: "Conti Hybrid HS3 315/80 R22.5", status: "Sofort verfügbar",
    image_url: tireImg, images: [tireImg], price: null,
    description:
      "Premium-Lenkachsreifen für den Fern- und Regionalverkehr. Niedriger Rollwiderstand für weniger Verbrauch, robuste Karkasse für hohe Laufleistung und mehrfache Runderneuerung. Ganzjährig einsetzbar (M+S, 3PMSF).",
    specs: {
      Dimension: "315/80 R22.5",
      Tragfähigkeitsindex: "156/150 L",
      Achsposition: "Lenkachse",
      Saison: "Ganzjahr (3PMSF / M+S)",
      Profiltiefe: "ca. 15 mm",
      Runderneuerbar: "Ja",
    },
  },
  {
    id: "s2", created_at: "", category: "Reifen & Räder", brand: "Michelin",
    product_name: "Michelin X Line Energy 385/65 R22.5", status: "Sofort verfügbar",
    image_url: tireImg, images: [tireImg], price: null,
    description:
      "Kraftstoffsparender Trailer-/Antriebsachsreifen mit ausgezeichneter Laufleistung. Optimiert für Langstrecke und schwere Lasten bei minimalem Rollwiderstand.",
    specs: {
      Dimension: "385/65 R22.5",
      Tragfähigkeitsindex: "164 K",
      Achsposition: "Trailer / Antrieb",
      Saison: "Sommer",
      Runderneuerbar: "Ja",
    },
  },
  { id: "s3", created_at: "", category: "Reifen & Räder", brand: "Bridgestone", product_name: "295/80 R22.5", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s4", created_at: "", category: "Reifen & Räder", brand: "Goodyear", product_name: "315/70 R22.5", status: "Auf Anfrage", image_url: null, description: null },
  { id: "s5", created_at: "", category: "Reifen & Räder", brand: "Pirelli", product_name: "315/80 R22.5", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s6", created_at: "", category: "Reifen & Räder", brand: "Hankook", product_name: "295/75 R22.5", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s7", created_at: "", category: "Reifen & Räder", brand: "Falken", product_name: "315/80 R22.5", status: "Auf Anfrage", image_url: null, description: null },
  { id: "s8", created_at: "", category: "Reifen & Räder", brand: "Yokohama", product_name: "385/65 R22.5", status: "Sofort verfügbar", image_url: null, description: null },
  // Motor & Antriebsstrang
  {
    id: "s9", created_at: "", category: "Motor & Antriebsstrang", brand: "Mann-Filter",
    product_name: "Luftfilter Euro 6", status: "Sofort verfügbar", image_url: null, price: null,
    description:
      "Hochwertiger Luftfilter für Euro-6-Nutzfahrzeugmotoren. Schützt den Motor zuverlässig vor Staub und Partikeln und sorgt für optimale Verbrennung. Passgenau für gängige LKW-Modelle.",
    specs: {
      Typ: "Luftfilter",
      Norm: "Euro 6",
      Material: "Mehrlagiges Filtervlies",
      Einsatz: "Hauptfilter Motorluft",
    },
  },
  { id: "s10", created_at: "", category: "Motor & Antriebsstrang", brand: "Mahle", product_name: "Ölfilter Standardtyp", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s11", created_at: "", category: "Motor & Antriebsstrang", brand: "ATE", product_name: "Bremsflüssigkeit DOT 4", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s12", created_at: "", category: "Motor & Antriebsstrang", brand: "Liqui Moly", product_name: "Diesel-Additiv 5L", status: "Auf Anfrage", image_url: null, description: null },
  // Bremsanlage
  { id: "s13", created_at: "", category: "Bremsanlage", brand: "Knorr-Bremse", product_name: "Bremsbeläge Achse 1", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s14", created_at: "", category: "Bremsanlage", brand: "Knorr-Bremse", product_name: "Bremsbeläge Achse 2/3", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s15", created_at: "", category: "Bremsanlage", brand: "Wabco", product_name: "Bremsscheiben (Paar)", status: "Auf Anfrage", image_url: null, description: null },
  { id: "s16", created_at: "", category: "Bremsanlage", brand: "BPW", product_name: "Bremstrommeln", status: "Auf Anfrage", image_url: null, description: null },
  // Beleuchtung & Elektrik
  { id: "s17", created_at: "", category: "Beleuchtung & Elektrik", brand: "Hella", product_name: "LED Blinker 24V", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s18", created_at: "", category: "Beleuchtung & Elektrik", brand: "Osram", product_name: "Arbeitsleuchte 24V", status: "Sofort verfügbar", image_url: null, description: null },
  { id: "s19", created_at: "", category: "Beleuchtung & Elektrik", brand: "Hella", product_name: "Batteriekabel", status: "Auf Anfrage", image_url: null, description: null },
  // Wartung & Verschleißteile
  { id: "s20", created_at: "", category: "Wartung & Verschleißteile", brand: "Bosch", product_name: "Wartungsset", status: "Auf Anfrage", image_url: null, description: null },
  { id: "s21", created_at: "", category: "Wartung & Verschleißteile", brand: "Diverse", product_name: "Ersatzteilkits", status: "Auf Anfrage", image_url: null, description: null },
];
