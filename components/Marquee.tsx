"use client";

import { useEffect, useRef } from "react";
import {
  getScrollVelocity,
  prefersReducedMotion,
  subscribeScrollVelocity,
} from "@/lib/motion";

/**
 * A velocity-reactive kinetic band. Idles at a slow drift; scroll speed
 * accelerates it and skews the type — reading the SAME shared scroll-velocity
 * the hero core uses, so the whole page moves as one instrument.
 */
export default function Marquee({
  items = ["Monarch", "Digital experience studio", "We engineer the unforgettable"],
  baseSpeed = 0.35,
  direction = 1,
}: {
  items?: string[];
  baseSpeed?: number;
  direction?: 1 | -1;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = prefersReducedMotion();
    const unsub = subscribeScrollVelocity();

    let raf = 0;
    let offset = 0;
    let skew = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const vel = reduced ? 0 : getScrollVelocity();
      const speed = (baseSpeed + vel * 6) * direction;
      offset -= speed * dt * 100;

      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (offset <= -half) offset += half;
        if (offset > 0) offset -= half;
      }

      const targetSkew = reduced ? 0 : Math.max(-9, Math.min(9, vel * 9 * direction));
      skew += (targetSkew - skew) * Math.min(1, dt * 8);

      track.style.transform = `translate3d(${offset.toFixed(2)}px,0,0) skewX(${skew.toFixed(
        2
      )}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
    };
  }, [baseSpeed, direction]);

  // duplicated so the wrap by half-width is always seamless
  const seq = [...items, ...items];

  return (
    <div className="marquee" aria-hidden>
      <div ref={trackRef} className="marquee-track">
        {[...seq, ...seq].map((t, i) => (
          <span key={i} className="marquee-item font-display">
            {t}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
