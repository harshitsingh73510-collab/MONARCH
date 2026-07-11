"use client";

import { useEffect, useRef, useState } from "react";

const STAGES = [
  { n: "01", name: "Discover", line: "We learn your world." },
  { n: "02", name: "Question", line: "We kill every assumption." },
  { n: "03", name: "Imagine", line: "We design the impossible version." },
  { n: "04", name: "Prototype", line: "We make it move — early." },
  { n: "05", name: "Engineer", line: "We build it to last." },
  { n: "06", name: "Perfect", line: "We obsess over the final one percent." },
  { n: "07", name: "Launch", line: "We make the world remember." },
];

export default function Process() {
  const wrapRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const p = Math.min(0.9999, Math.max(0, -r.top / total));
      if (spineRef.current) spineRef.current.style.transform = `scaleY(${p})`;
      setActive(Math.floor(p * STAGES.length));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      id="process"
      style={{ position: "relative", height: `${STAGES.length * 62}vh`, zIndex: 2 }}
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
        {/* giant ghost numeral behind everything */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "clamp(-4vw, -2vw, 0px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {STAGES.map((s, i) => (
            <span
              key={s.n}
              className="font-display"
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: `translateY(-50%) scale(${i === active ? 1 : 0.86})`,
                fontSize: "min(46vh, 40vw)",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(243,242,239,0.07)",
                opacity: i === active ? 1 : 0,
                transition: "opacity .9s var(--ease-cine), transform 1.1s var(--ease-cine)",
              }}
            >
              {s.n}
            </span>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "84rem", margin: "0 auto", width: "100%" }}>
          <p className="eyebrow" style={{ marginBottom: "clamp(2rem,5vh,4rem)" }}>
            04 — The process
          </p>

          <div style={{ display: "flex", gap: "clamp(2rem, 6vw, 6rem)", alignItems: "stretch" }}>
            {/* progress spine that fills */}
            <div className="proc-rail" style={{ display: "flex", gap: "1.4rem" }}>
              <div style={{ position: "relative", width: 1, background: "var(--fog)", alignSelf: "stretch" }}>
                <div
                  ref={spineRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--champagne)",
                    transformOrigin: "top",
                    transform: "scaleY(0)",
                    boxShadow: "0 0 12px rgba(232,201,143,0.6)",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {STAGES.map((s, i) => (
                  <span
                    key={s.n}
                    className="eyebrow"
                    style={{
                      color: i === active ? "var(--platinum)" : "var(--titanium-dim)",
                      transform: i === active ? "translateX(4px)" : "none",
                      transition: "color .5s, transform .5s var(--ease-cine)",
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* active stage */}
            <div style={{ flex: 1, position: "relative", minHeight: "44vh", display: "flex", alignItems: "center" }}>
              {STAGES.map((s, i) => (
                <div
                  key={s.n}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    inset: i === 0 ? undefined : 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "translateY(0)" : "translateY(30px)",
                    filter: i === active ? "blur(0)" : "blur(6px)",
                    transition:
                      "opacity .8s var(--ease-cine), transform .9s var(--ease-cine), filter .8s var(--ease-cine)",
                    pointerEvents: "none",
                  }}
                >
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "clamp(2.6rem, 7vw, 6rem)",
                      fontWeight: 300,
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      marginBottom: "1.6rem",
                    }}
                  >
                    {s.name}
                  </h3>
                  {/* drawn underline */}
                  <span
                    style={{
                      display: "block",
                      height: 1,
                      width: i === active ? "clamp(3rem, 8vw, 7rem)" : 0,
                      background: "var(--champagne)",
                      marginBottom: "1.6rem",
                      transition: "width 1s var(--ease-cine) .2s",
                    }}
                  />
                  <p className="lede" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.5rem)", maxWidth: "26ch", color: "var(--platinum)" }}>
                    {s.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) { #process .proc-rail { display: none !important; } }
      `}</style>
    </section>
  );
}
