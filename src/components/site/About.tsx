import { motion } from "framer-motion";
import { Zap, PhoneCall, Truck } from "lucide-react";
import aboutImg from "@/assets/hero-tire.jpg";
import { useI18n } from "@/lib/i18n";

const pillars = [
  { icon: Zap, key: "pillar1" },
  { icon: PhoneCall, key: "pillar2" },
  { icon: Truck, key: "pillar3" },
];

export function About() {
  const { t } = useI18n();
  return (
    <section id="about" className="relative py-32 px-6 bg-surface/20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="label-eyebrow mb-4">— {t("about.eyebrow")}</div>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-8">
            {t("about.titlePre")} <span className="gradient-gold-text">{t("about.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("about.body")}
          </p>

          <div className="mt-10 relative pl-8 border-l-2 border-gold/60">
            <p className="font-display text-2xl md:text-3xl leading-snug text-foreground">
              {t("about.quotePre")}{" "}
              <span className="gradient-gold-text">{t("about.quoteHighlight")}</span>
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {pillars.map((p) => (
              <div key={p.key}>
                <p.icon className="w-6 h-6 text-gold mb-3" />
                <div className="font-display text-lg tracking-wide">{t(`about.${p.key}.title`)}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{t(`about.${p.key}.text`)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative rounded-lg overflow-hidden border border-gold/20">
            <img src={aboutImg} alt={t("about.imgAlt")} className="w-full h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="grain-overlay" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 glass-card rounded-lg px-6 py-5 hidden sm:block">
            <div className="font-display text-4xl gradient-gold-text leading-none">{t("about.badgeValue")}</div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">
              {t("about.badgeLabel")}
            </div>
          </div>
          {/* Gold accent corner */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-gold/50 rounded-tr-lg pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
