"use client";

import { useEffect, useRef } from "react";

/**
 * The MONARCH cursor system — deliberately minimal. The native pointer is
 * never hidden; over meaningful targets a small mono label rides beside it:
 *   data-cursor-label="VIEW ↗" | "OPEN →" | "← BACK" | "DRAG ↔" | "PLAY"
 * Fine pointers only. No rings, no trails.
 */
export default function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current!;
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;
    let current = "";

    const resolve = (target: Element | null) => {
      const t = target?.closest<HTMLElement>("[data-cursor-label]");
      const next = t?.getAttribute("data-cursor-label") || "";
      if (next !== current) {
        current = next;
        if (next) el.textContent = next;
        el.classList.toggle("is-on", !!next);
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      resolve(e.target as Element | null);
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // content scrolls under a still pointer — re-read what it's over
    let sraf = 0;
    const onScroll = () => {
      if (sraf || x < 0) return;
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        resolve(document.elementFromPoint(x, y));
      });
    };

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx + 18}px, ${cy + 20}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };

    const onLeave = () => {
      current = "";
      el.classList.remove("is-on");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(sraf);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-chip" aria-hidden />;
}
