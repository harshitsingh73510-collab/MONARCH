"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/projects";
import Reveal from "@/components/Reveal";
import RollText from "@/components/RollText";
import TLink from "@/components/transition/TLink";

const CardsGL = dynamic(() => import("@/components/work/CardsGL"), { ssr: false });

/**
 * 02 — SELECTED WORK. A light gallery that slides up over the dark page like a
 * sheet. Images are re-drawn in WebGL (CardsGL): they bend with scroll speed,
 * open on a curved wipe, and play a silent reel of the live site on hover.
 * Every card opens the real site in a new tab.
 */
export default function SelectedWork({ page = false }: { page?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  // The gallery lights come on: the sheet arrives dark, warms to paper as it
  // rises into view, and dims back to dark as you leave — no hard cut.
  useEffect(() => {
    const el = ref.current;
    if (!el || page) return;
    let raf = 0;
    const smooth = (x: number) => {
      const t = Math.min(1, Math.max(0, x));
      return t * t * (3 - 2 * t);
    };
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const enter = smooth((vh - r.top) / (vh * 1.05));
      const exit = smooth(r.bottom / (vh * 1.05));
      el.style.setProperty("--k", Math.min(enter, exit).toFixed(3));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [page]);

  return (
    <section ref={ref} id="work" className={`lw${page ? " lw--page" : ""}`}>
      <div className="lw-in">
        <header className="lw-head">
          <Reveal className="lw-head-main">
            {!page && <p className="eyebrow lw-eyebrow">02 — Selected work</p>}
            <h2 className="lw-title font-display">
              <span className="mask-line">
                <span>{page ? "Projects" : "Selected Work"}</span>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={200} className="lw-head-side">
            <p className="font-mono lw-intro">
              Six worlds built from nothing — each with its own light, its own material, its own
              rules. Every one is live.
            </p>
          </Reveal>
        </header>

        <ul className="lw-grid">
          {PROJECTS.map((p, i) => (
            <li key={p.slug} className="lw-item" style={{ ["--d" as string]: `${(i % 2) * 90}ms` }}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lw-card roll-host"
                data-cursor-label="VISIT ↗"
                aria-label={`${p.name} — ${p.kind}. Opens the live site in a new tab.`}
              >
                <div
                  className="lw-media"
                  data-gl-card={p.cover}
                  data-gl-reel={JSON.stringify(p.reel)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt="" loading="lazy" />
                  <span className="lw-open font-mono" aria-hidden>
                    Live site ↗
                  </span>
                </div>
                <p className="lw-tags font-mono">{p.tags.join(" • ")}</p>
                <h3 className="lw-name font-display">
                  <RollText text={p.name} />
                </h3>
                <p className="lw-line">{p.line}</p>
              </a>
            </li>
          ))}
        </ul>

        {!page && (
          <div className="lw-more">
            <TLink href="/work" label="Projects" className="pill pill-dark">
              <i className="pill-dot" />
              <span className="pill-roll" data-text="See all projects">
                See all projects
              </span>
            </TLink>
          </div>
        )}
      </div>
      <CardsGL scope={ref} />
    </section>
  );
}
