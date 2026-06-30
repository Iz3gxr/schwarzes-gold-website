import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight, Check, Clock, Package, ArrowRight, ArrowUpRight,
  Phone, MessageCircle,
} from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { TireGraphic } from "@/components/site/TireGraphic";
import { supabase, type Product } from "@/lib/supabase";
import { PRODUCTS_SEED } from "@/lib/products-seed";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/produkt/$id")({
  head: () => ({
    meta: [
      { title: "Produkt — Schwarzes Gold" },
      { name: "description", content: "Produktdetails — Reifen, Teile & Zubehör von Schwarzes Gold." },
    ],
  }),
  component: ProductPage,
});

const WHATSAPP_NUMBER = "4915567167624";

function priceLabel(price: number | null | undefined, onRequest: string) {
  if (price == null) return onRequest;
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price);
}

function ProductPage() {
  const { t } = useI18n();
  const { id } = useParams({ from: "/produkt/$id" });
  const [products, setProducts] = useState<Product[]>(PRODUCTS_SEED);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("products").select("*").order("category", { ascending: true });
      if (!error && data && data.length > 0) setProducts(data as Product[]);
      setLoaded(true);
    })();
  }, []);

  // Erst in den (Live-)Produkten suchen, sonst auf den Seed zurückfallen
  // (so funktionieren auch Seed-/Altlinks, falls die DB die ID nicht kennt).
  const product = useMemo(
    () => products.find((p) => p.id === id) ?? PRODUCTS_SEED.find((p) => p.id === id),
    [products, id],
  );
  const related = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : []),
    [products, product],
  );

  // Galerie: Hauptbild + weitere Bilder, dedupliziert
  const gallery = useMemo(() => {
    if (!product) return [];
    return [...new Set([product.image_url, ...(product.images ?? [])].filter(Boolean) as string[])];
  }, [product]);

  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pt-40 pb-32 px-6 max-w-3xl mx-auto text-center">
          {loaded ? (
            <>
              <h1 className="font-display text-4xl md:text-5xl mb-4">{t("produkt.notFoundTitle")}</h1>
              <p className="text-muted-foreground mb-8">
                {t("produkt.notFoundText")}
              </p>
              <Link to="/katalog" className="btn-gold">
                {t("produkt.toCatalog")} <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">{t("produkt.loading")}</p>
          )}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  const isTire = product.category === "Reifen & Räder";
  const anfrageHref = `/?product=${encodeURIComponent(`${product.brand} — ${product.product_name}`)}#contact`;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hallo, ich interessiere mich für: ${product.brand} — ${product.product_name}`,
  )}`;
  const specEntries = Object.entries(product.specs ?? {}).filter(([, v]) => String(v).trim() !== "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground mb-10 flex-wrap"
          >
            <Link to="/" className="hover:text-gold">{t("nav.home")}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/katalog" className="hover:text-gold">{t("nav.katalog")}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold normal-case tracking-normal">{product.product_name}</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Galerie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square rounded-lg bg-gradient-to-br from-background to-surface border border-border relative overflow-hidden flex items-center justify-center">
                <div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(circle at 50% 35%, oklch(0.78 0.13 85 / 0.10), transparent 62%)" }}
                />
                {gallery.length > 0 ? (
                  <img src={gallery[active]} alt={product.product_name} className="w-full h-full object-cover" />
                ) : isTire ? (
                  <TireGraphic className="relative w-[78%] h-[78%] drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]" />
                ) : (
                  <div className="relative flex flex-col items-center gap-4 text-gold/70">
                    <div className="w-28 h-28 rounded-full border border-gold/30 flex items-center justify-center bg-background/40">
                      <Package className="w-12 h-12" />
                    </div>
                    <span className="font-display text-xl tracking-[0.15em] text-foreground/80">{product.brand}</span>
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActive(i)}
                      className={`aspect-square rounded-sm overflow-hidden border transition-colors ${
                        i === active ? "border-gold" : "border-border hover:border-gold/50"
                      }`}
                      aria-label={`Bild ${i + 1}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="label-eyebrow mb-3">{product.brand}</div>
              <h1 className="font-display text-4xl md:text-5xl leading-[1.02] tracking-tight mb-4">
                {product.product_name}
              </h1>

              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground border border-border rounded-sm px-3 py-1">
                  {product.category}
                </span>
                {product.status === "Sofort verfügbar" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> {t("common.available")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gold">
                    <Clock className="w-3.5 h-3.5" /> {t("common.onRequest")}
                  </span>
                )}
              </div>

              <div className="gold-divider mb-6" />

              <div className="mb-8">
                <div className="font-display text-3xl gradient-gold-text">{priceLabel(product.price, t("produkt.priceOnRequest"))}</div>
                {product.price != null && (
                  <div className="text-xs text-muted-foreground mt-1">{t("produkt.vatNote")}</div>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
              )}

              {specEntries.length > 0 && (
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-[0.18em] text-gold mb-3">{t("produkt.techData")}</div>
                  <dl className="divide-y divide-border/60 border-y border-border/60">
                    {specEntries.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-6 py-2.5 text-sm">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-foreground text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Aktionen — kein Kauf, sondern Anfrage */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={anfrageHref} className="btn-gold flex-1 justify-center min-h-[52px]">
                  {t("contact.submit")} <ArrowRight className="w-4 h-4" />
                </a>
                <a href={waHref} target="_blank" rel="noreferrer" className="btn-outline-gold flex-1 justify-center min-h-[52px]">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
              <a
                href="tel:+4915567167624"
                className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4" /> +49 15567 167624
              </a>
            </motion.div>
          </div>

          {/* Ähnliche Produkte */}
          {related.length > 0 && (
            <div className="mt-24">
              <div className="flex items-end justify-between mb-8">
                <h2 className="font-display text-3xl md:text-4xl">
                  {t("produkt.relatedPre")} <span className="gradient-gold-text">{t("produkt.relatedHighlight")}</span>
                </h2>
                <Link to="/katalog" className="text-xs uppercase tracking-[0.15em] text-gold hover:underline">
                  {t("produkt.viewAll")}
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((p, i) => {
                  const thumb = p.image_url || p.images?.[0] || null;
                  return (
                    <Link key={p.id} to="/produkt/$id" params={{ id: p.id }} className="block">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        whileHover={{ y: -6 }}
                        className="glass-card rounded-md p-4 group h-full"
                      >
                        <div className="aspect-square rounded-sm bg-gradient-to-br from-background to-surface mb-3 flex items-center justify-center relative overflow-hidden">
                          {thumb ? (
                            <img src={thumb} alt={p.product_name} className="w-full h-full object-cover" />
                          ) : p.category === "Reifen & Räder" ? (
                            <TireGraphic seed={i} className="w-[80%] h-[80%]" />
                          ) : (
                            <Package className="w-10 h-10 text-gold/60" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase tracking-[0.18em] text-gold">{p.brand}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-gold transition-colors" />
                        </div>
                        <div className="font-display text-base tracking-wide line-clamp-2">{p.product_name}</div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
