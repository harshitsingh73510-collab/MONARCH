"use client";

import { useEffect, useRef, useState } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number; // orbital target
  oy: number;
};

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export default function Problem() {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progRef = useRef(0);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(60, Math.max(30, Math.round((w * h) / 24000)));
      nodes = Array.from({ length: n }, (_, i) => {
        const ang = (i / n) * Math.PI * 2;
        const rad = Math.min(w, h) * (0.16 + (i % 3) * 0.07);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          ox: w / 2 + Math.cos(ang) * rad,
          oy: h / 2 + Math.sin(ang) * rad,
        };
      });
    };

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const p = Math.min(1, Math.max(0, -r.top / total));
      progRef.current = p;
      setPhase(p < 0.4 ? 0 : p < 0.72 ? 1 : 2);
    };

    const draw = () => {
      const p = progRef.current;
      const order = smoothstep(0.62, 0.9, p);
      const chaos = smoothstep(0.12, 0.55, p) * (1 - order);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (const node of nodes) {
        if (order > 0.01) {
          // pull toward orbital home
          node.x += (node.ox - node.x) * order * 0.08;
          node.y += (node.oy - node.y) * order * 0.08;
          // slow orbital rotation
          const ang = Math.atan2(node.oy - cy, node.ox - cx) + 0.002;
          const rad = Math.hypot(node.ox - cx, node.oy - cy);
          node.ox = cx + Math.cos(ang) * rad;
          node.oy = cy + Math.sin(ang) * rad;
        } else {
          const speed = 0.4 + chaos * 2.6;
          node.x += node.vx * speed;
          node.y += node.vy * speed;
          if (chaos > 0.5) {
            node.vx += (Math.random() - 0.5) * chaos * 0.35;
            node.vy += (Math.random() - 0.5) * chaos * 0.35;
          }
          node.vx = Math.max(-1.8, Math.min(1.8, node.vx));
          node.vy = Math.max(-1.8, Math.min(1.8, node.vy));
          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;
          node.x = Math.max(0, Math.min(w, node.x));
          node.y = Math.max(0, Math.min(h, node.y));
        }
      }

      // links
      const linkDist = 170;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const base = (1 - d / linkDist) * 0.45;
            const red = 120 + chaos * 135;
            const g = 120 - chaos * 80 + order * 40;
            const bl = 120 - chaos * 80 + order * 20;
            ctx.strokeStyle = `rgba(${red}, ${g}, ${bl}, ${base * (0.3 + chaos * 0.6 + order * 0.3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const node of nodes) {
        const flick = chaos > 0.55 ? 0.45 + Math.random() * 0.55 : 1;
        const red = 150 + chaos * 105;
        const g = 150 - chaos * 100 + order * 30;
        const bl = 150 - chaos * 100 + order * 10;
        ctx.fillStyle = `rgba(${red}, ${g}, ${bl}, ${(0.5 + chaos * 0.4) * flick})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // the ordering node — champagne core appears with order
      if (order > 0.01) {
        const rr = 4 + order * 8;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * 6);
        grad.addColorStop(0, `rgba(232,201,143,${0.9 * order})`);
        grad.addColorStop(1, "rgba(232,201,143,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rr * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(240,225,195,${order})`;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const copy = [
    {
      eyebrow: "002 — The tax of growth",
      title: "Every signal multiplies.",
      sub: "Emails, clients, calls, contracts — until no human can hold the whole picture.",
    },
    {
      eyebrow: "002 — Overload",
      title: "And then it breaks.",
      sub: "The lights blink red. Traffic stops. Everything slows.",
    },
    {
      eyebrow: "002 — The turn",
      title: "One intelligence enters.",
      sub: "Everything reorganizes. The city comes alive again.",
    },
  ];

  return (
    <section
      ref={wrapRef}
      id="problem"
      style={{ position: "relative", height: "300vh", zIndex: 2 }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* city backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/problem-city.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
            filter: phase === 2 ? "saturate(1)" : "saturate(0.8)",
            transition: "filter 1.2s var(--ease-cine)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,5,6,0.55), rgba(5,5,6,0.2) 40%, rgba(5,5,6,0.9))",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        />

        <div
          className="section"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "40rem",
            paddingBottom: "12vh",
          }}
        >
          {copy.map((c, i) => (
            <div
              key={i}
              style={{
                position: i === 0 ? "relative" : "absolute",
                bottom: i === 0 ? undefined : "12vh",
                opacity: phase === i ? 1 : 0,
                transform: phase === i ? "translateY(0)" : "translateY(16px)",
                transition:
                  "opacity .9s var(--ease-cine), transform .9s var(--ease-cine)",
                pointerEvents: "none",
              }}
            >
              <p className="eyebrow" style={{ marginBottom: "1.4rem" }}>
                {c.eyebrow}
              </p>
              <h2 className="display-md font-display" style={{ marginBottom: "1.2rem" }}>
                {c.title}
              </h2>
              <p className="lede" style={{ maxWidth: "32rem" }}>
                {c.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
