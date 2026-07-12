"use client";

/**
 * Seven bespoke animated line-art graphics — one per process stage.
 * Pure SVG + CSS keyframes (crisp, scalable, cheap). Platinum strokes,
 * champagne accents, soft glow. Only the active one is shown by the parent.
 */

const P = "rgba(243,242,239,0.55)";
const PD = "rgba(243,242,239,0.18)";
const C = "#e8c98f";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 200"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      fill="none"
    >
      {children}
    </svg>
  );
}

function Discover() {
  return (
    <Frame>
      {[30, 55, 80].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} stroke={PD} strokeWidth="0.6" />
      ))}
      <line x1="100" y1="12" x2="100" y2="188" stroke={PD} strokeWidth="0.5" />
      <line x1="12" y1="100" x2="188" y2="100" stroke={PD} strokeWidth="0.5" />
      <g className="pg-spin" style={{ transformOrigin: "100px 100px" }}>
        <path d="M100 100 L100 20 A80 80 0 0 1 156 44 Z" fill="url(#sweep)" opacity="0.5" />
        <line x1="100" y1="100" x2="100" y2="20" stroke={C} strokeWidth="1" />
      </g>
      <circle cx="140" cy="72" r="2.5" fill={C} className="pg-blip" style={{ filter: `drop-shadow(0 0 4px ${C})` }} />
      <circle cx="72" cy="132" r="2" fill={P} className="pg-blip" style={{ animationDelay: "1.2s" }} />
      <circle cx="118" cy="150" r="1.8" fill={P} className="pg-blip" style={{ animationDelay: "2s" }} />
      <defs>
        <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C} stopOpacity="0.35" />
          <stop offset="1" stopColor={C} stopOpacity="0" />
        </linearGradient>
      </defs>
    </Frame>
  );
}

function Question() {
  const nodes = [
    [40, 45], [160, 55], [35, 150], [165, 145], [100, 30], [100, 175],
  ];
  return (
    <Frame>
      {nodes.map(([x, y], i) => (
        <line
          key={i}
          x1="100"
          y1="100"
          x2={x}
          y2={y}
          stroke={i === 1 ? C : PD}
          strokeWidth={i === 1 ? "1" : "0.6"}
          className="pg-draw"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 1 ? 4 : 2.4}
          fill={i === 1 ? C : "var(--void)"}
          stroke={i === 1 ? C : P}
          strokeWidth="1"
          className={i === 1 ? "pg-pulse" : "pg-fade"}
          style={{ filter: i === 1 ? `drop-shadow(0 0 6px ${C})` : "none", animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <circle cx="100" cy="100" r="5" fill="var(--void)" stroke={P} strokeWidth="1.2" />
    </Frame>
  );
}

function Imagine() {
  return (
    <Frame>
      <g className="pg-spin-slow" style={{ transformOrigin: "100px 100px" }}>
        <path
          d="M100 30 C150 45 170 90 150 140 C130 180 70 180 50 140 C30 90 50 45 100 30 Z"
          stroke={P}
          strokeWidth="0.7"
          className="pg-draw-loop"
        />
        <path
          d="M100 55 C135 65 148 100 132 132 C118 158 82 158 68 132 C52 100 65 65 100 55 Z"
          stroke={C}
          strokeWidth="0.8"
          className="pg-draw-loop"
          style={{ animationDelay: "0.6s", filter: `drop-shadow(0 0 4px ${C})` }}
        />
      </g>
      <circle cx="100" cy="100" r="3" fill={C} className="pg-pulse" style={{ filter: `drop-shadow(0 0 6px ${C})` }} />
    </Frame>
  );
}

function Prototype() {
  // isometric cube edges drawing in
  const edges = [
    "M60 70 L100 50", "M100 50 L140 70", "M60 70 L60 130", "M140 70 L140 130",
    "M60 130 L100 150", "M100 150 L140 130", "M100 50 L100 110",
    "M60 70 L100 110", "M140 70 L100 110", "M100 110 L100 150",
  ];
  return (
    <Frame>
      {edges.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i > 5 ? C : P}
          strokeWidth={i > 5 ? "0.9" : "0.7"}
          className="pg-draw"
          style={{ animationDelay: `${i * 0.18}s`, filter: i > 5 ? `drop-shadow(0 0 3px ${C})` : "none" }}
        />
      ))}
      {[[60, 70], [100, 50], [140, 70], [60, 130], [140, 130], [100, 150], [100, 110]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={P} className="pg-fade" style={{ animationDelay: `${1 + i * 0.1}s` }} />
      ))}
    </Frame>
  );
}

function Engineer() {
  const pts: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) pts.push([44 + c * 37, 44 + r * 37]);
  return (
    <Frame>
      {pts.map(([x, y], i) => {
        const right = (i % 4) < 3 ? pts[i + 1] : null;
        const down = i < 12 ? pts[i + 4] : null;
        return (
          <g key={i}>
            {right && <line x1={x} y1={y} x2={right[0]} y2={right[1]} stroke={PD} strokeWidth="0.5" className="pg-draw" style={{ animationDelay: `${i * 0.08}s` }} />}
            {down && <line x1={x} y1={y} x2={down[0]} y2={down[1]} stroke={PD} strokeWidth="0.5" className="pg-draw" style={{ animationDelay: `${i * 0.08}s` }} />}
          </g>
        );
      })}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 || i === 10 ? 2.6 : 1.6} fill={i === 5 || i === 10 ? C : P} className="pg-pulse" style={{ animationDelay: `${i * 0.12}s`, filter: i === 5 || i === 10 ? `drop-shadow(0 0 4px ${C})` : "none" }} />
      ))}
    </Frame>
  );
}

function Perfect() {
  return (
    <Frame>
      <g className="pg-spin" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="100" r="70" stroke={PD} strokeWidth="0.6" strokeDasharray="4 8" />
      </g>
      <g className="pg-spin-rev" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="100" r="52" stroke={PD} strokeWidth="0.6" strokeDasharray="2 10" />
      </g>
      <circle cx="100" cy="100" r="34" stroke={C} strokeWidth="1" className="pg-ring" style={{ filter: `drop-shadow(0 0 6px ${C})` }} />
      {/* reticle */}
      <line x1="100" y1="55" x2="100" y2="70" stroke={P} strokeWidth="0.8" />
      <line x1="100" y1="130" x2="100" y2="145" stroke={P} strokeWidth="0.8" />
      <line x1="55" y1="100" x2="70" y2="100" stroke={P} strokeWidth="0.8" />
      <line x1="130" y1="100" x2="145" y2="100" stroke={P} strokeWidth="0.8" />
      <circle cx="100" cy="100" r="3" fill={C} className="pg-pulse" style={{ filter: `drop-shadow(0 0 6px ${C})` }} />
    </Frame>
  );
}

function Launch() {
  return (
    <Frame>
      {[70, 100, 130].map((x, i) => (
        <line key={x} x1={x} y1="180" x2={x} y2="20" stroke={i === 1 ? "url(#beam)" : PD} strokeWidth={i === 1 ? "1.4" : "0.6"} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} className="pg-rise" style={{ animationDelay: `${i * 0.5}s` }}>
          <path d={`M84 150 L100 138 L116 150`} stroke={C} strokeWidth="1" style={{ filter: `drop-shadow(0 0 4px ${C})` }} />
        </g>
      ))}
      {[[70, 120], [130, 90], [100, 60], [70, 50], [130, 150]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill={P} className="pg-rise-dot" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      <defs>
        <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={C} stopOpacity="0" />
          <stop offset="1" stopColor={C} stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </Frame>
  );
}

const GRAPHICS = [Discover, Question, Imagine, Prototype, Engineer, Perfect, Launch];

export default function ProcessGraphic({ active }: { active: number }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", maxWidth: 420, margin: "0 auto" }}>
      {GRAPHICS.map((G, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === active ? 1 : 0,
            transform: i === active ? "scale(1)" : "scale(0.92)",
            transition: "opacity .7s var(--ease-cine), transform .9s var(--ease-cine)",
            pointerEvents: "none",
          }}
        >
          {i === active && <G />}
        </div>
      ))}

      <style>{`
        @keyframes pgSpin { to { transform: rotate(360deg); } }
        @keyframes pgSpinRev { to { transform: rotate(-360deg); } }
        .pg-spin { animation: pgSpin 6s linear infinite; }
        .pg-spin-slow { animation: pgSpin 22s linear infinite; }
        .pg-spin-rev { animation: pgSpinRev 14s linear infinite; }
        @keyframes pgBlip { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .pg-blip { animation: pgBlip 3s ease-in-out infinite; }
        @keyframes pgDraw { from { stroke-dasharray: 260; stroke-dashoffset: 260; } to { stroke-dasharray: 260; stroke-dashoffset: 0; } }
        .pg-draw { animation: pgDraw 1.2s var(--ease-cine) forwards; }
        @keyframes pgDrawLoop { 0% { stroke-dasharray: 520; stroke-dashoffset: 520; } 60%,100% { stroke-dasharray: 520; stroke-dashoffset: 0; } }
        .pg-draw-loop { animation: pgDrawLoop 4s var(--ease-cine) infinite; }
        @keyframes pgPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .pg-pulse { animation: pgPulse 2.4s ease-in-out infinite; }
        @keyframes pgFade { from { opacity: 0; } to { opacity: 1; } }
        .pg-fade { opacity: 0; animation: pgFade .8s var(--ease-cine) forwards; }
        @keyframes pgRing { 0% { transform: scale(0.9); opacity: 0.4; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.4; } }
        .pg-ring { transform-origin: 100px 100px; animation: pgRing 3.5s ease-in-out infinite; }
        @keyframes pgRise { 0% { transform: translateY(30px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(-70px); opacity: 0; } }
        .pg-rise { animation: pgRise 2.5s var(--ease-cine) infinite; }
        @keyframes pgRiseDot { 0% { transform: translateY(20px); opacity: 0; } 40% { opacity: 1; } 100% { transform: translateY(-40px); opacity: 0; } }
        .pg-rise-dot { animation: pgRiseDot 3s var(--ease-cine) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pg-spin, .pg-spin-slow, .pg-spin-rev, .pg-blip, .pg-draw-loop, .pg-pulse, .pg-ring, .pg-rise, .pg-rise-dot { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
