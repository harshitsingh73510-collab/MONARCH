"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Wraps an interactive element so it leans toward the cursor within a radius,
 * then eases home. Moves the ELEMENT, never the cursor — the native pointer
 * stays fully visible. No-ops on coarse pointers / reduced motion.
 */
export default function Magnetic({
  children,
  strength = 0.4,
  radius = 90,
  className,
  style,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = r.left + r.width / 2;
      const my = r.top + r.height / 2;
      const dx = e.clientX - mx;
      const dy = e.clientY - my;
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (Math.hypot(dx, dy) < reach) {
        tx = dx * strength;
        ty = dy * strength;
      } else {
        tx = 0;
        ty = 0;
      }
    };

    const loop = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", ...style }}>
      {children}
    </span>
  );
}
