const brands = [
  "Michelin", "Continental", "Bridgestone", "Goodyear", "Pirelli",
  "Hankook", "Falken", "Yokohama", "Sava", "Dunlop",
  "Advance", "Giti", "Anteo",
];

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function Row({ reverse = false, duration = 60 }: { reverse?: boolean; duration?: number }) {
  const items = [...brands, ...brands];
  return (
    <div className="ticker-wrap relative overflow-hidden">
      <div
        className="ticker-track flex gap-6 md:gap-12 whitespace-nowrap py-4 md:py-6 w-max"
        style={{
          animation: `ticker-scroll ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {items.map((name, i) => (
          <div key={`${name}-${i}`} className="flex items-center gap-6 md:gap-12 shrink-0">
            <span className="font-display text-xl md:text-4xl tracking-[0.18em] md:tracking-[0.2em] text-gold/80 hover:text-gold transition-colors">
              {name.toUpperCase()}
            </span>
            <span className="text-gold/50 text-base md:text-xl" aria-hidden>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Brands() {
  const { t } = useI18n();
  return (
    <section id="brands" className="relative py-24 bg-surface/30">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12 px-6"
      >
        <div className="label-eyebrow mb-4">— {t("brands.eyebrow")}</div>
        <h2 className="font-display text-4xl md:text-5xl leading-[0.95]">
          {t("brands.titlePre")} <span className="gradient-gold-text">{t("brands.titleHighlight")}</span>
        </h2>
      </motion.div>

      <div className="space-y-2 relative">
        <Row duration={60} />
        <div className="hidden md:block">
          <Row reverse duration={70} />
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      </div>

      <p className="text-center text-sm text-muted-foreground mt-10 px-6">
        {t("brands.note")}
      </p>
    </section>
  );
}
