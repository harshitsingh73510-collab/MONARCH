"use client";

import { useEffect, useRef, useState } from "react";

const STAGES = [
  { n: "01", name: "Discover", line: "We learn your world before we touch a pixel." },
  { n: "02", name: "Question", line: "We challenge the brief until only the truth is left." },
  { n: "03", name: "Imagine", line: "We design the version that shouldn’t be possible." },
  { n: "04", name: "Prototype", line: "We make it move early, so we can feel it, not guess." },
  { n: "05", name: "Engineer", line: "We build it to run flawlessly, everywhere, forever." },
  { n: "06", name: "Perfect", line: "We obsess over the last five percent no one asked for." },
  { n: "07", name: "Launch", line: "We open the doors to something the world remembers." },
];

export default function Process() {
  const wrapRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const p = Math.min(0.999, Math.max(0, -r.top / total));
      setActive(Math.floor(p * STAGES.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={wrapRef}
      id="process"
      style={{ position: "relative", height: `${STAGES.length * 60}vh`, zIndex: 2 }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
        className="section"
      >
        <div style={{ maxWidth: "84rem", margin: "0 auto", width: "100%" }}>
          <p className="eyebrow" style={{ marginBottom: "clamp(2rem,5vh,4rem)" }}>
            03 — How we work
          </p>

          <div style={{ display: "flex", gap: "clamp(2rem, 6vw, 6rem)", alignItems: "flex-start" }}>
            {/* progress rail */}
            <div
              className="proc-rail"
              style={{ display: "flex", flexDirection: "column", gap: "1.1rem", paddingTop: "0.6rem" }}
            >
              {STAGES.map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                  <span
                    style={{
                      width: i === active ? 28 : 12,
                      height: 1,
                      background: i === active ? "var(--champagne)" : "var(--fog-strong)",
                      transition: "width .5s var(--ease-cine), background .5s",
                    }}
                  />
                  <span
                    className="eyebrow"
                    style={{
                      color: i === active ? "var(--platinum)" : "var(--titanium-dim)",
                      transition: "color .5s",
                    }}
                  >
                    {s.name}
                  </span>
                </div>
              ))}
            </div>

            {/* active stage */}
            <div style={{ flex: 1, position: "relative", minHeight: "40vh" }}>
              {STAGES.map((s, i) => (
                <div
                  key={s.n}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    inset: i === 0 ? undefined : 0,
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "translateY(0)" : "translateY(24px)",
                    filter: i === active ? "blur(0)" : "blur(8px)",
                    transition:
                      "opacity .8s var(--ease-cine), transform .8s var(--ease-cine), filter .8s var(--ease-cine)",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    className="font-display"
                    style={{
                      fontSize: "clamp(4rem, 12vw, 11rem)",
                      fontWeight: 300,
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                      color: "var(--titanium-dim)",
                    }}
                  >
                    {s.n}
                  </div>
                  <h3 className="display-md font-display" style={{ margin: "1rem 0 1.4rem" }}>
                    {s.name}
                  </h3>
                  <p className="lede" style={{ maxWidth: "34ch" }}>
                    {s.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) { .proc-rail { display: none !important; } }
      `}</style>
    </section>
  );
}
