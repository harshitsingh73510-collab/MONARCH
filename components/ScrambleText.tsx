"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFMNOXZ:;";

/** Text that decodes itself from noise when it enters the viewport (and on hover). */
export default function ScrambleText({
  text,
  className,
  delay = 0,
  hover = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  hover?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const dur = 380 + text.length * 38;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const reveal = i / text.length < p * 1.15 - 0.1;
          out += reveal || text[i] === " " ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) raf = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      raf = requestAnimationFrame(tick);
    };
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        t = window.setTimeout(run, delay);
        io.disconnect();
      }
    });
    io.observe(el);
    const onEnter = () => hover && run();
    el.addEventListener("pointerenter", onEnter);
    return () => {
      io.disconnect();
      clearTimeout(t);
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
    };
  }, [text, delay, hover]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
