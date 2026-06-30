import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Schwarzes Gold — Direktkontakt" },
      {
        name: "description",
        content: "Premium LKW-Reifen Spezialist — Anrufen, WhatsApp, E-Mail.",
      },
      { name: "robots", content: "noindex" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    ],
  }),
  component: LinksPage,
});

const LOGO = "SCHWARZES GOLD".split("");

type Btn = {
  label: string;
  href: string;
  variant: "gold" | "whatsapp" | "ghost";
};

const buttons: Btn[] = [
  { label: "📞 Jetzt anrufen", href: "tel:+4915567167624", variant: "gold" },
  {
    label: "💬 WhatsApp schreiben",
    href: "https://wa.me/4915567167624?text=Hallo%2C%20ich%20brauche%20ein%20Angebot%20f%C3%BCr%20LKW-Reifen.",
    variant: "whatsapp",
  },
  { label: "✉️ E-Mail senden", href: "mailto:info@schwarzesgoldtyre.com", variant: "ghost" },
  {
    label: "📍 Bietigheim-Bissingen",
    href: "https://maps.google.com/?q=Muggensturmer+Landstra%C3%9Fe+4-6+76467+Bietigheim",
    variant: "ghost",
  },
  { label: "🌐 Website besuchen", href: "https://schwarzesgoldtyre.com", variant: "ghost" },
];

function LinksPage() {
  return (
    <div
      className="dark relative min-h-[100svh] w-full overflow-hidden bg-background text-foreground"
      style={{ background: "#080808" }}
    >
      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(201,168,76,0.10), transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.06), transparent 60%), radial-gradient(circle at center, transparent 35%, #000 100%)",
        }}
      />

      {/* Grain */}
      <div className="grain-overlay" style={{ opacity: 0.03, mixBlendMode: "overlay" }} />

      {/* Drifting gold particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 22 }).map((_, i) => {
          const left = (i * 41 + 7) % 100;
          const size = 2 + (i % 3);
          const dur = 9 + (i % 6) * 1.3;
          const delay = (i * 0.35) % 5;
          return (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                bottom: `-10px`,
                width: size,
                height: size,
                background: "#C9A84C",
                boxShadow: "0 0 8px rgba(201,168,76,0.6)",
                opacity: 0.4,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: ["0vh", "-110vh"],
                opacity: [0, 0.55, 0.55, 0],
                x: [0, i % 2 === 0 ? 14 : -14, 0],
              }}
              transition={{
                duration: dur,
                delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[380px] flex-col items-center px-6 py-8 text-center">
        {/* LOGO */}
        <div className="flex flex-wrap justify-center">
          {LOGO.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -14, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}
              className="font-display"
              style={{
                fontSize: 44,
                lineHeight: 1,
                color: "#C9A84C",
                letterSpacing: "0.2em",
                textShadow: "0 0 24px rgba(201,168,76,0.25)",
                display: "inline-block",
                width: ch === " " ? "0.4em" : undefined,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </div>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="mt-2 uppercase"
          style={{ fontSize: 13, color: "#999", letterSpacing: "0.18em" }}
        >
          Premium LKW-Reifen Spezialist
        </motion.p>

        {/* DIVIDER */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="my-4"
          style={{
            width: 60,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, #C9A84C, transparent)",
            transformOrigin: "center",
          }}
        />

        {/* PROFILE CIRCLE */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 160, damping: 14 }}
          className="relative mt-2"
          style={{ width: 120, height: 120 }}
        >
          {/* Outer pulse glow */}
          <motion.div
            className="absolute -inset-3 rounded-full"
            animate={{
              opacity: [0.25, 0.6, 0.25],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(201,168,76,0.35), transparent 65%)",
              filter: "blur(8px)",
            }}
          />
          {/* Rotating conic gradient border */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "conic-gradient(from 0deg, #C9A84C, #6b4f12, #F5E1A4, #B8943C, #C9A84C)",
              padding: 3,
            }}
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-full"
              style={{ background: "#080808" }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: 48,
                  color: "#C9A84C",
                  letterSpacing: "0.04em",
                  textShadow: "0 0 18px rgba(201,168,76,0.4)",
                }}
              >
                SG
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.55 }}
          className="mt-4"
          style={{
            fontSize: 14,
            color: "#C9A84C",
            letterSpacing: "0.15em",
          }}
        >
          Präzision · Stärke · Vertrauen
        </motion.div>

        {/* BUTTONS */}
        <div className="mt-8 flex w-full flex-col gap-3" style={{ maxWidth: 360 }}>
          {buttons.map((b, i) => {
            const isGold = b.variant === "gold";
            const isWa = b.variant === "whatsapp";
            const baseStyle: React.CSSProperties = isGold
              ? {
                  background: "linear-gradient(135deg, #C9A84C 0%, #B8943C 100%)",
                  color: "#1a1a1a",
                  border: "none",
                  boxShadow: "0 8px 28px rgba(201,168,76,0.35)",
                }
              : isWa
                ? {
                    background: "#1a472a",
                    color: "#25D366",
                    border: "2px solid #25D366",
                  }
                : {
                    background: "transparent",
                    color: "#C9A84C",
                    border: "2px solid rgba(201,168,76,0.5)",
                  };
            const hoverGlow = isGold
              ? "0 0 36px rgba(201,168,76,0.55)"
              : isWa
                ? "0 0 32px rgba(37,211,102,0.45)"
                : "0 0 28px rgba(201,168,76,0.35)";
            return (
              <motion.a
                key={b.label}
                href={b.href}
                target={b.href.startsWith("http") ? "_blank" : undefined}
                rel={b.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.65 + i * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.03, boxShadow: hoverGlow }}
                whileTap={{ scale: 0.97 }}
                className="relative flex w-full items-center justify-center overflow-hidden"
                style={{
                  height: 48,
                  borderRadius: 6,
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  ...baseStyle,
                }}
              >
                {isGold && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0"
                    style={{
                      width: "40%",
                      background:
                        "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)",
                    }}
                    initial={{ x: "-160%" }}
                    animate={{ x: "320%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1.6,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <span className="relative z-10">{b.label}</span>
              </motion.a>
            );
          })}
        </div>

        {/* FOOTER */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="mt-12"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 11,
            color: "#555",
          }}
        >
          Schwarzes Gold Reifenhandel UG © 2026
        </motion.p>
      </div>
    </div>
  );
}
