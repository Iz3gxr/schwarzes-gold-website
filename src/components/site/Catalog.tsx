import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Check, ArrowUpRight, ArrowRight } from "lucide-react";
import { TireGraphic } from "@/components/site/TireGraphic";
import { useI18n } from "@/lib/i18n";

type Cat = "LKW" | "PKW" | "Baumaschinen" | "Spezial";
const cats: Cat[] = ["LKW", "PKW", "Baumaschinen", "Spezial"];

const products: { brand: string; size: string; cat: Cat; available: boolean }[] = [
  { brand: "Continental", size: "315/80 R22.5", cat: "LKW", available: true },
  { brand: "Michelin", size: "385/65 R22.5", cat: "LKW", available: true },
  { brand: "Bridgestone", size: "295/80 R22.5", cat: "LKW", available: true },
  { brand: "Goodyear", size: "315/70 R22.5", cat: "LKW", available: true },
  { brand: "Pirelli", size: "315/80 R22.5", cat: "LKW", available: true },
  { brand: "Michelin", size: "295/80 R22.5", cat: "LKW", available: true },
  { brand: "Continental", size: "385/65 R22.5", cat: "LKW", available: true },
  { brand: "Bridgestone", size: "315/70 R22.5", cat: "LKW", available: false },
];

export function Catalog() {
  const { t } = useI18n();
  const [cat, setCat] = useState<Cat>("LKW");
  const filtered = products.filter((p) => p.cat === cat);

  return (
    <section id="catalog" className="relative py-14 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8 mb-6 md:mb-12"
        >
          <div>
            <div className="label-eyebrow mb-2 md:mb-4 text-[10px] md:text-xs">— {t("catalog.eyebrow")}</div>
            <h2 className="font-display text-3xl md:text-6xl leading-[1.05]">
              {t("catalog.titlePre")} <span className="gradient-gold-text">{t("catalog.titleHighlight")}</span>
            </h2>
          </div>
          <div className="-mx-4 md:mx-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-1.5 md:gap-2 px-4 md:px-0 md:flex-wrap min-w-max md:min-w-0">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 px-3.5 md:px-5 py-1.5 md:py-2 min-h-[36px] md:min-h-[44px] text-[10px] md:text-xs uppercase tracking-[0.12em] md:tracking-[0.15em] rounded-sm border transition-all ${
                    cat === c
                      ? "bg-gold text-background border-gold"
                      : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {t(`cat.${c}`)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={`${p.brand}-${p.size}-${i}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-md p-3 md:p-6 group cursor-pointer"
              >
                <div className="aspect-square rounded-sm bg-gradient-to-br from-background to-surface mb-2.5 md:mb-4 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(circle at 50% 35%, oklch(0.78 0.13 85 / 0.12), transparent 62%)" }}
                  />
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-[82%] h-[82%]"
                  >
                    <TireGraphic seed={i} className="w-full h-full" />
                  </motion.div>
                </div>
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.15em] text-gold">{p.brand}</span>
                  <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
                <div className="font-display text-sm md:text-xl tracking-wide mb-1.5 md:mb-3 leading-tight">{p.size}</div>
                <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                  {p.available ? (
                    <>
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
                      <span className="text-emerald-400">{t("common.available")}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">{t("common.onRequest")}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-7 md:mt-12 text-center"
        >
          <Link to="/katalog" className="btn-gold !py-2.5 !px-5 !text-xs md:!py-3 md:!px-6 md:!text-sm">
            {t("catalog.cta")} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
