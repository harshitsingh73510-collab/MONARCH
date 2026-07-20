"use client";

import { useEffect, useRef, useState } from "react";
import WorldsCanvas from "@/components/webgl/WorldsCanvas";
import { sound } from "@/lib/sound";
import type Lenis from "lenis";

export type Project = {
  name: string;
  category: string;
  line: string;
  role: string;
  year: string;
  image: string;
};

/**
 * The 3D worlds navigator (Tier 3). A tall scroll "track" pins a WebGL stage;
 * scrolling flies the visitor through the case-study cards. Prev/next, index
 * dots, arrow keys and clicking a card all navigate by smooth-scrolling the
 * page (via the shared Lenis instance). If the WebGL scene errors at runtime it
 * calls onFail so the parent can drop to the 2D fallback.
 */
export default function Worlds3DNav({
  projects,
  onFail,
}: {
  projects: Project[];
  onFail: () => void;
}) {
  const N = projects.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const focusRef = useRef(0);
  const [focused, setFocused] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const range = track.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = range > 0 ? Math.min(1, Math.max(0, scrolled / range)) : 0;
      progressRef.current = p;
      const focus = Math.round(p * (N - 1));
      if (focus !== focusRef.current) {
        focusRef.current = focus;
        setFocused(focus);
        sound.chime("enter");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [N]);

  const scrollToIndex = (k: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(N - 1, Math.max(0, k));
    const rectTop = track.getBoundingClientRect().top + window.scrollY;
    const range = track.offsetHeight - window.innerHeight;
    const top = rectTop + (clamped / (N - 1)) * range;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      scrollToIndex(focusRef.current + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      scrollToIndex(focusRef.current - 1);
    }
  };

  const p = projects[focused];

  return (
    <div
      ref={trackRef}
      className="worlds-track"
      style={{ height: `${N * 92 + 40}vh`, position: "relative" }}
    >
      <div
        className="worlds-stick"
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected work — 3D navigator"
        tabIndex={0}
        onKeyDown={onKey}
      >
        <WorldsCanvas
          images={projects.map((x) => x.image)}
          progressRef={progressRef}
          onSelect={scrollToIndex}
          onError={onFail}
        />

        {/* focused project meta */}
        <div className="worlds-overlay">
          <div className="worlds-meta" key={p.name}>
            <p className="eyebrow text-champagne" style={{ marginBottom: "1rem" }}>
              {String(focused + 1).padStart(2, "0")} · {p.category}
            </p>
            <h3 className="font-display worlds-name">{p.name}</h3>
            <p
              className="lede"
              style={{ maxWidth: "32ch", color: "var(--platinum)", marginTop: "0.6rem" }}
            >
              {p.line}
            </p>
            <p className="eyebrow" style={{ marginTop: "1.2rem", color: "var(--titanium)" }}>
              {p.role} · {p.year}
            </p>
          </div>
        </div>

        {/* HUD: prev / dots / next */}
        <div className="worlds-hud">
          <button
            type="button"
            data-hover
            aria-label="Previous project"
            className="worlds-arrow"
            onClick={() => scrollToIndex(focusRef.current - 1)}
          >
            ←
          </button>
          <div className="worlds-dots" role="tablist">
            {projects.map((proj, i) => (
              <button
                key={proj.name}
                type="button"
                data-hover
                role="tab"
                aria-selected={i === focused}
                aria-label={`Go to ${proj.name}`}
                className={`worlds-dot${i === focused ? " is-active" : ""}`}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            data-hover
            aria-label="Next project"
            className="worlds-arrow"
            onClick={() => scrollToIndex(focusRef.current + 1)}
          >
            →
          </button>
        </div>

        <p className="worlds-hint eyebrow">
          {isTouch ? "Swipe to explore" : "Scroll or use ← → to explore"}
        </p>
      </div>
    </div>
  );
}
