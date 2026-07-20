"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const HeroCore = dynamic(() => import("@/components/webgl/HeroCore"), {
  ssr: false,
});

const WORD = "MONARCH";

export default function Arrival() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      if (stage) {
        // scroll "into" the core — scale up + fade
        stage.style.transform = `scale(${1 + p * 0.5})`;
        stage.style.opacity = `${1 - p * 0.85}`;
        stage.style.filter = `blur(${p * 5}px)`;
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
      id="top"
      data-cursor="hero"
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
      {/* the core stage: liquid-metal heart + particle intelligence field */}
      <div
        ref={stageRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          willChange: "transform, opacity, filter",
        }}
      >
        {/* luminous liquid-metal heart (masked to a soft orb) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "min(58vh, 62vw)",
            height: "min(58vh, 62vw)",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            overflow: "hidden",
            opacity: ready ? 0.9 : 0,
            transition: "opacity 2.6s var(--ease-cine)",
            maskImage:
              "radial-gradient(circle, black 52%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 52%, transparent 72%)",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/hero-sphere.webp"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src="/assets/hero-loop.mp4" type="video/mp4" />
          </video>
        </div>

        {/* soft aura */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "min(80vh, 84vw)",
            height: "min(80vh, 84vw)",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(232,201,143,0.10) 0%, transparent 60%)",
            filter: "blur(24px)",
          }}
        />

        {/* WebGL intelligence field */}
        <div style={{ position: "absolute", inset: 0 }}>
          <HeroCore />
        </div>
      </div>

      {/* wordmark */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          mixBlendMode: "difference",
          pointerEvents: "none",
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
          Digital experience studio
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
            fontSize: "clamp(0.95rem, 1.2vw, 1.25rem)",
            fontWeight: 300,
            letterSpacing: "0.06em",
            color: "var(--titanium)",
            opacity: ready ? 1 : 0,
            transition: "opacity 1.6s var(--ease-cine) 1.7s",
          }}
        >
          We engineer experiences the world can&apos;t forget.
        </div>

        <div
          style={{
            marginTop: "clamp(2rem, 4vh, 3rem)",
            display: "flex",
            gap: "1.2rem",
            justifyContent: "center",
            flexWrap: "wrap",
            pointerEvents: "auto",
            opacity: ready ? 1 : 0,
            transition: "opacity 1.6s var(--ease-cine) 2s",
          }}
        >
          <a href="#work" data-hover className="font-mono cta cta-primary">
            View selected work
          </a>
          <a href="#contact" data-hover className="font-mono cta cta-ghost">
            Start a project
          </a>
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
