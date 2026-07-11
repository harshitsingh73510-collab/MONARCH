"use client";

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        minHeight: "94svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingInline: "var(--pad)",
        overflow: "hidden",
      }}
    >
      <p
        className="eyebrow"
        style={{
          marginBottom: "clamp(2rem, 6vh, 4rem)",
          opacity: inView ? 0.8 : 0,
          transition: "opacity 1.4s var(--ease-cine) .2s",
        }}
      >
        The physical form of intelligence
      </p>

      {/* the finale — MONARCH converges out of blur with a champagne shine */}
      <h2
        aria-label="MONARCH"
        className="font-display finale-word"
        data-in={inView ? "1" : "0"}
        style={{
          fontSize: "min(19vw, 15rem)",
          fontWeight: 300,
          lineHeight: 0.9,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        MONARCH
      </h2>

      <div
        style={{
          marginTop: "clamp(3rem, 10vh, 7rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "84rem",
          borderTop: "1px solid var(--fog)",
          paddingTop: "2rem",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(16px)",
          transition: "opacity 1.4s var(--ease-cine) 1.1s, transform 1.4s var(--ease-cine) 1.1s",
        }}
      >
        <p className="eyebrow">Monarch — a digital experience studio</p>
        <a href="#contact" data-hover className="font-mono" style={{ color: "var(--titanium)", fontSize: "0.8rem", textDecoration: "none" }}>
          Start a project →
        </a>
        <p className="eyebrow" style={{ color: "var(--titanium-dim)" }}>
          © {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        .finale-word {
          letter-spacing: 0.5em;
          opacity: 0;
          filter: blur(24px);
          background: linear-gradient(
            100deg,
            var(--platinum) 0%, var(--platinum) 42%,
            var(--champagne) 50%,
            var(--platinum) 58%, var(--platinum) 100%
          );
          background-size: 260% 100%;
          background-position: 180% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          transition:
            letter-spacing 2.4s var(--ease-cine),
            opacity 2s var(--ease-cine),
            filter 2.2s var(--ease-cine);
        }
        .finale-word[data-in="1"] {
          letter-spacing: -0.03em;
          opacity: 1;
          filter: blur(0);
          animation: monarchShine 5.5s var(--ease-cine) 1.4s infinite;
        }
        @keyframes monarchShine {
          0% { background-position: 180% 0; }
          55%, 100% { background-position: -80% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .finale-word { transition: opacity .6s; filter: none; letter-spacing: -0.03em; }
          .finale-word[data-in="1"] { animation: none; }
        }
      `}</style>
    </footer>
  );
}
