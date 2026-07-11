"use client";

import { useEffect, useRef } from "react";

type Props = {
  planets: string[];
  active: number;
  setActive: (i: number) => void;
};

/**
 * Lightweight orbital ecosystem. Products orbit a central intelligence core;
 * hovering a planet selects it. Pure DOM + one rAF loop — no WebGL.
 */
export default function EcosystemGalaxy({ planets, active, setActive }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    const n = planets.length;
    const paused = { v: false };
    const onEnter = () => (paused.v = true);
    const onLeave = () => (paused.v = false);
    stage.addEventListener("mouseenter", onEnter);
    stage.addEventListener("mouseleave", onLeave);

    let angle = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      if (!paused.v) angle += dt * 0.12;
      const R = stage.clientWidth;
      const cx = R / 2;
      const cy = R / 2;
      for (let i = 0; i < n; i++) {
        const el = planetRefs.current[i];
        if (!el) continue;
        // three orbital rings
        const ring = i % 3;
        const radius = R * (0.2 + ring * 0.13);
        const a = angle * (1 - ring * 0.22) + (i / n) * Math.PI * 2;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius * 0.9;
        const isActive = activeRef.current === i;
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${isActive ? 1.5 : 1})`;
        el.style.zIndex = isActive ? "5" : "2";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("mouseenter", onEnter);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [planets.length]);

  return (
    <div
      ref={stageRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 520,
        margin: "0 auto",
      }}
    >
      {/* orbit rings */}
      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${(0.4 + ring * 0.26) * 100}%`,
            height: `${(0.4 + ring * 0.26) * 90}%`,
            transform: "translate(-50%, -50%)",
            border: "1px solid var(--fog)",
            borderRadius: "50%",
          }}
        />
      ))}

      {/* central intelligence core */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "22%",
          height: "22%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 0 60px 10px rgba(232,201,143,0.18)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/ai-core.webp"
          alt="Intelligence core"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* planets */}
      {planets.map((p, i) => (
        <button
          key={p}
          ref={(el) => {
            planetRefs.current[i] = el;
          }}
          data-hover
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          aria-label={p}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: "none",
            background: active === i ? "var(--champagne)" : "var(--platinum)",
            boxShadow:
              active === i ? "0 0 16px 3px rgba(232,201,143,0.6)" : "0 0 8px rgba(243,242,239,0.3)",
            transition: "background .3s, box-shadow .3s",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
