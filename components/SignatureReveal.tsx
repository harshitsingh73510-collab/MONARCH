"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * THE MONARCH MOVE — the studio's signature section transition.
 * A brushed-titanium sheet lies over the content and PEELS away (lifts + skews
 * off) when the block scrolls into view, a champagne seam of light trailing its
 * edge. Reused verbatim across the site so a visitor recognises it as "this
 * studio's transition" by the second time they see it (Tier 2.4).
 *
 * Reduced-motion / no-JS: the sheet never covers the content — it renders
 * plainly. The content is always in the DOM, so it's crawlable and accessible
 * regardless.
 */
export default function SignatureReveal({
  children,
  className,
  style,
  contentStyle,
  contentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  contentClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.add("is-peeled");
      return;
    }

    let done = false;
    const peel = () => {
      if (done) return;
      done = true;
      el.classList.add("is-peeled");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) peel();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    // safety net: never leave content covered if the observer misfires
    const t = window.setTimeout(peel, 2200);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={ref} className={`peel${className ? " " + className : ""}`} style={style}>
      <div
        className={`peel-content${contentClassName ? " " + contentClassName : ""}`}
        style={contentStyle}
      >
        {children}
      </div>
      <span className="peel-sheet" aria-hidden />
    </div>
  );
}
