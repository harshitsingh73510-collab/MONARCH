"use client";

import { useEffect, useRef, useState } from "react";
import ScrambleText from "@/components/ScrambleText";
import TLink from "@/components/transition/TLink";

/**
 * 05 — FOUNDER. A dark, instrument-like profile — type, counters and a name
 * that decodes itself. No photograph.
 */
export default function Founder({ page = false }: { page?: boolean }) {
  const [ready, setReady] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const secRef = useRef<HTMLElement>(null);
  const word = "FOUNDER";

  // letters rise in once the section is on screen
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setReady(true), { threshold: 0.25 });
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  // progress line under the name tracks the section's scroll
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.4)));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={secRef} id="founder" className={`tm${ready ? " is-ready" : ""}${page ? " tm--page" : ""}`}>
      <div className="tm-stage">
        {/* data rain down the left edge */}
        <div className="tm-rain font-mono" aria-hidden>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * -4}s` }}>
              MONARCH/0x4d4f4e·STUDIO·{i}·DESIGN·TECHNOLOGY·STORY·HS·2026·
            </span>
          ))}
        </div>

        <header className="tm-head">
          <p className="eyebrow tm-eyebrow">{page ? "Monarch — Founder" : "05 — Founder"}</p>
          <h2 className="tm-word font-display" aria-label="Founder">
            {word.split("").map((c, i) => (
              <span key={i} style={{ transitionDelay: `${0.05 * i}s` }}>
                {c}
              </span>
            ))}
          </h2>
          <div className="tm-meta">
            <span className="font-mono tm-count">
              [[ <span>001</span> ]]
            </span>
            <span className="tm-dots" aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${(i * 97) % 1800}ms` }} />
              ))}
            </span>
          </div>
        </header>

        <div className="tm-pixels" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${(i * 373) % 2400}ms` }} />
          ))}
        </div>

        <div className="tm-id">
          <p className="tm-name">
            <span className="tm-colons" aria-hidden>
              ::
            </span>{" "}
            <ScrambleText text="Harshit Singh" delay={500} />
          </p>
          <p className="font-mono tm-role">
            <ScrambleText text="FOUNDER / CREATIVE DIRECTOR" delay={800} />
          </p>
          <span className="tm-bar">
            <span ref={barRef} />
          </span>
        </div>

      </div>

      {!page && (
        <div className="tm-note section">
          <p className="tm-quote font-display">
            Monarch exists because too much of the internet began to feel interchangeable.
          </p>
          <div>
            <p className="tm-body">
              I wanted to build experiences that had a point of view — where design, technology and
              storytelling become one thing.
            </p>
            <TLink href="/founder" label="Founder" className="pill pill-light" data-cursor-label="OPEN →">
              <span className="pill-roll" data-text="Read the note">
                Read the note
              </span>
              <i className="pill-dot" />
            </TLink>
          </div>
        </div>
      )}
    </section>
  );
}
