import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Disc3, Filter, Cog, CircleDot, ArrowRight } from "lucide-react";
import { TireGraphic } from "@/components/site/TireGraphic";
import { useI18n } from "@/lib/i18n";

type Kind = "tire" | "rim" | "brake" | "filter" | "part";

interface Item {
  id: string;
  name: string;   // universal (dimensions / model code)
  kind: Kind;
  catKey: string; // i18n category label
}

// Three shelves of stock — names are universal (dimensions/codes), so no translation needed.
const SHELVES: Item[][] = [
  [
    { id: "t1", name: "315/80 R22.5", kind: "tire", catKey: "shelf.cat.tire" },
    { id: "t2", name: "385/65 R22.5", kind: "tire", catKey: "shelf.cat.tire" },
    { id: "t3", name: "295/80 R22.5", kind: "tire", catKey: "shelf.cat.tire" },
    { id: "t4", name: "13 R22.5", kind: "tire", catKey: "shelf.cat.tire" },
  ],
  [
    { id: "r1", name: "Stahlfelge 22.5×9.0", kind: "rim", catKey: "shelf.cat.rim" },
    { id: "b1", name: "Bremsscheibe Ø430", kind: "brake", catKey: "shelf.cat.brake" },
    { id: "f1", name: "Luftfilter C30", kind: "filter", catKey: "shelf.cat.filter" },
    { id: "p1", name: "Radlager-Satz", kind: "part", catKey: "shelf.cat.part" },
  ],
  [
    { id: "b2", name: "Bremsbeläge WVA", kind: "brake", catKey: "shelf.cat.brake" },
    { id: "f2", name: "Ölfilter LF", kind: "filter", catKey: "shelf.cat.filter" },
    { id: "p2", name: "Stoßdämpfer", kind: "part", catKey: "shelf.cat.part" },
    { id: "r2", name: "Alufelge 22.5×11.75", kind: "rim", catKey: "shelf.cat.rim" },
  ],
];

function ItemIcon({ kind, seed }: { kind: Kind; seed: number }) {
  if (kind === "tire") return <TireGraphic seed={seed} className="w-full h-full" />;
  const common = "w-2/3 h-2/3 text-gold/85";
  const wrap = "w-full h-full flex items-center justify-center";
  if (kind === "rim") return <div className={wrap}><CircleDot className={common} strokeWidth={1.4} /></div>;
  if (kind === "brake") return <div className={wrap}><Disc3 className={common} strokeWidth={1.4} /></div>;
  if (kind === "filter") return <div className={wrap}><Filter className={common} strokeWidth={1.4} /></div>;
  return <div className={wrap}><Cog className={common} strokeWidth={1.4} /></div>;
}

export function WorkshopShelf() {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative py-24 md:py-32 px-5 md:px-6 bg-surface/30 overflow-hidden">
      <div className="absolute inset-0 gold-grid-bg opacity-[0.04]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="label-eyebrow mb-3 justify-center flex">— {t("shelf.eyebrow")}</div>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-4">{t("shelf.title")}</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">{t("shelf.text")}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-gold/70">
            <span className="md:hidden">{t("shelf.hint")}</span>
            <span className="hidden md:inline">{t("shelf.hintDesktop")}</span>
          </p>
        </motion.div>

        {/* Rack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative rounded-xl p-3 sm:p-5 md:p-7"
          style={{
            background: "linear-gradient(160deg,#161616,#0c0c0c)",
            boxShadow: "inset 0 0 0 1px rgba(202,162,58,0.18), 0 30px 60px -20px rgba(0,0,0,0.7)",
          }}
        >
          {/* Side posts */}
          <div className="pointer-events-none absolute inset-y-3 left-0 w-2 sm:w-3 rounded-l-xl bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a]" />
          <div className="pointer-events-none absolute inset-y-3 right-0 w-2 sm:w-3 rounded-r-xl bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a]" />

          <div className="space-y-3 sm:space-y-5 px-1 sm:px-3">
            {SHELVES.map((row, ri) => (
              <div key={ri}>
                {/* Items sitting on the plank */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 items-end">
                  {row.map((item, ci) => {
                    const isActive = active === item.id;
                    return (
                      <div key={item.id} className="relative flex justify-center">
                        {/* Tooltip */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              transition={{ duration: 0.18 }}
                              className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-30 w-[150px] sm:w-44 pointer-events-none"
                            >
                              <div className="glass-card rounded-lg px-3 py-2.5 text-center shadow-xl">
                                <div className="text-[10px] uppercase tracking-[0.15em] text-gold mb-0.5">
                                  {t(item.catKey)}
                                </div>
                                <div className="font-display text-sm leading-tight text-foreground">{item.name}</div>
                                <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  {t("shelf.status")}
                                </div>
                              </div>
                              <div className="w-2.5 h-2.5 rotate-45 glass-card mx-auto -mt-1.5 border-t-0 border-l-0" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Item button */}
                        <button
                          type="button"
                          onMouseEnter={() => setActive(item.id)}
                          onMouseLeave={() => setActive((cur) => (cur === item.id ? null : cur))}
                          onFocus={() => setActive(item.id)}
                          onBlur={() => setActive((cur) => (cur === item.id ? null : cur))}
                          onClick={() => setActive((cur) => (cur === item.id ? null : item.id))}
                          aria-label={`${t(item.catKey)} — ${item.name}`}
                          className={`group relative w-full aspect-square max-w-[110px] rounded-lg flex items-center justify-center p-1.5 sm:p-2.5 transition-all duration-300 outline-none ${
                            isActive
                              ? "scale-[1.07] -translate-y-1"
                              : "hover:scale-[1.05] hover:-translate-y-0.5"
                          }`}
                          style={{
                            background: "radial-gradient(circle at 50% 35%, rgba(202,162,58,0.10), transparent 65%)",
                          }}
                        >
                          <div className={`w-full h-full transition-[filter] duration-300 ${isActive ? "drop-shadow-[0_8px_20px_rgba(202,162,58,0.35)]" : ""}`}>
                            <ItemIcon kind={item.kind} seed={ri * 4 + ci} />
                          </div>
                          {/* focus/active ring */}
                          <span
                            className={`absolute inset-0 rounded-lg ring-1 transition-opacity ${
                              isActive ? "ring-gold/50 opacity-100" : "ring-transparent opacity-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Plank */}
                <div className="mt-1.5 sm:mt-2 h-2 sm:h-2.5 rounded-sm relative"
                  style={{ background: "linear-gradient(180deg,#2c2c2c,#141414)", boxShadow: "0 6px 14px -6px rgba(0,0,0,0.8)" }}
                >
                  <span className="absolute top-1/2 left-2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold/40" />
                  <span className="absolute top-1/2 right-2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold/40" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link to="/katalog" className="btn-outline-gold">
            {t("shelf.cta")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
