"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "MONARCH";

export default function Arrival() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = mediaRef.current;
    const onScroll = () => {
      const y = window.scrollY;
      const p = Math.min(y / window.innerHeight, 1);
      if (media) {
        // scroll "into" the sphere — scale up + fade
        media.style.transform = `scale(${1 + p * 0.45})`;
        media.style.opacity = `${1 - p * 0.8}`;
        media.style.filter = `blur(${p * 6}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setReady(true), 200);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      style={{
        position: "relative",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* hero media — liquid sphere film (falls back to still) */}
      <div
        ref={mediaRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          willChange: "transform, opacity, filter",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/hero-sphere.webp"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: ready ? 1 : 0,
            transform: ready ? "scale(1)" : "scale(1.08)",
            transition:
              "opacity 2.4s var(--ease-cine), transform 3s var(--ease-cine)",
          }}
        >
          <source src="/assets/hero-loop.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(130% 90% at 50% 45%, transparent 38%, rgba(5,5,6,0.6) 100%), linear-gradient(to bottom, rgba(5,5,6,0.45) 0%, transparent 32%, transparent 62%, rgba(5,5,6,0.92) 100%)",
          }}
        />
      </div>

      {/* wordmark */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          transform: "translateY(-1vh)",
          mixBlendMode: "difference",
        }}
      >
        <div
          className="eyebrow"
          style={{
            marginBottom: "clamp(1.2rem, 3vh, 2.4rem)",
            opacity: ready ? 1 : 0,
            transition: "opacity 1.6s var(--ease-cine) .5s",
          }}
        >
          The physical form of intelligence
        </div>

        <h1
          className="display-xl font-display"
          aria-label={WORD}
          style={{ display: "flex", justifyContent: "center", gap: "0.01em" }}
        >
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: ready ? 1 : 0,
                transform: ready ? "translateY(0)" : "translateY(0.5em)",
                filter: ready ? "blur(0)" : "blur(16px)",
                transition: `opacity 1.5s var(--ease-cine) ${
                  0.6 + i * 0.1
                }s, transform 1.7s var(--ease-cine) ${
                  0.6 + i * 0.1
                }s, filter 1.7s var(--ease-cine) ${0.6 + i * 0.1}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div
          className="font-display"
          style={{
            marginTop: "clamp(1rem, 2.4vh, 2rem)",
            fontSize: "clamp(0.9rem, 1.1vw, 1.15rem)",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "var(--titanium)",
            opacity: ready ? 1 : 0,
            transition: "opacity 1.6s var(--ease-cine) 1.7s",
          }}
        >
          Not a company. A civilization.
        </div>
      </div>

      {/* scroll cue */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(1.6rem, 4vh, 3rem)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.8rem",
          opacity: ready ? 0.7 : 0,
          transition: "opacity 1.6s var(--ease-cine) 2s",
        }}
      >
        <span className="eyebrow">Enter</span>
        <span
          style={{
            width: "1px",
            height: "44px",
            background:
              "linear-gradient(to bottom, var(--titanium), transparent)",
            animation: "cueDrop 2.6s var(--ease-cine) infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes cueDrop {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          60% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
