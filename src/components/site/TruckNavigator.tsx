import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// SVG viewBox: 0 0 1000 440
// Cab on left (facing right), trailer on right

interface Zone {
  id: string;
  label: string;
  sub: string;
  dotX: number;
  dotY: number;
  color: string;
  nav: { q?: string; cat?: string };
  // SVG zone path/shape props
  zoneType: "circle" | "rect";
  zx: number; zy: number; zw?: number; zh?: number; zr?: number; // circle r or rect w/h
}

const ZONES: Zone[] = [
  {
    id: "lenkachse",
    label: "Lenkachse",
    sub: "Reifen für Vorder- & Lenkachse",
    dotX: 158, dotY: 295,
    color: "#caa23a",
    nav: { q: "Lenkachse" },
    zoneType: "circle", zx: 158, zy: 385, zr: 72,
  },
  {
    id: "antrieb",
    label: "Antriebsachse",
    sub: "Reifen für Antriebs- & Sattelachse",
    dotX: 490, dotY: 295,
    color: "#caa23a",
    nav: { q: "Antriebsachse" },
    zoneType: "rect", zx: 398, zy: 310, zw: 200, zh: 130,
  },
  {
    id: "trailer",
    label: "Trailer / Auflieger",
    sub: "Reifen für Anhänger & Auflieger",
    dotX: 830, dotY: 295,
    color: "#caa23a",
    nav: { q: "Trailer" },
    zoneType: "rect", zx: 742, zy: 310, zw: 195, zh: 130,
  },
  {
    id: "motor",
    label: "Motor & Antrieb",
    sub: "Filter, Öle & Antriebsteile",
    dotX: 130, dotY: 175,
    color: "#3b82f6",
    nav: { cat: "Motor & Antriebsstrang" },
    zoneType: "rect", zx: 48, zy: 108, zw: 185, zh: 185,
  },
  {
    id: "bremse",
    label: "Bremsanlage",
    sub: "Scheiben, Beläge & Trommeln",
    dotX: 340, dotY: 415,
    color: "#ef4444",
    nav: { cat: "Bremsanlage" },
    zoneType: "rect", zx: 255, zy: 370, zw: 175, zh: 65,
  },
  {
    id: "beleuchtung",
    label: "Beleuchtung & Elektrik",
    sub: "LED, Scheinwerfer, 24V",
    dotX: 28, dotY: 228,
    color: "#f59e0b",
    nav: { cat: "Beleuchtung & Elektrik" },
    zoneType: "rect", zx: 14, zy: 198, zw: 32, zh: 72,
  },
];

// ── Truck SVG ──────────────────────────────────────────────────────────────

function TruckSVG({ active }: { active: string | null }) {
  const cabFill = "#0f0f0f";
  const trailerFill = "#111";
  const gold = "#caa23a";
  const rim = "#252525";

  function zoneHighlight(zone: Zone) {
    const isActive = active === zone.id;
    const opacity = isActive ? 0.22 : 0;
    if (zone.zoneType === "circle") {
      return (
        <circle
          key={zone.id}
          cx={zone.zx} cy={zone.zy} r={zone.zr}
          fill={zone.color}
          opacity={opacity}
          style={{ transition: "opacity 0.2s" }}
          pointerEvents="none"
        />
      );
    }
    return (
      <rect
        key={zone.id}
        x={zone.zx} y={zone.zy} width={zone.zw} height={zone.zh}
        rx={8}
        fill={zone.color}
        opacity={opacity}
        style={{ transition: "opacity 0.2s" }}
        pointerEvents="none"
      />
    );
  }

  function Wheel({ cx, cy }: { cx: number; cy: number }) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={48} fill="#1a1a1a" />
        <circle cx={cx} cy={cy} r={38} fill={rim} />
        <circle cx={cx} cy={cy} r={22} fill="#0a0a0a" />
        <circle cx={cx} cy={cy} r={14} fill={rim} />
        {/* Lug nuts */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 6;
          return (
            <circle key={i} cx={cx + Math.cos(a) * 24} cy={cy + Math.sin(a) * 24}
              r={3.5} fill="#333" />
          );
        })}
        {/* Tread */}
        <circle cx={cx} cy={cy} r={48} fill="none" stroke="#2a2a2a" strokeWidth={4}
          strokeDasharray="8 6" />
        {/* Brake disc hint */}
        <circle cx={cx} cy={cy} r={30} fill="none" stroke="#333" strokeWidth={1.5} />
      </g>
    );
  }

  return (
    <svg viewBox="0 0 1000 440" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="tn-cab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1a1a" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="tn-trailer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#161616" />
          <stop offset="1" stopColor="#0c0c0c" />
        </linearGradient>
        <linearGradient id="tn-roof" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#1a1a1a" />
        </linearGradient>
        <filter id="tn-glow-gold">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="tn-glow-blue">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="tn-glow-red">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx={500} cy={436} rx={480} ry={10} fill="#000" opacity={0.4} />

      {/* ── Trailer body ── */}
      <rect x={238} y={108} width={742} height={248} rx={4} fill="url(#tn-trailer)" />
      {/* Trailer roof accent */}
      <rect x={238} y={108} width={742} height={8} rx={4} fill={gold} opacity={0.5} />
      {/* Trailer ribs */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={280 + i * 57} y1={116} x2={280 + i * 57} y2={356}
          stroke="#222" strokeWidth={1.5} />
      ))}
      {/* Trailer back door */}
      <rect x={956} y={118} width={22} height={234} rx={2} fill="#1c1c1c"
        stroke="#2a2a2a" strokeWidth={1} />
      <line x1={967} y1={118} x2={967} y2={352} stroke="#333" strokeWidth={0.8} />
      {/* Trailer logo area */}
      <rect x={500} y={175} width={200} height={75} rx={4}
        fill="#0c0c0c" opacity={0.6} />
      <text x={600} y={210} textAnchor="middle" fill={gold} opacity={0.4}
        fontSize={11} letterSpacing={4} fontFamily="serif" fontWeight="bold">
        SCHWARZES GOLD
      </text>
      <text x={600} y={232} textAnchor="middle" fill={gold} opacity={0.25}
        fontSize={8} letterSpacing={2}>
        REIFENHANDEL
      </text>
      {/* Trailer underframe */}
      <rect x={238} y={350} width={742} height={12} rx={2} fill="#0a0a0a" />
      {/* Fifth wheel / king pin */}
      <rect x={238} y={330} width={50} height={28} rx={3} fill="#1c1c1c" />
      <rect x={248} y={338} width={30} height={12} rx={2} fill="#252525" />

      {/* ── Cab body ── */}
      {/* Main cab shape */}
      <path
        d={`M 46,110 L 235,110 L 235,358 L 46,358 Q 28,358 20,340 L 20,260
            Q 14,248 14,234 L 14,210 Q 14,195 22,182 L 46,145 Z`}
        fill="url(#tn-cab)"
      />
      {/* Cab roof extension / sleeper */}
      <rect x={115} y={88} width={122} height={28} rx={4} fill="#141414" />
      {/* Roof AC unit */}
      <rect x={145} y={82} width={60} height={10} rx={2} fill="#1a1a1a" />
      {/* Exhaust stack */}
      <rect x={218} y={62} width={12} height={50} rx={3} fill="#1c1c1c" />
      <rect x={214} y={58} width={20} height={8} rx={2} fill="#222" />
      <ellipse cx={224} cy={58} rx={10} ry={4} fill="#252525" />
      {/* Windshield */}
      <path d={`M 46,148 L 80,112 L 208,112 L 208,208 L 46,208 Z`}
        fill="#0e1a22" stroke="#1a2a35" strokeWidth={1.5} />
      {/* Windshield reflection */}
      <path d={`M 58,148 L 88,118 L 130,118 L 98,148 Z`}
        fill="white" opacity={0.04} />
      {/* Cab door */}
      <rect x={116} y={140} width={114} height={192} rx={3}
        fill="#111" stroke="#222" strokeWidth={1} />
      {/* Door window */}
      <rect x={124} y={148} width={98} height={72} rx={2} fill="#0e1a22" stroke="#1a2a35" strokeWidth={1} />
      {/* Door handle */}
      <rect x={195} y={228} width={22} height={5} rx={2} fill={gold} opacity={0.7} />
      {/* Door step */}
      <rect x={116} y={338} width={114} height={8} rx={2} fill="#1a1a1a" />
      <rect x={116} y={350} width={80} height={6} rx={2} fill="#151515" />
      {/* Fuel tank */}
      <rect x={228} y={252} width={18} height={110} rx={4}
        fill="#1c1c1c" stroke="#2a2a2a" strokeWidth={1} />
      {/* Cab-trailer connector */}
      <rect x={228} y={200} width={16} height={52} rx={2} fill="#141414" />
      {/* Gold cab roof stripe */}
      <rect x={20} y={108} width={215} height={4} rx={2} fill={gold} opacity={0.5} />
      {/* Gold grill bars */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={16} y={215 + i * 14} width={26} height={4} rx={1}
          fill={gold} opacity={0.55} />
      ))}
      {/* Headlight main */}
      <rect x={15} y={200} width={28} height={22} rx={3}
        fill={active === "beleuchtung" ? "#ffd06a" : "#c9a82a"}
        opacity={active === "beleuchtung" ? 0.9 : 0.7}
        filter={active === "beleuchtung" ? "url(#tn-glow-gold)" : undefined}
      />
      {/* Headlight DRL */}
      <rect x={15} y={226} width={28} height={8} rx={2} fill={gold} opacity={0.5} />
      {/* Side marker */}
      <rect x={15} y={238} width={28} height={7} rx={2} fill="#e84" opacity={0.5} />
      {/* Front bumper */}
      <rect x={12} y={320} width={32} height={20} rx={3} fill={gold} opacity={0.7} />
      <rect x={12} y={315} width={32} height={7} rx={2} fill="#222" />
      {/* Mirror */}
      <rect x={5} y={160} width={22} height={14} rx={2} fill="#1c1c1c"
        stroke="#2a2a2a" strokeWidth={1} />
      <line x1={16} y1={174} x2={28} y2={185} stroke="#222" strokeWidth={1.5} />

      {/* ── Wheels ── */}
      <Wheel cx={158} cy={385} />
      <Wheel cx={460} cy={385} />
      <Wheel cx={520} cy={385} />
      <Wheel cx={800} cy={385} />
      <Wheel cx={862} cy={385} />

      {/* ── Axles ── */}
      <rect x={410} y={382} width={158} height={8} rx={4} fill="#1a1a1a" />
      <rect x={750} y={382} width={162} height={8} rx={4} fill="#1a1a1a" />
      <rect x={118} y={382} width={80} height={8} rx={4} fill="#1a1a1a" />

      {/* ── Brake disc indicators (visible on active) ── */}
      {["antrieb", "trailer", "lenkachse", "bremse"].includes(active ?? "") && (
        <>
          <circle cx={460} cy={385} r={33} fill="none" stroke="#ef4444"
            strokeWidth={2} opacity={0.4} strokeDasharray="6 4" />
          <circle cx={520} cy={385} r={33} fill="none" stroke="#ef4444"
            strokeWidth={2} opacity={0.4} strokeDasharray="6 4" />
        </>
      )}

      {/* ── Zone highlights overlay ── */}
      {ZONES.map(zoneHighlight)}

      {/* ── Clickable hit areas (transparent, wide) ── */}
      {ZONES.map((zone) => {
        if (zone.zoneType === "circle") {
          return (
            <circle key={zone.id + "-hit"}
              cx={zone.zx} cy={zone.zy} r={zone.zr! + 8}
              fill="transparent" style={{ cursor: "pointer" }}
              data-zone={zone.id}
            />
          );
        }
        return (
          <rect key={zone.id + "-hit"}
            x={zone.zx - 8} y={zone.zy - 8}
            width={(zone.zw ?? 0) + 16} height={(zone.zh ?? 0) + 16}
            rx={12} fill="transparent" style={{ cursor: "pointer" }}
            data-zone={zone.id}
          />
        );
      })}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function TruckNavigator() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);

  const activeZone = ZONES.find((z) => z.id === active) ?? null;

  const goToShop = (zone: Zone) => {
    const search: Record<string, string> = {};
    if (zone.nav.q) search.q = zone.nav.q;
    if (zone.nav.cat) search.cat = zone.nav.cat;
    navigate({ to: "/katalog", search });
  };

  // Hover/tap handler on the SVG wrapper
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.target as SVGElement;
    const zoneId = el.dataset?.zone;
    setActive(zoneId ?? null);
  };

  const handleLeave = () => setActive(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.target as SVGElement;
    const zoneId = el.dataset?.zone;
    if (!zoneId) return;
    const zone = ZONES.find((z) => z.id === zoneId);
    if (zone) goToShop(zone);
  };

  // Mobile: tap dot to activate, tap again or elsewhere to go
  const handleTap = (zone: Zone) => {
    if (active === zone.id) {
      goToShop(zone);
    } else {
      setActive(zone.id);
    }
  };

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 gold-grid-bg opacity-[0.03]" />
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 60%, oklch(0.72 0.14 85 / 0.04), transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="label-eyebrow mb-3 justify-center flex">— Fahrzeug-Navigator</div>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-4">
            Ihr Fahrzeug.{" "}
            <span className="gradient-gold-text">Ihr Bedarf.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Klicken Sie auf den gewünschten Bereich Ihres Fahrzeugs — wir zeigen Ihnen sofort die passenden Produkte.
          </p>
        </motion.div>

        {/* Truck + hotspots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          {/* SVG wrapper — handles hover/click */}
          <div
            className="relative w-full select-none"
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onClick={handleClick}
          >
            <TruckSVG active={active} />

            {/* Pulsing hotspot dots */}
            {ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                aria-label={zone.label}
                onClick={(e) => { e.stopPropagation(); handleTap(zone); }}
                onMouseEnter={() => setActive(zone.id)}
                style={{
                  position: "absolute",
                  left: `${(zone.dotX / 1000) * 100}%`,
                  top: `${(zone.dotY / 440) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="group z-20 focus:outline-none"
              >
                {/* Outer pulse ring */}
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: zone.color,
                    opacity: active === zone.id ? 0 : 0.35,
                    animationDuration: "2s",
                  }}
                />
                {/* Inner dot */}
                <span
                  className="relative flex w-5 h-5 rounded-full items-center justify-center transition-transform duration-200"
                  style={{
                    backgroundColor: zone.color,
                    transform: active === zone.id ? "scale(1.4)" : "scale(1)",
                    boxShadow: active === zone.id ? `0 0 12px 4px ${zone.color}66` : "none",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-background/80" />
                </span>
              </button>
            ))}

            {/* Floating tooltip — shows on hover/tap */}
            <AnimatePresence>
              {activeZone && (
                <motion.div
                  key={activeZone.id}
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute z-30 pointer-events-none"
                  style={{
                    left: `${Math.min(Math.max((activeZone.dotX / 1000) * 100, 10), 70)}%`,
                    top: `${Math.max((activeZone.dotY / 440) * 100 - 28, 2)}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="glass-card rounded-xl px-4 py-3 min-w-[180px] text-center shadow-2xl border"
                    style={{ borderColor: `${activeZone.color}40` }}>
                    <div className="text-[10px] uppercase tracking-[0.18em] mb-0.5"
                      style={{ color: activeZone.color }}>
                      {activeZone.label}
                    </div>
                    <div className="text-sm text-foreground/80 leading-tight mb-1.5">
                      {activeZone.sub}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                      <span className="hidden md:inline">Klicken</span>
                      <span className="md:hidden">Tippen</span>
                      <span>→ Produkte anzeigen</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="w-3 h-3 rotate-45 mx-auto -mt-1.5"
                    style={{ background: "var(--glass-card-bg, #1a1a1a)", border: `1px solid ${activeZone.color}40` }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zone legend label bar (below truck) */}
          <div className="mt-2 flex items-center justify-center gap-1 flex-wrap text-[10px] uppercase tracking-[0.12em] text-muted-foreground/50">
            <span className="w-2 h-2 rounded-full inline-block bg-gold/60 mr-1" />
            Reifen
            <span className="mx-3 opacity-30">·</span>
            <span className="w-2 h-2 rounded-full inline-block bg-blue-500/60 mr-1" />
            Motor
            <span className="mx-3 opacity-30">·</span>
            <span className="w-2 h-2 rounded-full inline-block bg-red-500/60 mr-1" />
            Bremsen
            <span className="mx-3 opacity-30">·</span>
            <span className="w-2 h-2 rounded-full inline-block bg-amber-400/60 mr-1" />
            Beleuchtung
          </div>
        </motion.div>

        {/* Mobile card grid — tap to navigate */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 md:hidden">
          {ZONES.map((zone) => (
            <motion.button
              key={zone.id}
              type="button"
              onClick={() => goToShop(zone)}
              whileTap={{ scale: 0.97 }}
              className="glass-card rounded-xl p-4 text-left flex flex-col gap-2 border transition-colors"
              style={{ borderColor: `${zone.color}30` }}
            >
              <span className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: zone.color }} />
              <span className="font-display text-sm leading-tight">{zone.label}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{zone.sub}</span>
              <span className="mt-auto flex items-center gap-1 text-[10px] uppercase tracking-[0.1em]"
                style={{ color: zone.color }}>
                Filtern <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </motion.button>
          ))}
        </div>

        {/* Desktop CTA hint */}
        <p className="hidden md:block text-center mt-6 text-xs text-muted-foreground/50 uppercase tracking-[0.15em]">
          Fahren Sie mit der Maus über den LKW — klicken Sie auf einen Bereich
        </p>
      </div>
    </section>
  );
}
