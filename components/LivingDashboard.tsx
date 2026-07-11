"use client";

import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setSeen(e.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

const AGENTS = [
  { name: "Broker AI", metric: "deals", base: 128 },
  { name: "Voice AI", metric: "calls", base: 47 },
  { name: "Automation", metric: "runs", base: 1420 },
  { name: "Documents", metric: "parsed", base: 863 },
];

/**
 * A living command surface — not a screenshot. Revenue climbs, throughput
 * breathes like real telemetry, agents report in. Every motion is a signal.
 */
export default function LivingDashboard() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [revenue, setRevenue] = useState(0);
  const [counts, setCounts] = useState(AGENTS.map((a) => a.base));
  const barsRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<SVGPolylineElement>(null);

  // revenue + agent counters climb while in view
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const el = (now - start) / 1000;
      setRevenue(2.4 + el * 0.006 + Math.sin(el * 0.8) * 0.004);
      setCounts(
        AGENTS.map(
          (a, i) => a.base + Math.floor(el * (0.6 + i * 0.4))
        )
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  // live bar chart — throughput telemetry
  useEffect(() => {
    if (!seen) return;
    const wrap = barsRef.current;
    const spark = sparkRef.current;
    if (!wrap) return;
    const bars = Array.from(wrap.children) as HTMLElement[];
    let raf = 0;
    const draw = () => {
      const t = performance.now() / 1000;
      bars.forEach((b, i) => {
        const v =
          (Math.sin(t * 0.9 + i * 0.7) * 0.5 + 0.5) * 0.6 +
          (Math.sin(t * 0.4 + i) * 0.5 + 0.5) * 0.4;
        b.style.height = `${18 + v * 82}%`;
      });
      if (spark) {
        const pts: string[] = [];
        for (let i = 0; i <= 40; i++) {
          const x = (i / 40) * 100;
          const y =
            30 - Math.sin(t * 0.7 + i * 0.35) * 8 - Math.sin(i * 0.6) * 4;
          pts.push(`${x},${y}`);
        }
        spark.setAttribute("points", pts.join(" "));
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        aspectRatio: "16 / 10",
        borderRadius: 8,
        border: "1px solid var(--fog-strong)",
        background:
          "linear-gradient(180deg, rgba(22,22,26,0.9), rgba(11,11,14,0.9))",
        backdropFilter: "blur(8px)",
        padding: "clamp(1.1rem, 2.4vw, 2rem)",
        display: "grid",
        gridTemplateColumns: "1.3fr 1fr",
        gridTemplateRows: "auto 1fr auto",
        gap: "clamp(0.8rem, 1.6vw, 1.4rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="eyebrow">Monarch OS · live</span>
        <span
          className="font-mono"
          style={{ fontSize: "0.62rem", color: "var(--champagne)", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--champagne)", boxShadow: "0 0 8px var(--champagne)" }} />
          ALL SYSTEMS NOMINAL
        </span>
      </div>

      {/* revenue + sparkline */}
      <div
        style={{
          border: "1px solid var(--fog)",
          borderRadius: 6,
          padding: "clamp(0.9rem, 1.8vw, 1.4rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
            Orchestrated revenue
          </p>
          <p
            className="font-display"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            ${revenue.toFixed(3)}
            <span style={{ fontSize: "0.4em", color: "var(--titanium)" }}>B</span>
          </p>
        </div>
        <svg viewBox="0 0 100 34" preserveAspectRatio="none" style={{ width: "100%", height: 40, marginTop: "0.8rem" }}>
          <polyline
            ref={sparkRef}
            points=""
            fill="none"
            stroke="var(--champagne)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* throughput bars */}
      <div
        style={{
          border: "1px solid var(--fog)",
          borderRadius: 6,
          padding: "clamp(0.9rem, 1.8vw, 1.4rem)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p className="eyebrow" style={{ marginBottom: "0.8rem" }}>
          Throughput
        </p>
        <div
          ref={barsRef}
          style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "5%", minHeight: 60 }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "20%",
                background:
                  i === 8 ? "var(--champagne)" : "rgba(243,242,239,0.25)",
                borderRadius: 2,
                transition: "height .18s linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* agent row */}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(0.5rem, 1.4vw, 1rem)",
        }}
      >
        {AGENTS.map((a, i) => (
          <div
            key={a.name}
            style={{
              border: "1px solid var(--fog)",
              borderRadius: 6,
              padding: "0.7rem 0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--champagne)" }} />
              <span className="eyebrow" style={{ letterSpacing: "0.16em", fontSize: "0.56rem" }}>
                {a.name}
              </span>
            </div>
            <p className="font-display" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", fontWeight: 400 }}>
              {counts[i].toLocaleString()}
            </p>
            <p className="font-mono" style={{ fontSize: "0.56rem", color: "var(--titanium-dim)" }}>
              {a.metric}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
