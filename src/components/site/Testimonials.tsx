import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Marken-Versprechen statt Kundenstimmen: als junges Unternehmen kommunizieren
// wir unseren Anspruch ehrlich — keine erfundenen Referenzen.
const items = ["t1", "t2", "t3", "t4", "t5"];

export function Testimonials() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-32 px-6 bg-surface/40 overflow-hidden">
      <div className="absolute inset-0 gold-grid-bg opacity-20" />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="label-eyebrow mb-4">— {t("testimonials.eyebrow")}</div>
          <Quote className="w-12 h-12 text-gold/40 mx-auto mb-6" />
        </motion.div>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-2xl md:text-4xl leading-snug tracking-wide mb-8">
                {t(`testimonials.${items[i]}.quote`)}
              </p>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold border border-gold/30 rounded-full px-4 py-1.5">
                {t(`testimonials.${items[i]}.tag`)}
              </div>
              <div className="text-sm text-muted-foreground mt-4">{t("testimonials.source")}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1 transition-all ${idx === i ? "bg-gold w-10" : "bg-border w-4 hover:bg-gold/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
