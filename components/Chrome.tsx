"use client";

import { useEffect, useRef, useState } from "react";

export default function Chrome() {
  const barRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.4rem clamp(1.5rem, 5vw, 4rem)",
        pointerEvents: "none",
      }}
    >
      <a
        href="#top"
        className="font-display"
        style={{
          pointerEvents: "auto",
          letterSpacing: "0.42em",
          fontSize: "0.82rem",
          fontWeight: 500,
          color: "var(--platinum)",
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? "none" : "translateY(-6px)",
          transition: "opacity .8s var(--ease-cine), transform .8s var(--ease-cine)",
        }}
      >
        MONARCH
      </a>

      <nav
        className="eyebrow"
        style={{
          pointerEvents: "auto",
          display: "flex",
          gap: "clamp(1rem, 2vw, 2.4rem)",
        }}
      >
        <a href="#work" data-hover style={{ color: "var(--titanium)" }}>
          Work
        </a>
        <a href="#contact" data-hover style={{ color: "var(--titanium)" }}>
          Start a project
        </a>
      </nav>

      {/* scroll progress */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "1px",
          width: "100%",
          background: "var(--fog)",
          transformOrigin: "0 50%",
        }}
      >
        <div
          ref={barRef}
          style={{
            height: "100%",
            width: "100%",
            background: "var(--champagne)",
            transformOrigin: "0 50%",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </header>
  );
}
