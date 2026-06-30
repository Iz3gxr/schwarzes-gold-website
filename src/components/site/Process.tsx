import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const steps = [
  { n: "01", key: "s1" },
  { n: "02", key: "s2" },
  { n: "03", key: "s3" },
];

export function Process() {
  const { t } = useI18n();
  return (
    <section className="relative py-32 px-6 bg-surface/30">
      <div className="gold-divider absolute top-0" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="label-eyebrow mb-4">— {t("process.eyebrow")}</div>
          <h2 className="font-display text-5xl md:text-6xl">
            {t("process.titlePre")} <span className="gradient-gold-text">{t("process.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* SVG connecting line drawn with pathLength */}
          <svg
            className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[2px] w-[68%] overflow-visible pointer-events-none"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0" y1="0.5" x2="100" y2="0.5"
              stroke="var(--gold)"
              strokeWidth="0.4"
              strokeOpacity="0.6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </svg>

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.2, type: "spring", stiffness: 180 }}
                className="w-16 h-16 mx-auto mb-6 rounded-md bg-background border border-gold/40 flex items-center justify-center font-display text-2xl text-gold relative z-10 shadow-[var(--shadow-gold)]"
              >
                {s.n}
              </motion.div>
              <h3 className="font-display text-2xl mb-3 tracking-wide">{t(`process.${s.key}.title`)}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">{t(`process.${s.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
