"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 99.99, suffix: "%", label: "Uptime across live systems", decimals: 2 },
  { value: 4, suffix: "", label: "Autonomous systems in production", decimals: 0 },
  { value: 0, suffix: "", label: "Data leaving your infrastructure", decimals: 0 },
  { value: 24, suffix: "/7", label: "Intelligence that never sleeps", decimals: 0 },
];

function Counter({
  value,
  suffix,
  decimals,
}: {
  value: number;
  suffix: string;
  decimals: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function Proof() {
  return (
    <section
      id="proof"
      className="section"
      style={{ paddingBlock: "18vh", position: "relative", zIndex: 2 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "clamp(2rem, 4vw, 4rem)",
          maxWidth: "84rem",
          margin: "0 auto",
          borderTop: "1px solid var(--fog)",
          paddingTop: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        {STATS.map((s) => (
          <div key={s.label}>
            <div
              className="font-display"
              style={{
                fontSize: "clamp(2.6rem, 6vw, 5rem)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "var(--platinum)",
              }}
            >
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <p
              className="eyebrow"
              style={{ marginTop: "1.2rem", letterSpacing: "0.24em", maxWidth: "22ch" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
