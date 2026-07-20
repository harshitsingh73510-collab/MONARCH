"use client";

import { useEffect, useRef } from "react";
import { subscribeScrollVelocity } from "@/lib/motion";

/**
 * MONARCH reactive cursor.
 * Context-driven via `data-cursor` on targets:
 *   - links / buttons / [data-hover]   → magnetic ring pull
 *   - [data-cursor="label"]            → morphs into a text label
 *       (label text taken from data-cursor-label, default "VIEW")
 *   - [data-cursor="hero"]             → leaves a trailing smear
 * Falls back to the native cursor on touch / coarse pointers.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    // magnetic target — where the ring is pulled to (element centre or cursor)
    let tx = mx;
    let ty = my;
    let raf = 0;
    let heroActive = false;

    // trailing smear buffer (only drawn over the hero)
    const trail: { x: number; y: number; life: number }[] = [];

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

      const t = e.target as HTMLElement;
      const magnetic = t.closest<HTMLElement>(
        "a, button, [data-hover], [data-cursor]"
      );
      const labelEl = t.closest<HTMLElement>('[data-cursor="label"]');
      heroActive = !!t.closest('[data-cursor="hero"]');

      // --- magnetic pull: ring eases toward the element centre, not the tip
      if (magnetic) {
        const r = magnetic.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // pull strength scales down for large targets (panels) so it feels
        // like a nudge, not a snap
        const pull = Math.min(0.35, 40 / Math.max(r.width, r.height));
        tx = mx + (cx - mx) * pull;
        ty = my + (cy - my) * pull;
      } else {
        tx = mx;
        ty = my;
      }
      ring.classList.toggle("is-hover", !!magnetic && !labelEl);

      // --- label morph
      if (labelEl) {
        label.textContent =
          labelEl.getAttribute("data-cursor-label") || "VIEW";
        ring.classList.add("is-label");
      } else {
        ring.classList.remove("is-label");
      }

      // seed a trail sample while over the hero
      if (heroActive && ctx) {
        trail.push({ x: mx, y: my, life: 1 });
        if (trail.length > 60) trail.shift();
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

      // draw + decay the smear
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (trail.length) {
          ctx.globalCompositeOperation = "lighter";
          for (let i = 0; i < trail.length; i++) {
            const p = trail[i];
            p.life -= 0.045;
            if (p.life <= 0) continue;
            const rad = 26 * p.life + 6;
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
            g.addColorStop(0, `rgba(232,201,143,${0.16 * p.life})`);
            g.addColorStop(1, "rgba(232,201,143,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalCompositeOperation = "source-over";
          while (trail.length && trail[0].life <= 0) trail.shift();
        }
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("resize", sizeCanvas);
    // keep the shared scroll-velocity tracker alive (hero sphere shares it)
    const unsub = subscribeScrollVelocity();
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("resize", sizeCanvas);
      cancelAnimationFrame(raf);
      unsub();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={labelRef} className="cursor-label" aria-hidden />
    </>
  );
}
