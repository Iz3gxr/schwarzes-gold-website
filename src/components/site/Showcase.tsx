import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import lkwAutobahn from "@/assets/lkw-autobahn.webp";
import { useI18n } from "@/lib/i18n";

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
      scene={<img src={lkwAutobahn} alt="" className="w-full h-full object-cover" />}
    />
  );
}
