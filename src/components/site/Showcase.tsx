import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

/* ── Scene 1: Autobahn / open road at golden hour ── */
function RoadScene() {
  return (
    <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1206" />
          <stop offset="0.55" stopColor="#3a2a0e" />
          <stop offset="0.8" stopColor="#7a5413" />
          <stop offset="1" stopColor="#caa23a" />
        </linearGradient>
        <radialGradient id="sc-sun" cx="50%" cy="100%" r="60%">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#f0b54a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f0b54a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sc-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2620" />
          <stop offset="1" stopColor="#0c0b09" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="600" fill="url(#sc-sky)" />
      {/* Sun glow on horizon */}
      <ellipse cx="720" cy="380" rx="760" ry="260" fill="url(#sc-sun)" />

      {/* Distant hills */}
      <path d="M0 360 Q 300 320 560 352 T 1080 348 T 1440 358 V600 H0 Z" fill="#241a0c" opacity="0.7" />

      {/* Road (perspective) */}
      <polygon points="650,360 790,360 1180,600 260,600" fill="url(#sc-road)" />
      {/* Center dashes */}
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 7;
        const y = 372 + t * t * 228;
        const w = 3 + t * 20;
        const h = 8 + t * 26;
        return <rect key={i} x={720 - w / 2} y={y} width={w} height={h} rx={w / 3} fill="#e9c45a" opacity={0.85} />;
      })}
      {/* Road edges */}
      <polygon points="650,360 656,360 270,600 246,600" fill="#e9c45a" opacity="0.5" />
      <polygon points="784,360 790,360 1194,600 1170,600" fill="#e9c45a" opacity="0.5" />

      {/* Guardrails */}
      <g opacity="0.55">
        <polygon points="600,358 650,358 250,600 150,600" fill="#3a3a3a" />
        <polygon points="790,358 840,358 1290,600 1190,600" fill="#3a3a3a" />
      </g>

      {/* Truck silhouette in the distance */}
      <g transform="translate(694,332)" opacity="0.92">
        <rect x="0" y="0" width="52" height="30" rx="3" fill="#0c0c0c" />
        <rect x="0" y="0" width="52" height="3" fill="#caa23a" opacity="0.7" />
        <rect x="6" y="26" width="40" height="6" rx="2" fill="#080808" />
        <rect x="3" y="22" width="10" height="6" rx="2" fill="#ff3b30" />
        <rect x="39" y="22" width="10" height="6" rx="2" fill="#ff3b30" />
      </g>
    </svg>
  );
}

function Band({
  eyebrow,
  title,
  text,
  align,
  scene,
}: {
  eyebrow: string;
  title: string;
  text: string;
  align: "left" | "right";
  scene: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative h-[68vh] min-h-[440px] overflow-hidden flex items-center">
      {/* Brand scene background (parallax) */}
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[10%] w-full h-[120%]">
        {scene}
      </motion.div>
      <div
        className={`absolute inset-0 ${
          align === "right"
            ? "bg-gradient-to-l from-background via-background/65 to-transparent"
            : "bg-gradient-to-r from-background via-background/65 to-transparent"
        }`}
      />
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-xl ${align === "right" ? "ml-auto text-right" : ""}`}
        >
          <div className="label-eyebrow mb-3">— {eyebrow}</div>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{text}</p>
        </motion.div>
      </div>
    </section>
  );
}

export function Showcase() {
  const { t } = useI18n();
  return (
    <Band
      align="left"
      eyebrow={t("showcase.b1.eyebrow")}
      title={t("showcase.b1.title")}
      text={t("showcase.b1.text")}
      scene={<RoadScene />}
    />
  );
}
