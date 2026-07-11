"use client";

import { useEffect, useRef, useState } from "react";
import MediaSlot from "@/components/MediaSlot";

/* ---------- small live visuals ---------- */

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

function RevenueGraph() {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        border: "1px solid var(--fog)",
        borderRadius: 4,
        background:
          "linear-gradient(180deg, rgba(232,201,143,0.04), transparent)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg viewBox="0 0 400 225" style={{ width: "100%", height: "100%" }}>
        {[45, 90, 135, 180].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(243,242,239,0.06)" />
        ))}
        <path
          d="M0 200 C60 190 90 150 140 140 C190 130 210 90 260 70 C310 50 340 40 400 20"
          fill="none"
          stroke="var(--champagne)"
          strokeWidth="2"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: seen ? 0 : 600,
            transition: "stroke-dashoffset 2.2s var(--ease-cine)",
          }}
        />
        <path
          d="M0 200 C60 190 90 150 140 140 C190 130 210 90 260 70 C310 50 340 40 400 20 L400 225 L0 225 Z"
          fill="url(#g)"
          opacity={seen ? 0.5 : 0}
          style={{ transition: "opacity 2s var(--ease-cine) .4s" }}
        />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(232,201,143,0.35)" />
            <stop offset="1" stopColor="rgba(232,201,143,0)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="eyebrow" style={{ position: "absolute", top: 14, left: 16 }}>
        Revenue · live
      </span>
    </div>
  );
}

function WorkflowNodes() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const nodes = [
    [40, 60],
    [40, 165],
    [160, 112],
    [280, 60],
    [280, 165],
    [360, 112],
  ];
  const links = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
  ];
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        border: "1px solid var(--fog)",
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        background: "var(--obsidian)",
      }}
    >
      <svg viewBox="0 0 400 225" style={{ width: "100%", height: "100%" }}>
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="var(--champagne)"
            strokeWidth="1"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: seen ? 0 : 200,
              opacity: 0.6,
              transition: `stroke-dashoffset 1.2s var(--ease-cine) ${0.3 + i * 0.18}s`,
            }}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="6"
            fill="var(--void)"
            stroke="var(--platinum)"
            strokeWidth="1.4"
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "scale(1)" : "scale(0)",
              transformOrigin: `${x}px ${y}px`,
              transition: `opacity .5s var(--ease-cine) ${i * 0.12}s, transform .6s var(--ease-cine) ${i * 0.12}s`,
            }}
          />
        ))}
      </svg>
      <span className="eyebrow" style={{ position: "absolute", top: 14, left: 16 }}>
        Automation · connecting
      </span>
    </div>
  );
}

function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, seen } = useInView<HTMLDivElement>();
  useEffect(() => {
    if (!seen) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const bars = 64;
    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() / 1000;
      const bw = w / bars;
      for (let i = 0; i < bars; i++) {
        const env = Math.sin((i / bars) * Math.PI); // taper ends
        const amp =
          (Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5) *
          (Math.sin(t * 1.3 + i * 0.2) * 0.5 + 0.5) *
          env;
        const bh = 4 + amp * (h * 0.7);
        ctx.fillStyle = `rgba(232,201,143,${0.25 + amp * 0.55})`;
        ctx.fillRect(i * bw + bw * 0.25, (h - bh) / 2, bw * 0.5, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [seen]);
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        border: "1px solid var(--fog)",
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        background: "var(--obsidian)",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      <span className="eyebrow" style={{ position: "absolute", top: 14, left: 16 }}>
        Voice · transcribing
      </span>
    </div>
  );
}

/* ---------- screens ---------- */

const SCREENS = [
  {
    n: "01",
    title: "Broker Intelligence",
    copy: "In Dubai, a deal never sleeps. Agents qualify, follow up and close — reading every conversation, forgetting nothing.",
    kind: "media",
    src: "/assets/dubai.webp",
    label: "Broker AI · Dubai",
  },
  {
    n: "02",
    title: "Executive Dashboard",
    copy: "The whole company as one number, computed continuously. Revenue doesn’t get reported. It gets watched.",
    kind: "graph",
  },
  {
    n: "03",
    title: "Automation Engine",
    copy: "Nodes connect themselves. Data flows, emails send, the CRM updates, the calendar fills — no hand on the wheel.",
    kind: "nodes",
  },
  {
    n: "04",
    title: "Voice AI",
    copy: "Calls answered, understood, acted on. Transcribed and routed the moment they end.",
    kind: "wave",
  },
  {
    n: "05",
    title: "Document Intelligence",
    copy: "Contracts and invoices pulled apart, understood, and reorganized into structured, queryable truth.",
    kind: "media",
    src: "/assets/ai-core.webp",
    label: "Document Intelligence · extraction",
  },
] as const;

function Screen({ s, i }: { s: (typeof SCREENS)[number]; i: number }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const flip = i % 2 === 1;
  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)",
        gap: "clamp(2rem, 5vw, 5rem)",
        alignItems: "center",
        minHeight: "82vh",
        direction: flip ? "rtl" : "ltr",
      }}
      className="intel-screen"
    >
      <div style={{ direction: "ltr" }}>
        <p
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: 300,
            color: "var(--titanium-dim)",
            lineHeight: 1,
            opacity: seen ? 1 : 0,
            transform: seen ? "none" : "translateY(20px)",
            transition: "opacity 1s var(--ease-cine), transform 1s var(--ease-cine)",
          }}
        >
          {s.n}
        </p>
        <h3
          className="display-md font-display"
          style={{
            margin: "1rem 0 1.4rem",
            opacity: seen ? 1 : 0,
            transform: seen ? "none" : "translateY(20px)",
            transition:
              "opacity 1s var(--ease-cine) .1s, transform 1s var(--ease-cine) .1s",
          }}
        >
          {s.title}
        </h3>
        <p
          className="lede"
          style={{
            maxWidth: "34ch",
            opacity: seen ? 1 : 0,
            transform: seen ? "none" : "translateY(20px)",
            transition:
              "opacity 1s var(--ease-cine) .2s, transform 1s var(--ease-cine) .2s",
          }}
        >
          {s.copy}
        </p>
      </div>

      <div style={{ direction: "ltr" }}>
        {s.kind === "media" && "src" in s ? (
          <MediaSlot src={s.src} label={s.label} ratio="16 / 9" parallax={24} />
        ) : s.kind === "graph" ? (
          <RevenueGraph />
        ) : s.kind === "nodes" ? (
          <WorkflowNodes />
        ) : (
          <Waveform />
        )}
      </div>
    </div>
  );
}

export default function Intelligence() {
  return (
    <section
      id="intelligence"
      className="section"
      style={{ paddingBlock: "18vh", position: "relative", zIndex: 2 }}
    >
      <div style={{ maxWidth: "84rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "8vh" }}>
          <p className="eyebrow" style={{ marginBottom: "1.4rem" }}>
            005 — Scroll through intelligence
          </p>
          <h2 className="display-md font-display" style={{ maxWidth: "18ch", margin: "0 auto" }}>
            Every faculty of the company. Alive.
          </h2>
        </div>

        {SCREENS.map((s, i) => (
          <Screen key={s.n} s={s} i={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .intel-screen { grid-template-columns: 1fr !important; direction: ltr !important; min-height: auto !important; gap: 1.6rem !important; margin-bottom: 12vh; }
        }
      `}</style>
    </section>
  );
}
