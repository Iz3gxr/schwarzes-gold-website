import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const stats: { n?: number; s?: string; textKey?: string; labelKey: string }[] = [
  { textKey: "stats.s1.value", labelKey: "stats.s1.label" },
  { n: 13, s: "+", labelKey: "stats.s2.label" },
  { textKey: "stats.s3.value", labelKey: "stats.s3.label" },
  { textKey: "stats.s4.value", labelKey: "stats.s4.label" },
];

export function Stats() {
  const { t } = useI18n();
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-dark-gold)" }} />
      <div className="absolute inset-0 gold-grid-bg opacity-30" />
      <div className="grain-overlay" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="label-eyebrow mb-4">— {t("stats.eyebrow")}</div>
          <h2 className="font-display text-5xl md:text-6xl">
            {t("stats.titlePre")} <span className="gradient-gold-text">{t("stats.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="font-display text-5xl md:text-7xl gradient-gold-text mb-2 tabular-nums">
                {typeof s.n === "number" ? <Counter to={s.n} suffix={s.s} /> : t(s.textKey!)}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t(s.labelKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
