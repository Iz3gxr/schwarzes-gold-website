import { useTheme } from "@/lib/theme";

const STARS = Array.from({ length: 70 }).map((_, i) => ({
  left: (i * 53.3 + 7) % 100,
  top: (i * 27.7 + 3) % 50,
  size: (i % 3) + 1,
  dur: 3 + (i % 5),
  delay: (i % 9) * 0.4,
}));

const CLOUDS = [
  { w: 260, h: 80, topPct: 9,  delay: 0,   dur: 55 },
  { w: 180, h: 58, topPct: 18, delay: -18, dur: 72 },
  { w: 310, h: 90, topPct: 6,  delay: -35, dur: 62 },
  { w: 155, h: 52, topPct: 23, delay: -50, dur: 82 },
];

const TRUCK_DUR = 9; // seconds to cross screen
const LAMP_COUNT = 9;

function CloudShape({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <ellipse cx={w * 0.50} cy={h * 0.72} rx={w * 0.46} ry={h * 0.28} fill="rgba(255,255,255,0.95)" />
      <ellipse cx={w * 0.30} cy={h * 0.55} rx={w * 0.28} ry={h * 0.42} fill="rgba(255,255,255,0.97)" />
      <ellipse cx={w * 0.65} cy={h * 0.50} rx={w * 0.25} ry={h * 0.46} fill="white" />
      <ellipse cx={w * 0.48} cy={h * 0.38} rx={w * 0.30} ry={h * 0.44} fill="white" />
    </svg>
  );
}

function TruckSVG({ isDay }: { isDay: boolean }) {
  // Always black/gold — "Schwarzes Gold" brand identity
  const cabFill    = "#111111";
  const trailerFill= "#0d0d0d";
  const ribColor   = "#222";
  const winFill    = isDay ? "#4a90c4" : "#1a2d3f";
  const wheelRim   = "#2a2a2a";

  // wheel centres
  const wheels = [
    { cx: 46,  cy: 178 },
    { cx: 292, cy: 178 },
    { cx: 342, cy: 178 },
    { cx: 445, cy: 178 },
    { cx: 492, cy: 178 },
  ];

  const wStyle: React.CSSProperties = {
    transformBox: "fill-box" as React.CSSProperties["transformBox"],
    transformOrigin: "center",
  };

  return (
    <svg width="545" height="200" viewBox="0 0 545 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground shadow */}
      <ellipse cx="272" cy="197" rx="258" ry="7" fill="#000" opacity={isDay ? 0.18 : 0.45} />

      {/* Air deflector cab-roof → trailer-roof */}
      <path d="M 98 13 L 118 36 L 118 13 Z" fill={isDay ? "#bbb" : "#1a1a1a"} />

      {/* ── TRAILER ── */}
      <rect x="118" y="36" width="412" height="126" rx="5"
        fill={trailerFill} stroke={isDay ? "#999" : "#222"} strokeWidth="1.5" />

      {/* Vertical ribs */}
      {[0,1,2,3,4,5,6,7].map(k => (
        <line key={k} x1={158 + k * 46} y1={36} x2={158 + k * 46} y2={162}
          stroke={ribColor} strokeWidth="1" opacity="0.65" />
      ))}

      {/* Gold top accent */}
      <rect x="118" y="36" width="412" height="5" rx="2" fill="oklch(0.80 0.13 85 / 0.50)" />
      {/* Gold bottom accent */}
      <rect x="118" y="157" width="412" height="5" rx="2" fill="oklch(0.80 0.13 85 / 0.28)" />

      {/* Hazard reflective strip */}
      {[0,1,2,3,4,5,6,7,8,9].map(k => (
        <rect key={k} x={123 + k * 38} y={148} width={38} height={10}
          fill={k % 2 === 0 ? "#c4302b" : "#dfdfdf"} opacity="0.9" />
      ))}

      {/* Rear door line */}
      <line x1="530" y1="36" x2="530" y2="162" stroke={isDay ? "#999" : "#282828"} strokeWidth="1.5" />

      {/* Tail lights */}
      <rect x="522" y="62" width="18" height="26" rx="3"
        fill={isDay ? "#aa1111" : "#ff2e2e"}
        style={!isDay ? { filter: "drop-shadow(0 0 7px #ff2020)" } : {}} />
      <rect x="522" y="93" width="18" height="14" rx="2"
        fill={isDay ? "#996600" : "#ff7700"}
        style={!isDay ? { filter: "drop-shadow(0 0 5px #ff6600)" } : {}} />

      {/* ── CAB ── */}
      <rect x="0" y="14" width="120" height="150" rx="11" fill={cabFill} stroke="#1e1e1e" strokeWidth="1.5" />
      {/* Gold cab accent stripe along roof */}
      <rect x="0" y="14" width="120" height="4" rx="2" fill="oklch(0.80 0.13 85 / 0.7)" />
      {/* Front face subtle highlight */}
      <rect x="0" y="14" width="12" height="150" rx="6" fill="rgba(255,255,255,0.04)" />

      {/* Windshield */}
      <rect x="11" y="22" width="84" height="66" rx="6" fill={winFill} />
      <line x1="54" y1="22" x2="54" y2="88" stroke="#1e3040" strokeWidth="1.5" />
      <rect x="11" y="22" width="84" height="66" rx="6" fill="none" stroke="#1e1e1e" strokeWidth="1.5" />
      <path d="M 15 26 Q 17 24 23 26 L 21 52 Q 17 50 15 47 Z" fill="rgba(255,255,255,0.10)" />

      {/* Side mirror */}
      <rect x="-13" y="22" width="16" height="11" rx="3" fill="#1a1a1a" stroke="#111" strokeWidth="1" />
      <line x1="0" y1="27" x2="-13" y2="27" stroke="#222" strokeWidth="1.5" />

      {/* Door */}
      <rect x="11" y="94" width="92" height="60" rx="3" fill="none" stroke="#222" strokeWidth="1" />
      {/* Gold door accent line */}
      <line x1="11" y1="94" x2="103" y2="94" stroke="oklch(0.80 0.13 85 / 0.4)" strokeWidth="1.5" />
      {/* Door handle */}
      <rect x="88" y="122" width="13" height="5" rx="2.5" fill="oklch(0.80 0.13 85 / 0.6)" />

      {/* Steps */}
      <rect x="11" y="158" width="42" height="6" rx="1" fill="#181818" />
      <rect x="11" y="165" width="30" height="5" rx="1" fill="#111" />

      {/* Headlight cluster */}
      <rect x="0" y="108" width="13" height="30" rx="2"
        fill={isDay ? "#ffe080" : "#ffee80"}
        style={!isDay ? { filter: "drop-shadow(0 0 8px rgba(255,230,80,0.95))" } : {}} />
      {/* DRL strip */}
      <rect x="0" y="106" width="13" height="4" rx="1"
        fill="rgba(200,240,255,0.9)"
        style={!isDay ? { filter: "drop-shadow(0 0 5px rgba(180,230,255,0.9))" } : {}} />

      {/* Grill — gold bars */}
      <rect x="0" y="140" width="13" height="22" rx="1" fill="#0e0e0e" />
      {[0,1,2,3].map(k => (
        <line key={k} x1="0" y1={142 + k * 5} x2="13" y2={142 + k * 5}
          stroke="oklch(0.80 0.13 85 / 0.5)" strokeWidth="1" />
      ))}

      {/* Bumper — gold */}
      <rect x="0" y="163" width="120" height="8" rx="3" fill="oklch(0.72 0.14 85)" />

      {/* Exhaust pipe */}
      <rect x="106" y="0" width="9" height="34" rx="4" fill="#1a1a1a" />
      <circle cx="110" cy="0" r="4.5" fill="#111" />

      {/* Fuel tank */}
      <rect x="97" y="118" width="22" height="48" rx="7" fill="#181818" stroke="#222" strokeWidth="1" />

      {/* Fifth wheel plate */}
      <rect x="102" y="161" width="22" height="6" rx="2" fill="#252525" />

      {/* ── WHEELS ── */}
      {wheels.map(({ cx, cy }) => (
        <g key={cx} className="hw-wheel" style={wStyle}>
          <circle cx={cx} cy={cy} r={29} fill="#080808" />
          <circle cx={cx} cy={cy} r={20} fill={wheelRim} />
          {[0,1,2,3,4,5].map(k => {
            const a = (k * 60) * Math.PI / 180;
            return (
              <line key={k}
                x1={cx + Math.cos(a) * 4}  y1={cy + Math.sin(a) * 4}
                x2={cx + Math.cos(a) * 17} y2={cy + Math.sin(a) * 17}
                stroke="#484848" strokeWidth="2.5" strokeLinecap="round" />
            );
          })}
          <circle cx={cx} cy={cy} r={5} fill="#505050" />
          <circle cx={cx} cy={cy} r={2} fill="#333" />
          <circle cx={cx} cy={cy} r={27} fill="none" stroke="#181818" strokeWidth="1.5" strokeDasharray="4 6" />
        </g>
      ))}
    </svg>
  );
}

export function HighwayScene() {
  const { theme } = useTheme();
  const isDay = theme === "light";

  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: isDay ? "#4a9fd8" : "#020208" }}>

      <style>{`
        @keyframes hw-twinkle  { 0%,100%{opacity:.10} 50%{opacity:.88} }
        @keyframes hw-wroll    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .hw-wheel              { animation:hw-wroll 0.55s linear infinite; }
        @keyframes hw-truck    { from{transform:translateX(110vw)} to{transform:translateX(-65vw)} }
        @keyframes hw-road     { from{background-position-x:0} to{background-position-x:-120px} }
        @keyframes hw-lamp     { from{transform:translateX(110vw)} to{transform:translateX(-30vw)} }
        @keyframes hw-cloud    { from{transform:translateX(110vw)} to{transform:translateX(-60vw)} }
        @keyframes hw-sun      {
          0%,100%{box-shadow:0 0 50px 24px oklch(0.97 0.12 90/0.38),0 0 120px 60px oklch(0.97 0.12 85/0.14)}
          50%    {box-shadow:0 0 75px 38px oklch(0.97 0.12 90/0.50),0 0 170px 85px oklch(0.97 0.12 85/0.18)}
        }
        @keyframes hw-moon     {
          0%,100%{box-shadow:0 0 28px 12px rgba(230,220,190,.24)}
          50%    {box-shadow:0 0 46px 22px rgba(230,220,190,.36)}
        }
        @media (prefers-reduced-motion:reduce) {
          .hw-wheel,.hw-anim{animation:none!important}
        }
      `}</style>

      {/* ── SKY ── */}
      <div className="absolute inset-0" style={{
        background: isDay
          ? "linear-gradient(180deg,#1565b0 0%,#3590e0 30%,#6bbcee 60%,#b8e8fc 100%)"
          : "linear-gradient(180deg,#010109 0%,#03030e 32%,#07070f 62%,#0e0b0e 100%)",
      }} />

      {/* SUN (day) */}
      {isDay && (
        <div className="hw-anim absolute rounded-full" style={{
          right: "17%", top: "11%",
          width: 90, height: 90,
          background: "radial-gradient(circle,#fffce0 15%,#ffe455 52%,#ffc400 100%)",
          animation: "hw-sun 5s ease-in-out infinite",
        }} />
      )}

      {/* MOON (night) */}
      {!isDay && (
        <div className="hw-anim absolute rounded-full" style={{
          right: "14%", top: "9%",
          width: 64, height: 64,
          background: "radial-gradient(circle at 38% 42%,#f5edd8,#c6b676)",
          animation: "hw-moon 7s ease-in-out infinite",
        }}>
          <div style={{ position:"absolute", left:20, top:12, width:13, height:13,
            borderRadius:"50%", background:"rgba(0,0,0,0.13)" }} />
          <div style={{ position:"absolute", left:9, top:30, width:9, height:9,
            borderRadius:"50%", background:"rgba(0,0,0,0.10)" }} />
        </div>
      )}

      {/* STARS (night) */}
      {!isDay && STARS.map((s, i) => (
        <span key={i} className="hw-anim absolute rounded-full bg-white" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size,
          animation: `hw-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}

      {/* CLOUDS (day) */}
      {isDay && CLOUDS.map((c, i) => (
        <div key={i} className="hw-anim absolute" style={{
          top: `${c.topPct}%`,
          animation: `hw-cloud ${c.dur}s linear ${c.delay}s infinite`,
        }}>
          <CloudShape w={c.w} h={c.h} />
        </div>
      ))}

      {/* TREELINE silhouette */}
      <div className="absolute left-0 right-0" style={{ top: "52%", height: "10%", overflow: "hidden" }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 80" fill="none">
          {Array.from({ length: 52 }).map((_, i) => {
            const x = i * 30 - 4 + (i % 5) * 5;
            const h = 24 + (i % 8) * 9;
            return (
              <polygon key={i} points={`${x},80 ${x + 15},${80 - h} ${x + 30},80`}
                fill={isDay ? (i % 3 === 0 ? "#2a5c18" : "#3c7824") : "#040404"} />
            );
          })}
        </svg>
      </div>

      {/* GRASS / shoulder */}
      <div className="absolute left-0 right-0" style={{
        top: "58%", height: "5%",
        background: isDay
          ? "linear-gradient(180deg,#4e9030,#3e7a24)"
          : "linear-gradient(180deg,#080b04,#060805)",
      }} />

      {/* LEITPLANKE — near side */}
      <div className="absolute left-0 right-0" style={{ top: "61%", height: "4%" }}>
        {/* Posts */}
        {Array.from({ length: 34 }).map((_, i) => (
          <div key={i} className="absolute" style={{
            left: `${(i / 33) * 100}%`, top: "32%",
            width: "0.4%", minWidth: 3, height: "100%",
            background: isDay ? "#8a8a8a" : "#444",
          }} />
        ))}
        {/* Top W-rail — always galvanized steel */}
        <div className="absolute left-0 right-0" style={{
          top: "4%", height: "36%",
          background: "linear-gradient(180deg,#c8c8c8 0%,#909090 50%,#c0c0c0 100%)",
        }} />
        {/* Bottom W-rail */}
        <div className="absolute left-0 right-0" style={{
          top: "52%", height: "28%",
          background: "linear-gradient(180deg,#b8b8b8 0%,#808080 50%,#b0b0b0 100%)",
        }} />
      </div>

      {/* ROAD surface — always dark asphalt */}
      <div className="absolute left-0 right-0 bottom-0" style={{
        top: "63%",
        background: isDay
          ? "linear-gradient(180deg,#3a3a3a 0%,#484848 100%)"
          : "linear-gradient(180deg,#0e0e0e 0%,#1c1c1c 100%)",
      }} />

      {/* Road near edge line */}
      <div className="absolute left-0 right-0" style={{
        top: "63.5%", height: "0.4%",
        background: isDay ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.38)",
      }} />

      {/* Center lane dashes (scrolling) */}
      <div className="hw-anim absolute left-0 right-0" style={{
        top: "75%", height: "2.5%",
        backgroundImage: `repeating-linear-gradient(90deg,${
          isDay ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.62)"
        } 0 58px,transparent 58px 120px)`,
        animation: "hw-road 0.48s linear infinite",
      }} />

      {/* Far edge line */}
      <div className="absolute left-0 right-0" style={{
        top: "93%", height: "0.35%",
        background: isDay ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)",
      }} />

      {/* Far-side guardrail (perspective, smaller) */}
      <div className="absolute left-0 right-0" style={{
        top: "64.8%", height: "1.2%", opacity: 0.42,
        background: isDay ? "#b8b8b8" : "#3e3e3e",
      }} />

      {/* STREET LAMPS (night only) */}
      {!isDay && Array.from({ length: LAMP_COUNT }).map((_, i) => (
        <div key={i} className="hw-anim absolute" style={{
          top: "54%",
          animation: `hw-lamp 6.5s linear ${-(i * 6.5 / LAMP_COUNT)}s infinite`,
        }}>
          {/* Pole */}
          <div style={{
            position:"absolute", left:0, top:0, width:5, height:"16vh",
            background:"linear-gradient(90deg,#3a3a3a,#1e1e1e)",
            borderRadius:"2px 2px 0 0",
          }} />
          {/* Arm */}
          <div style={{
            position:"absolute", left:-24, top:0, width:28, height:5,
            background:"#2a2a2a", borderRadius:3,
          }} />
          {/* Lamp head */}
          <div style={{
            position:"absolute", left:-34, top:-9, width:19, height:12,
            borderRadius:4, background:"#ffd050",
            boxShadow:"0 0 18px 8px rgba(255,196,46,0.48),0 0 42px 22px rgba(255,175,28,0.18)",
          }} />
          {/* Light cone on road */}
          <div style={{
            position:"absolute", left:-58, top:8, width:84, height:"12vh",
            background:"linear-gradient(180deg,rgba(255,198,46,0.13) 0%,transparent 100%)",
            clipPath:"polygon(34% 0,66% 0,100% 100%,0 100%)",
          }} />
        </div>
      ))}

      {/* TRUCK (with headlight beam) */}
      <div className="hw-anim absolute" style={{
        bottom: "7%",
        animation: `hw-truck ${TRUCK_DUR}s linear -2s infinite`,
      }}>
        {/* Headlight beam cone (night) */}
        {!isDay && (
          <div style={{
            position:"absolute", left:-290, top:-15,
            width:290, height:155,
            background:"linear-gradient(270deg,rgba(255,244,196,0.30) 0%,rgba(255,244,196,0.06) 75%,transparent 100%)",
            clipPath:"polygon(100% 28%,100% 72%,0 100%,0 0)",
          }} />
        )}
        <TruckSVG isDay={isDay} />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background:"radial-gradient(ellipse at 50% 50%,transparent 32%,rgba(0,0,0,0.52) 100%)",
      }} />
    </div>
  );
}
