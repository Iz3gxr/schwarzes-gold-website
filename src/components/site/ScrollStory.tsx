import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

/* ── helpers ── */
function useChapterOpacity(
  progress: ReturnType<typeof useScroll>["scrollYProgress"],
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  return useTransform(progress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]);
}

/* ── SVG: speed lines (chapter 1) ── */
function SpeedLines() {
  const lines = Array.from({ length: 40 }).map((_, i) => {
    const y = 2 + i * 2.45;
    const len = 14 + (i % 6) * 11;
    const x = (i * 37) % 80;
    return { x, y, len, dur: 0.5 + (i % 5) * 0.14, delay: (i % 9) * 0.13 };
  });
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none">
      <style>{`
        @keyframes ss-rush { from { transform: translateX(-30px); opacity:0 } 15%{opacity:1} 85%{opacity:1} to { transform: translateX(130px); opacity:0 } }
      `}</style>
      {lines.map((l, i) => (
        <line key={i}
          x1={l.x} y1={l.y} x2={l.x + l.len} y2={l.y}
          stroke="oklch(0.82 0.13 85)" strokeWidth={0.5 + (i % 3) * 0.35}
          strokeLinecap="round"
          style={{ animation: `ss-rush ${l.dur}s linear ${l.delay}s infinite` }}
        />
      ))}
    </svg>
  );
}

/* ── SVG: tire (chapter 2) ── */
function TireArt({ progress }: { progress: ReturnType<typeof useTransform> }) {
  const rotate = useTransform(progress, [0.33, 0.66], [0, 360]);
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_40px_oklch(0.78_0.13_85/0.4)]"
      style={{ rotate }}
    >
      {/* Outer rubber */}
      <circle cx="100" cy="100" r="95" fill="#0a0a0a" />
      {/* Tread pattern */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * 2 * Math.PI;
        const x1 = 100 + Math.cos(a) * 80;
        const y1 = 100 + Math.sin(a) * 80;
        const x2 = 100 + Math.cos(a) * 94;
        const y2 = 100 + Math.sin(a) * 94;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="6" />;
      })}
      {/* Rim */}
      <circle cx="100" cy="100" r="65" fill="#1a1a1a" />
      <circle cx="100" cy="100" r="62" fill="#1a1a1a" stroke="oklch(0.78 0.13 85 / 0.5)" strokeWidth="1.5" />
      {/* Spokes */}
      {[0, 1, 2, 3, 4, 5].map(k => {
        const a = (k / 6) * 2 * Math.PI - Math.PI / 6;
        return (
          <line key={k}
            x1={100 + Math.cos(a) * 14} y1={100 + Math.sin(a) * 14}
            x2={100 + Math.cos(a) * 56} y2={100 + Math.sin(a) * 56}
            stroke="oklch(0.78 0.13 85)" strokeWidth="5" strokeLinecap="round"
          />
        );
      })}
      {/* Hub */}
      <circle cx="100" cy="100" r="14" fill="oklch(0.72 0.14 85)" />
      <circle cx="100" cy="100" r="6"  fill="#0a0a0a" />
    </motion.svg>
  );
}

/* ── SVG: EU map dots (chapter 3) ── */
function EuDots() {
  // simplified city dots across Europe
  const dots = [
    { x: 48, y: 38, label: "Hamburg" },
    { x: 52, y: 44, label: "Berlin" },
    { x: 46, y: 48, label: "Bietigheim" },
    { x: 50, y: 52, label: "München" },
    { x: 42, y: 42, label: "Amsterdam" },
    { x: 44, y: 50, label: "Paris" },
    { x: 56, y: 46, label: "Wien" },
    { x: 58, y: 52, label: "Budapest" },
    { x: 54, y: 56, label: "Zagreb" },
    { x: 50, y: 60, label: "Rom" },
    { x: 40, y: 54, label: "Lyon" },
    { x: 62, y: 42, label: "Warschau" },
    { x: 38, y: 50, label: "Bilbao" },
    { x: 60, y: 58, label: "Bukarest" },
  ];
  return (
    <svg viewBox="0 0 100 80" className="w-full max-w-lg opacity-80">
      <style>{`
        @keyframes dot-pulse { 0%,100%{r:1.2;opacity:.5} 50%{r:2.2;opacity:1} }
        @keyframes dot-ring  { 0%{r:1;opacity:.8} 100%{r:5;opacity:0} }
      `}</style>
      {/* Connection lines */}
      {dots.slice(1).map((d, i) => (
        <line key={i}
          x1={dots[0].x} y1={dots[0].y} x2={d.x} y2={d.y}
          stroke="oklch(0.78 0.13 85 / 0.20)" strokeWidth="0.4"
          strokeDasharray="1 2"
        />
      ))}
      {/* Dots */}
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="1.5" fill="oklch(0.80 0.13 85)"
            style={{ animation: `dot-pulse ${2 + (i % 4) * 0.5}s ease-in-out ${i * 0.2}s infinite` }}
          />
          <circle cx={d.x} cy={d.y} r="1" fill="none" stroke="oklch(0.78 0.13 85 / 0.5)" strokeWidth="0.5"
            style={{ animation: `dot-ring ${2 + (i % 3) * 0.4}s ease-out ${i * 0.3}s infinite` }}
          />
        </g>
      ))}
      {/* Highlight: Bietigheim (index 2) */}
      <circle cx={dots[2].x} cy={dots[2].y} r="3" fill="oklch(0.78 0.13 85 / 0.25)" />
      <circle cx={dots[2].x} cy={dots[2].y} r="2" fill="oklch(0.80 0.13 85)" />
    </svg>
  );
}

/* ── main component ── */
export function ScrollStory() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Crossfades overlap so there is never a black gap between chapters.
  // chapter 1: visible from start, fades out 0.28→0.40 (as ch2 fades in)
  const op1 = useChapterOpacity(scrollYProgress, 0, 0.02, 0.28, 0.40);
  const y1  = useTransform(scrollYProgress, [0.28, 0.40], [0, -50]);

  // chapter 2: fades in 0.28→0.40, fades out 0.60→0.72
  const op2 = useChapterOpacity(scrollYProgress, 0.28, 0.40, 0.60, 0.72);
  const y2  = useTransform(scrollYProgress, [0.60, 0.72], [0, -50]);
  const scaleIn2 = useTransform(scrollYProgress, [0.28, 0.42], [0.75, 1]);

  // chapter 3: fades in 0.60→0.72, then STAYS visible to the end (no fade-out → no black tail)
  const op3 = useTransform(scrollYProgress, [0.60, 0.72, 1], [0, 1, 1]);
  const y3  = useTransform(scrollYProgress, [0.60, 0.72], [50, 0]);

  // background hue shifts — overlap fully so a colored gradient is ALWAYS on screen
  const bgOpacity1 = useTransform(scrollYProgress, [0, 0.30, 0.40], [1, 1, 0]);
  const bgOpacity2 = useTransform(scrollYProgress, [0.30, 0.40, 0.62, 0.72], [0, 1, 1, 0]);
  const bgOpacity3 = useTransform(scrollYProgress, [0.62, 0.72, 1], [0, 1, 1]);

  // Full-bleed backgrounds: brighter centre, fade only to a tinted charcoal at the edges
  // (never to pure black) so the scene fills the whole screen with no black frame.
  const chapters = [
    { bg: "radial-gradient(130% 100% at 62% 38%, oklch(0.42 0.11 85) 0%, oklch(0.24 0.07 85) 50%, oklch(0.16 0.04 85) 100%)", op: bgOpacity1 },
    { bg: "radial-gradient(130% 100% at 36% 50%, oklch(0.38 0.12 245) 0%, oklch(0.22 0.08 245) 50%, oklch(0.15 0.05 245) 100%)", op: bgOpacity2 },
    { bg: "radial-gradient(130% 100% at 56% 58%, oklch(0.40 0.10 55) 0%, oklch(0.23 0.07 55) 50%, oklch(0.15 0.04 55) 100%)", op: bgOpacity3 },
  ];

  return (
    <section ref={ref} className="relative" style={{ height: "320vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#100d08]">

        {/* Background color layers */}
        {chapters.map((c, i) => (
          <motion.div key={i} className="absolute inset-0" style={{ background: c.bg, opacity: c.op }} />
        ))}

        {/* Gold grid overlay */}
        <div className="absolute inset-0 gold-grid-bg opacity-[0.12]" />

        {/* ── CHAPTER 1: Lieferung ── */}
        <motion.div
          style={{ opacity: op1, y: y1 }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <SpeedLines />
          <div className="relative z-10 text-center max-w-4xl">
            <div className="label-eyebrow mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold" />
              {t("story.c1.eyebrow")}
            </div>
            <h2 className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.88] tracking-tight mb-8 text-white uppercase">
              <span className="gradient-gold-text">{t("story.c1.num")}</span>
              <br />
              <span>{t("story.c1.unit")}</span>
            </h2>
            <p className="text-lg md:text-2xl text-white/70 max-w-xl mx-auto leading-relaxed">
              {t("story.c1.sub")}
            </p>
          </div>
        </motion.div>

        {/* ── CHAPTER 2: Produkte ── */}
        <motion.div
          style={{ opacity: op2, y: y2 }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-5xl w-full">
            <motion.div style={{ scale: scaleIn2 }} className="shrink-0">
              <TireArt progress={scrollYProgress} />
            </motion.div>
            <div className="text-center md:text-left">
              <div className="label-eyebrow mb-4 flex items-center gap-3 justify-center md:justify-start">
                <span className="h-px w-8 bg-gold" />
                {t("story.c2.eyebrow")}
              </div>
              <h2 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.88] tracking-tight mb-6 text-white uppercase">
                <span className="gradient-gold-text">{t("story.c2.num")}</span>
                <br />
                <span className="text-[0.55em]">{t("story.c2.unit")}</span>
              </h2>
              <p className="text-lg md:text-xl text-white/70 max-w-md leading-relaxed">
                {t("story.c2.sub")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── CHAPTER 3: EU-weit ── */}
        <motion.div
          style={{ opacity: op3, y: y3 }}
          className="absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-5xl w-full">
            <div className="text-center md:text-left order-2 md:order-1">
              <div className="label-eyebrow mb-4 flex items-center gap-3 justify-center md:justify-start">
                <span className="h-px w-8 bg-gold" />
                {t("story.c3.eyebrow")}
              </div>
              <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.92] tracking-tight mb-6 text-white uppercase">
                {t("story.c3.title")}
                <br />
                <span className="gradient-gold-text">{t("story.c3.sub1")}</span>
              </h2>
              <p className="text-lg md:text-xl text-white/70 max-w-md leading-relaxed">
                {t("story.c3.sub")}
              </p>
            </div>
            <div className="shrink-0 order-1 md:order-2">
              <EuDots />
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gold"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />

        {/* Scroll indicator (only at top of section) */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/60"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">{t("story.scroll")}</span>
          <motion.div
            className="w-px h-8 bg-gold/40"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
}
