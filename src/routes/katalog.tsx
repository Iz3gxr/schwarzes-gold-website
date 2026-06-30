import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronRight, ArrowUpRight, Check, Clock, Package, Search, X,
  SlidersHorizontal, ChevronDown,
} from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { TireGraphic } from "@/components/site/TireGraphic";
import { useI18n } from "@/lib/i18n";
import { supabase, PRODUCT_CATEGORIES, type Product } from "@/lib/supabase";
import { PRODUCTS_SEED } from "@/lib/products-seed";

const CAT_KEY: Record<string, string> = {
  "Reifen & Räder": "cat.tyres",
  "Motor & Antriebsstrang": "cat.engine",
  "Bremsanlage": "cat.brakes",
  "Beleuchtung & Elektrik": "cat.lighting",
  "Wartung & Verschleißteile": "cat.maintenance",
  "Karosserie & Rahmen": "cat.body",
  "Sonstiges & Zubehör": "cat.other",
};

function parseTireDim(name: string) {
  const m = name.match(/(\d{3})\/(\d{2})\s+R([\d.]+)/);
  if (!m) return null;
  return { breite: m[1], querschnitt: m[2], felge: `R${m[3]}` };
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export const Route = createFileRoute("/katalog")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
    cat: typeof search.cat === "string" ? search.cat : "",
  }),
  head: () => ({
    meta: [
      { title: "Shop — Reifen, Teile, Zubehör | Schwarzes Gold" },
      { name: "description", content: "Unser Sortiment an Premium-LKW-Reifen, Ersatzteilen und Zubehör. Alle Produkte auf Anfrage verfügbar." },
      { property: "og:title", content: "Shop — Schwarzes Gold" },
      { property: "og:description", content: "Alles für Ihren LKW. Reifen, Teile, Zubehör." },
    ],
  }),
  component: KatalogPage,
});

/* ─── Small shared components ─── */

function FilterSection({
  title, open, onToggle, children,
}: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="border-t border-border/50 pt-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground mb-2 px-1"
      >
        {title}
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-0.5 pl-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group select-none">
      <div
        className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
          checked ? "bg-gold border-gold" : "border-border group-hover:border-gold/60"
        }`}
      >
        {checked && <Check className="w-2.5 h-2.5 text-background" strokeWidth={3} />}
      </div>
      <span className={`text-sm transition-colors leading-tight ${checked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
        {label}
      </span>
    </label>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs">
      {label}
      <button onClick={onRemove} aria-label="Remove filter" className="hover:text-foreground transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/* ─── Sidebar ─── */

interface SidebarProps {
  t: (k: string) => string;
  catLabel: (c: string) => string;
  category: string;
  setCategory: (c: string) => void;
  opts: { brands: string[]; breiten: string[]; felgen: string[]; achsen: string[]; saison: string[] };
  brands: string[]; setBrands: (fn: (v: string[]) => string[]) => void;
  breiten: string[]; setBreiten: (fn: (v: string[]) => string[]) => void;
  felgen: string[]; setFelgen: (fn: (v: string[]) => string[]) => void;
  achsen: string[]; setAchsen: (fn: (v: string[]) => string[]) => void;
  saisonF: string[]; setSaisonF: (fn: (v: string[]) => string[]) => void;
  stockOnly: boolean; setStockOnly: (fn: (v: boolean) => boolean) => void;
  activeFilterCount: number;
  resetAll: () => void;
  onCategoryClick?: () => void;
}

function ShopSidebar({
  t, catLabel, category, setCategory, opts,
  brands, setBrands, breiten, setBreiten, felgen, setFelgen,
  achsen, setAchsen, saisonF, setSaisonF,
  stockOnly, setStockOnly, activeFilterCount, resetAll, onCategoryClick,
}: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    brand: true, breite: true, felge: true, achse: false, saison: false, avail: true,
  });
  const tog = (k: string) => setOpen((s) => ({ ...s, [k]: !s[k] }));
  const isTyres = category === "Reifen & Räder";

  return (
    <div className="space-y-0">
      {/* Category list */}
      <div className="mb-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground px-2 mb-2">
          Kategorien
        </div>
        {(["Alle", ...PRODUCT_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              onCategoryClick?.();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
              category === cat
                ? "bg-gold/12 text-gold font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
            }`}
          >
            <span>{cat === "Alle" ? t("katalog.tabAll") : catLabel(cat)}</span>
            {category === cat && <ChevronRight className="w-3 h-3 shrink-0" />}
          </button>
        ))}
      </div>

      {/* Sub-filters */}
      <div className="space-y-0 pt-1">
        {opts.brands.length > 0 && (
          <FilterSection title="Marke" open={open.brand} onToggle={() => tog("brand")}>
            {opts.brands.map((b) => (
              <CheckItem key={b} label={b} checked={brands.includes(b)}
                onChange={() => setBrands((v) => toggle(v, b))} />
            ))}
          </FilterSection>
        )}

        {isTyres && opts.breiten.length > 0 && (
          <FilterSection title="Breite" open={open.breite} onToggle={() => tog("breite")}>
            {opts.breiten.map((b) => (
              <CheckItem key={b} label={`${b} mm`} checked={breiten.includes(b)}
                onChange={() => setBreiten((v) => toggle(v, b))} />
            ))}
          </FilterSection>
        )}

        {isTyres && opts.felgen.length > 0 && (
          <FilterSection title="Felgengröße" open={open.felge} onToggle={() => tog("felge")}>
            {opts.felgen.map((f) => (
              <CheckItem key={f} label={f} checked={felgen.includes(f)}
                onChange={() => setFelgen((v) => toggle(v, f))} />
            ))}
          </FilterSection>
        )}

        {isTyres && opts.achsen.length > 0 && (
          <FilterSection title="Achsposition" open={open.achse} onToggle={() => tog("achse")}>
            {opts.achsen.map((a) => (
              <CheckItem key={a} label={a} checked={achsen.includes(a)}
                onChange={() => setAchsen((v) => toggle(v, a))} />
            ))}
          </FilterSection>
        )}

        {isTyres && opts.saison.length > 0 && (
          <FilterSection title="Saison" open={open.saison} onToggle={() => tog("saison")}>
            {opts.saison.map((s) => (
              <CheckItem key={s} label={s} checked={saisonF.includes(s)}
                onChange={() => setSaisonF((v) => toggle(v, s))} />
            ))}
          </FilterSection>
        )}

        <FilterSection title="Verfügbarkeit" open={open.avail} onToggle={() => tog("avail")}>
          <CheckItem
            label="Sofort verfügbar"
            checked={stockOnly}
            onChange={() => setStockOnly((v) => !v)}
          />
        </FilterSection>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={resetAll}
          className="w-full mt-3 text-xs text-muted-foreground hover:text-gold flex items-center gap-1.5 px-2 py-1 transition-colors"
        >
          <X className="w-3 h-3" /> Alle Filter zurücksetzen
        </button>
      )}
    </div>
  );
}

/* ─── Page ─── */

function KatalogPage() {
  const { t } = useI18n();
  const catLabel = (c: string) => (CAT_KEY[c] ? t(CAT_KEY[c]) : c);
  const search = Route.useSearch();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(
    search.cat && (PRODUCT_CATEGORIES as readonly string[]).includes(search.cat) ? search.cat : "Alle",
  );
  const [query, setQuery] = useState(search.q ?? "");
  const [brands, setBrands] = useState<string[]>([]);
  const [breiten, setBreiten] = useState<string[]>([]);
  const [felgen, setFelgen] = useState<string[]>([]);
  const [achsen, setAchsen] = useState<string[]>([]);
  const [saisonF, setSaisonF] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products").select("*").order("category", { ascending: true });
      setProducts(!error && data && data.length > 0 ? (data as Product[]) : PRODUCTS_SEED);
      setLoading(false);
    })();
  }, []);

  // Re-apply when navigated here again with new ?q=/?cat= (e.g. from TruckNavigator)
  useEffect(() => {
    if (search.cat && (PRODUCT_CATEGORIES as readonly string[]).includes(search.cat)) {
      setCategory(search.cat);
    }
    if (search.q) setQuery(search.q);
  }, [search.cat, search.q]);

  // Reset sub-filters when category changes
  useEffect(() => {
    setBrands([]); setBreiten([]); setFelgen([]); setAchsen([]); setSaisonF([]);
  }, [category]);

  // Products in selected category (for deriving available filter options)
  const catProducts = useMemo(
    () => (category === "Alle" ? products : products.filter((p) => p.category === category)),
    [products, category],
  );

  // Available filter options derived from catProducts
  const opts = useMemo(() => {
    const brandSet = new Set<string>();
    const breiteSet = new Set<string>();
    const felgeSet = new Set<string>();
    const achseSet = new Set<string>();
    const saisonSet = new Set<string>();
    for (const p of catProducts) {
      brandSet.add(p.brand);
      const dim = parseTireDim(p.product_name);
      if (dim) { breiteSet.add(dim.breite); felgeSet.add(dim.felge); }
      if (p.specs?.Achsposition) achseSet.add(p.specs.Achsposition);
      if (p.specs?.Saison) saisonSet.add(p.specs.Saison);
    }
    return {
      brands: [...brandSet].sort(),
      breiten: [...breiteSet].sort((a, b) => Number(a) - Number(b)),
      felgen: [...felgeSet].sort(),
      achsen: [...achseSet].sort(),
      saison: [...saisonSet].sort(),
    };
  }, [catProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "Alle" && p.category !== category) return false;
      if (stockOnly && p.status !== "Sofort verfügbar") return false;
      if (brands.length > 0 && !brands.includes(p.brand)) return false;
      if (breiten.length > 0 || felgen.length > 0) {
        const dim = parseTireDim(p.product_name);
        if (breiten.length > 0 && (!dim || !breiten.includes(dim.breite))) return false;
        if (felgen.length > 0 && (!dim || !felgen.includes(dim.felge))) return false;
      }
      if (achsen.length > 0 && (!p.specs?.Achsposition || !achsen.includes(p.specs.Achsposition))) return false;
      if (saisonF.length > 0 && (!p.specs?.Saison || !saisonF.includes(p.specs.Saison))) return false;
      if (!q) return true;
      const hay = [p.product_name, p.brand, p.category, catLabel(p.category),
        p.description ?? "", ...Object.values(p.specs ?? {}).map(String)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [products, category, stockOnly, brands, breiten, felgen, achsen, saisonF, query]);

  const activeFilterCount =
    brands.length + breiten.length + felgen.length + achsen.length + saisonF.length +
    (stockOnly ? 1 : 0) + (query.trim() ? 1 : 0) + (category !== "Alle" ? 1 : 0);

  const resetAll = () => {
    setCategory("Alle"); setBrands([]); setBreiten([]); setFelgen([]);
    setAchsen([]); setSaisonF([]); setStockOnly(false); setQuery("");
  };

  const sidebarProps: SidebarProps = {
    t, catLabel, category, setCategory, opts,
    brands, setBrands, breiten, setBreiten, felgen, setFelgen,
    achsen, setAchsen, saisonF, setSaisonF,
    stockOnly, setStockOnly, activeFilterCount, resetAll,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-28 pb-24">
        {/* Page header */}
        <div className="px-6 max-w-7xl mx-auto mb-8">
          <motion.nav
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground mb-5"
          >
            <Link to="/" className="hover:text-gold">{t("nav.home")}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">{t("nav.katalog")}</span>
          </motion.nav>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight mb-2"
          >
            {t("katalog.titlePre")}{" "}
            <span className="gradient-gold-text">{t("katalog.titleHighlight")}</span>
          </motion.h1>
          <p className="text-muted-foreground text-sm">{t("katalog.sub")}</p>
        </div>

        {/* Layout: sidebar + main */}
        <div className="px-6 max-w-7xl mx-auto flex gap-8 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 xl:w-60 shrink-0 sticky top-24">
            <ShopSidebar {...sidebarProps} />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Search bar + mobile filter button */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("shop.search")}
                  className="w-full bg-surface/60 border border-border rounded-lg pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40 transition-colors"
                />
                {query && (
                  <button onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile: open filter drawer */}
              <button
                onClick={() => setDrawerOpen(true)}
                className={`lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors shrink-0 ${
                  activeFilterCount > 0
                    ? "border-gold/60 text-gold bg-gold/10"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
                {activeFilterCount > 0 && (
                  <span className="bg-gold text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shrink-0">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {category !== "Alle" && (
                  <ActiveChip label={catLabel(category)} onRemove={() => setCategory("Alle")} />
                )}
                {brands.map((b) => <ActiveChip key={b} label={b} onRemove={() => setBrands((v) => v.filter((x) => x !== b))} />)}
                {breiten.map((b) => <ActiveChip key={b} label={`${b} mm`} onRemove={() => setBreiten((v) => v.filter((x) => x !== b))} />)}
                {felgen.map((f) => <ActiveChip key={f} label={f} onRemove={() => setFelgen((v) => v.filter((x) => x !== f))} />)}
                {achsen.map((a) => <ActiveChip key={a} label={a} onRemove={() => setAchsen((v) => v.filter((x) => x !== a))} />)}
                {saisonF.map((s) => <ActiveChip key={s} label={s} onRemove={() => setSaisonF((v) => v.filter((x) => x !== s))} />)}
                {stockOnly && <ActiveChip label="Sofort verfügbar" onRemove={() => setStockOnly(() => false)} />}
                {query.trim() && <ActiveChip label={`„${query.trim()}"`} onRemove={() => setQuery("")} />}
              </div>
            )}

            {/* Result count */}
            <div className="flex items-center justify-between mb-5 text-xs text-muted-foreground">
              <span>
                <span className="text-gold font-semibold">{filtered.length}</span>{" "}
                {filtered.length === 1 ? t("shop.result") : t("shop.results")}
                {category !== "Alle" && (
                  <span className="ml-1 text-foreground/50">· {catLabel(category)}</span>
                )}
              </span>
              {activeFilterCount > 0 && (
                <button onClick={resetAll} className="flex items-center gap-1 hover:text-gold transition-colors">
                  <X className="w-3 h-3" /> {t("shop.clear")}
                </button>
              )}
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <Link key={p.id} to="/produkt/$id" params={{ id: p.id }} className="block h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4 }}
                    className="glass-card rounded-md p-4 group cursor-pointer hover:shadow-[0_0_30px_-10px_var(--gold)] transition-shadow h-full flex flex-col"
                  >
                    <div className="aspect-square rounded-sm bg-gradient-to-br from-background to-surface mb-3 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0"
                        style={{ background: "radial-gradient(circle at 50% 35%, oklch(0.78 0.13 85 / 0.10), transparent 62%)" }} />
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.product_name} className="w-full h-full object-cover" />
                      ) : p.category === "Reifen & Räder" ? (
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                          className="relative w-[80%] h-[80%]"
                        >
                          <TireGraphic seed={i} className="w-full h-full" />
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gold/70">
                          <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-background/40 group-hover:border-gold/60 transition-colors">
                            <Package className="w-7 h-7" />
                          </div>
                          <span className="font-display text-sm tracking-[0.1em] text-foreground/80">{p.brand}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-gold">{p.brand}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-gold transition-colors" />
                    </div>
                    <div className="font-display text-base tracking-wide mb-1.5 line-clamp-2 flex-1">{p.product_name}</div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      {catLabel(p.category)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs mb-3">
                      {p.status === "Sofort verfügbar" ? (
                        <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">{t("common.available")}</span></>
                      ) : (
                        <><Clock className="w-3 h-3 text-gold" /><span className="text-gold">{t("common.onRequest")}</span></>
                      )}
                    </div>
                    <span className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.12em] py-1.5 border border-gold/40 text-gold group-hover:bg-gold group-hover:text-background transition-colors rounded-sm mt-auto">
                      {t("katalog.details")} <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {loading && (
              <div className="text-center text-muted-foreground py-16">{t("katalog.loading")}</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center text-muted-foreground py-16">
                <p>{query.trim() ? t("shop.noResults") : t("katalog.empty")}</p>
                {activeFilterCount > 0 && (
                  <button onClick={resetAll} className="mt-4 btn-outline-gold inline-flex items-center gap-2">
                    <X className="w-4 h-4" /> {t("shop.clear")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
                <span className="font-display text-lg">Filter</span>
                <button onClick={() => setDrawerOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <ShopSidebar {...sidebarProps} onCategoryClick={() => setDrawerOpen(false)} />
              </div>
              <div className="p-4 border-t border-border shrink-0">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-3 bg-gold text-background rounded-lg text-sm font-semibold"
                >
                  {filtered.length} Ergebnisse anzeigen
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
