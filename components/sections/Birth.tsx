"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  "Every company eventually becomes too complex for people.",
  "Monarch wasn’t built to automate work.",
  "It was built to orchestrate intelligence.",
];

export default function Birth() {
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
      // camera push into the corridor
      if (img) img.style.transform = `scale(${1.05 + p * 0.5})`;
      setStage(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={wrapRef}
      id="birth"
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
            willChange: "transform",
            backgroundImage: "url(/assets/birth-architecture.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 30%, rgba(5,5,6,0.7) 100%)",
          }}
        />

        <div
          className="section"
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: "44rem",
          }}
        >
          {LINES.map((line, i) => (
            <p
              key={i}
              className="display-md font-display"
              style={{
                position: i === 0 ? "relative" : "absolute",
                inset: i === 0 ? undefined : 0,
                margin: "auto",
                height: "fit-content",
                opacity: stage === i ? 1 : 0,
                transform: stage === i ? "translateY(0)" : "translateY(20px)",
                filter: stage === i ? "blur(0)" : "blur(8px)",
                transition:
                  "opacity 1s var(--ease-cine), transform 1s var(--ease-cine), filter 1s var(--ease-cine)",
                color: i === 2 ? "var(--platinum)" : "var(--platinum)",
              }}
            >
              {i === 2 ? (
                <>
                  It was built to{" "}
                  <span className="text-champagne">orchestrate intelligence.</span>
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
