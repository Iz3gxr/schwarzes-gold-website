import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { HighwayScene } from "@/components/site/HighwayScene";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function Hero() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const titleWords = [
    ...t("hero.titlePre").split(" ").map((w) => ({ w, hl: false })),
    { w: t("hero.titleHighlight"), hl: true },
  ];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  return (
    <section ref={ref} id="home" className={`${theme === "dark" ? "dark" : ""} relative min-h-[100svh] flex items-center overflow-hidden bg-background`}>
      {/* Animated night-highway background (looping) */}
      <motion.div style={{ y, scale: imgScale, opacity: imgOpacity }} className="absolute inset-0">
        <HighwayScene />
      </motion.div>
      <div className="absolute inset-0 gold-grid-bg opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="grain-overlay" />

      {/* Floating gold particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold/50 shadow-[0_0_8px_var(--gold)]"
          style={{
            left: `${(i * 8.3 + 5) % 100}%`,
            top: `${(i * 17 + 10) % 90}%`,
          }}
          animate={{ y: [0, -60, 0], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}

      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -40]) }} className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 pt-24 md:pt-20 pb-24 md:pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="label-eyebrow mb-5 flex items-center gap-3"
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px bg-gold"
          />
          {t("hero.eyebrow")}
        </motion.div>

        <h1 className="font-display leading-[0.95] tracking-tight max-w-4xl text-[36px] sm:text-[42px] md:text-[72px] break-words hyphens-none">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`inline-block mr-[0.25em] ${word.hl ? "gradient-gold-text" : ""}`}
            >
              {word.w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          {t("hero.subPre")} <span className="text-gold font-semibold">{t("hero.subDays")}</span>{t("hero.subPost")}{" "}
          <br className="hidden md:block" />
          {t("hero.subLine2")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <a href="#contact" className="btn-gold w-full sm:w-auto justify-center min-h-[52px]">
            {t("hero.cta1")} <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#catalog" className="btn-outline-gold w-full sm:w-auto justify-center min-h-[52px]">
            {t("hero.cta2")}
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#brands"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold"
        aria-label="Scroll"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.a>
    </section>
  );
}
