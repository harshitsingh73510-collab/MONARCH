"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

const WORD = "MONARCH";

/**
 * The opening. A void→metal entrance built on Monarch's own signature surface:
 * the champagne counter runs 0→100 on a brushed-titanium sheet, then the sheet
 * PEELS up (the studio's signature move) to reveal the site beneath.
 * Plays once per tab session. Reduced-motion visitors get a short fade.
 * Fails open: any error or a 5s failsafe reveals the site so the overlay can
 * never trap the page.
 */
export default function Ignition() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("monarch:entered") === "1";
    } catch {
      /* private mode */
    }
    if (seen) {
      setDone(true);
      return;
    }

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } })
      .lenis;
    lenis?.stop?.();
    window.scrollTo(0, 0);

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("monarch:entered", "1");
      } catch {
        /* ignore */
      }
      html.style.overflow = prevOverflow;
      lenis?.start?.();
      window.scrollTo(0, 0);
      setDone(true);
    };

    // failsafe: never let the curtain trap the page
    const failsafe = window.setTimeout(finish, 5000);

    let tl: gsap.core.Timeline | null = null;
    try {
      if (prefersReducedMotion()) {
        tl = gsap.timeline({ onComplete: finish });
        tl.to(rootRef.current, { opacity: 0, duration: 0.6, delay: 0.5 });
      } else {
        const counter = { v: 0 };
        const letters = lettersRef.current?.children;
        tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });

        if (letters) {
          gsap.set(letters, { yPercent: 120, opacity: 0 });
          tl.to(letters, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.15);
        }
        tl.to(
          counter,
          {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              const v = Math.round(counter.v);
              if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
              if (fillRef.current) fillRef.current.style.transform = `scaleX(${counter.v / 100})`;
            },
          },
          0.15
        );
        // content fades, then the sheet peels up carrying the champagne seam
        tl.to(contentRef.current, { opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.3");
        tl.to(
          sheetRef.current,
          { yPercent: -104, skewY: -3, scaleY: 1.04, duration: 1.05, ease: "power4.inOut" },
          "<0.05"
        );
      }
    } catch {
      finish();
    }

    return () => {
      window.clearTimeout(failsafe);
      tl?.kill();
      html.style.overflow = prevOverflow;
      lenis?.start?.();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="ignition" aria-hidden>
      <div ref={sheetRef} className="ignition-sheet">
        <div ref={contentRef} className="ignition-content">
          <div className="eyebrow ignition-eyebrow">Digital experience studio</div>
          <div ref={lettersRef} className="ignition-word font-display">
            {WORD.split("").map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
          <div className="ignition-meter">
            <span className="ignition-track">
              <span ref={fillRef} className="ignition-fill" />
            </span>
            <span ref={countRef} className="ignition-count font-mono">
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
