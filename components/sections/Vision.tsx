"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  "We don’t believe AI replaces humans.",
  "We believe intelligence deserves infrastructure.",
  "Monarch is building it.",
];

export default function Vision() {
  const wrapRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap) return;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const p = Math.min(1, Math.max(0, -r.top / total));
      if (img) img.style.transform = `scale(${1.05 + p * 0.2}) translateY(${p * -30}px)`;
      setStage(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={wrapRef}
      id="vision"
      style={{ position: "relative", height: "320vh", zIndex: 2 }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={imgRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/vision-sunrise.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 60%, transparent 20%, rgba(5,5,6,0.75) 100%)",
          }}
        />

        <div
          className="section"
          style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "24ch" }}
        >
          {LINES.map((line, i) => (
            <h2
              key={i}
              className="display-lg font-display"
              style={{
                position: i === 0 ? "relative" : "absolute",
                inset: i === 0 ? undefined : 0,
                margin: "auto",
                height: "fit-content",
                opacity: stage === i ? 1 : 0,
                transform: stage === i ? "translateY(0)" : "translateY(24px)",
                filter: stage === i ? "blur(0)" : "blur(10px)",
                transition:
                  "opacity 1.2s var(--ease-cine), transform 1.2s var(--ease-cine), filter 1.2s var(--ease-cine)",
              }}
            >
              {i === 1 ? (
                <>
                  We believe intelligence deserves{" "}
                  <span className="text-champagne">infrastructure.</span>
                </>
              ) : (
                line
              )}
            </h2>
          ))}
        </div>
      </div>
    </section>
  );
}
