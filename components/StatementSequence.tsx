"use client";

import { useEffect, useRef } from "react";

type Props = {
  id: string;
  eyebrow: string;
  image: string;
  focus?: string;
  lines: React.ReactNode[];
  perLine?: number;
};

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/**
 * Cinematic statement sequence. Lines cross-dissolve continuously with scroll
 * (nothing pops); each becoming-active line scales in, ignites its accent, and
 * draws a champagne underline. Type is width- AND height-aware, so it fits any
 * device. The background pushes in slowly for depth.
 */
export default function StatementSequence({
  id,
  eyebrow,
  image,
  focus = "center",
  lines,
  perLine = 1.1,
}: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement>(null);
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

      if (bgRef.current)
        bgRef.current.style.transform = `scale(${1.05 + p * 0.22})`;
      if (eyebrowRef.current)
        eyebrowRef.current.style.opacity = `${1 - smoothstep(p * N)}`;

      const win = N > 1 ? 1 / (N - 1) : 1;
      let maxO = 0;
      for (let i = 0; i < N; i++) {
        const el = lineRefs.current[i];
        if (!el) continue;
        const center = N > 1 ? i / (N - 1) : 0.5;
        const dRaw = (p - center) / win;
        const vis = 1 - Math.min(1, Math.abs(dRaw));
        const o = smoothstep(vis * 1.2);
        maxO = Math.max(maxO, o);
        el.style.opacity = `${o}`;
        el.style.transform = `translateY(${dRaw * -3.2}vh) scale(${0.955 + o * 0.045})`;
        el.style.filter = `blur(${(1 - o) * 12}px)`;
      }
      if (underlineRef.current)
        underlineRef.current.style.transform = `scaleX(${smoothstep(maxO * maxO)})`;
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
              "radial-gradient(120% 90% at 50% 50%, transparent 14%, rgba(5,5,6,0.82) 100%)",
          }}
        />

        <p
          ref={eyebrowRef}
          className="eyebrow"
          style={{ position: "absolute", top: "13vh", left: "50%", transform: "translateX(-50%)", zIndex: 3 }}
        >
          {eyebrow}
        </p>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "min(92vw, 64rem)",
            paddingInline: "var(--pad)",
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative", minHeight: "1.2em" }}>
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

          {/* champagne underline that draws as a line becomes clear */}
          <span
            ref={underlineRef}
            aria-hidden
            style={{
              display: "block",
              height: 1,
              width: "clamp(3rem, 9vw, 8rem)",
              margin: "clamp(2rem, 4vh, 3rem) auto 0",
              background: "var(--champagne)",
              boxShadow: "0 0 12px rgba(232,201,143,0.5)",
              transformOrigin: "center",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>

      <style>{`
        #${id} .stmt-line {
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 1.03;
          font-size: clamp(2rem, min(8vw, 9vh), 5.6rem);
          text-wrap: balance;
        }
        #${id} .stmt-line .text-champagne {
          text-shadow: 0 0 26px rgba(232,201,143,0.45);
        }
      `}</style>
    </section>
  );
}
