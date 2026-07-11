"use client";

import { useEffect, useRef } from "react";

type Props = {
  id: string;
  eyebrow: string;
  image: string;
  focus?: string;
  lines: React.ReactNode[];
  /** vertical viewport-heights of scroll per line (pacing) */
  perLine?: number;
};

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/**
 * A cinematic statement sequence. Lines cross-dissolve CONTINUOUSLY with
 * scroll — the previous line rises and dissolves as the next emerges from
 * below, so nothing pops. Fully responsive: type scales to width AND height,
 * so long lines never spill off a laptop or phone.
 */
export default function StatementSequence({
  id,
  eyebrow,
  image,
  focus = "center",
  lines,
  perLine = 1.0,
}: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const N = lines.length;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const p = Math.min(1, Math.max(0, -r.top / total));

      // background: slow push in
      if (bgRef.current)
        bgRef.current.style.transform = `scale(${1.06 + p * 0.16})`;

      // eyebrow fades out after the first line
      if (eyebrowRef.current)
        eyebrowRef.current.style.opacity = `${1 - smoothstep(p * N)}`;

      // first line anchored at entry (center 0), last at exit (center 1)
      const win = N > 1 ? 1 / (N - 1) : 1;
      for (let i = 0; i < N; i++) {
        const el = lineRefs.current[i];
        if (!el) continue;
        const center = N > 1 ? i / (N - 1) : 0.5;
        const dRaw = (p - center) / win; // -1..+1 within its window
        const vis = 1 - Math.min(1, Math.abs(dRaw));
        const o = smoothstep(vis * 1.2);
        el.style.opacity = `${o}`;
        // connected slide: outgoing drifts up, incoming rises from below
        el.style.transform = `translateY(${dRaw * -3.4}vh)`;
        el.style.filter = `blur(${(1 - o) * 10}px)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lines.length]);

  return (
    <section
      ref={wrapRef}
      id={id}
      style={{ position: "relative", height: `${lines.length * perLine * 100 + 60}vh`, zIndex: 2 }}
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
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: focus,
            willChange: "transform",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 18%, rgba(5,5,6,0.78) 100%)",
          }}
        />

        <p
          ref={eyebrowRef}
          className="eyebrow"
          style={{ position: "absolute", top: "14vh", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
        >
          {eyebrow}
        </p>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "min(90vw, 60rem)",
            paddingInline: "var(--pad)",
            textAlign: "center",
            minHeight: "1.2em",
          }}
        >
          {lines.map((line, i) => (
            <p
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="font-display stmt-line"
              style={{
                position: i === 0 ? "relative" : "absolute",
                inset: i === 0 ? undefined : 0,
                margin: "auto",
                height: "fit-content",
                opacity: 0,
                willChange: "opacity, transform, filter",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <style>{`
        #${id} .stmt-line {
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 1.04;
          /* width- AND height-aware so it always fits the device */
          font-size: clamp(1.9rem, min(7vw, 8.5vh), 4.6rem);
          text-wrap: balance;
        }
      `}</style>
    </section>
  );
}
