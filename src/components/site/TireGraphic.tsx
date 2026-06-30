/**
 * Premium-Reifen-Illustration (Reifen + Alufelge mit Gold-Akzenten).
 * Ersetzt die früheren leeren CSS-Kreise im Katalog.
 * `seed` variiert die Felgen-Speichen leicht, damit nicht alle Karten identisch wirken.
 */
const SPOKE_COUNTS = [5, 6, 7, 8];

export function TireGraphic({ className = "", seed = 0 }: { className?: string; seed?: number }) {
  const spokes = SPOKE_COUNTS[seed % SPOKE_COUNTS.length];
  const cx = 100;
  const cy = 100;

  const spokeLines = Array.from({ length: spokes }).map((_, k) => {
    const a = (k / spokes) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + 52 * Math.cos(a), y: cy + 52 * Math.sin(a), key: k };
  });
  const lugNuts = Array.from({ length: spokes }).map((_, k) => {
    const a = ((k + 0.5) / spokes) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + 24 * Math.cos(a), y: cy + 24 * Math.sin(a), key: k };
  });

  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id={`tg-rubber-${seed}`} cx="50%" cy="36%" r="72%">
          <stop offset="0%" stopColor="oklch(0.27 0 0)" />
          <stop offset="100%" stopColor="oklch(0.12 0 0)" />
        </radialGradient>
        <radialGradient id={`tg-rim-${seed}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="oklch(0.42 0.01 90)" />
          <stop offset="55%" stopColor="oklch(0.26 0.01 90)" />
          <stop offset="100%" stopColor="oklch(0.16 0 0)" />
        </radialGradient>
        <linearGradient id={`tg-gold-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-soft)" />
          <stop offset="100%" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>

      {/* Reifenkörper */}
      <circle cx={cx} cy={cy} r="92" fill={`url(#tg-rubber-${seed})`} />
      {/* Profil / Tread (gestrichelter dicker Ring) */}
      <circle cx={cx} cy={cy} r="84" fill="none" stroke="oklch(0.19 0 0)" strokeWidth="15" strokeDasharray="7 7" />
      <circle cx={cx} cy={cy} r="92" fill="none" stroke="var(--gold)" strokeOpacity="0.18" strokeWidth="1" />
      {/* Sidewall */}
      <circle cx={cx} cy={cy} r="70" fill="oklch(0.15 0 0)" stroke="oklch(0.30 0 0)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="64" fill="none" stroke="var(--gold)" strokeOpacity="0.12" strokeWidth="1" />
      {/* Felge */}
      <circle cx={cx} cy={cy} r="60" fill={`url(#tg-rim-${seed})`} stroke="var(--gold)" strokeOpacity="0.4" strokeWidth="1.5" />
      {/* Speichen */}
      <g stroke={`url(#tg-gold-${seed})`} strokeOpacity="0.55" strokeWidth="3.5" strokeLinecap="round">
        {spokeLines.map((p) => (
          <line key={p.key} x1={cx} y1={cy} x2={p.x} y2={p.y} />
        ))}
      </g>
      {/* Radbolzen */}
      <g fill={`url(#tg-gold-${seed})`}>
        {lugNuts.map((p) => (
          <circle key={p.key} cx={p.x} cy={p.y} r="2.6" />
        ))}
      </g>
      {/* Nabe */}
      <circle cx={cx} cy={cy} r="15" fill={`url(#tg-gold-${seed})`} />
      <circle cx={cx} cy={cy} r="15" fill="none" stroke="oklch(0.12 0 0)" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="6" fill="oklch(0.12 0 0)" fillOpacity="0.55" />
    </svg>
  );
}
