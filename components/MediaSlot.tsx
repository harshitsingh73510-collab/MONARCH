"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** image src (from /public) or remote */
  src?: string;
  /** video src — takes priority over image if present */
  video?: string;
  poster?: string;
  label: string;
  ratio?: string; // e.g. "16 / 9"
  className?: string;
  /** parallax strength in px */
  parallax?: number;
  rounded?: boolean;
  priority?: boolean;
};

/**
 * Cinematic media frame — the "monarch_1" concept, elevated.
 * Holds a video or image with reveal, hover-scale, scroll parallax and a
 * mono label. When no media is supplied it renders an elegant labelled
 * placeholder, so the layout never looks broken.
 */
export default function MediaSlot({
  src,
  video,
  poster,
  label,
  ratio = "16 / 9",
  className = "",
  parallax = 40,
  rounded = true,
  priority = false,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.15 }
    );
    io.observe(wrap);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
        inner.style.transform = `translateY(${p * parallax}px) scale(1.12)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  const hasMedia = !!(video || src);

  return (
    <div
      ref={wrapRef}
      data-hover
      className={className}
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        overflow: "hidden",
        borderRadius: rounded ? "4px" : 0,
        border: "1px solid var(--fog)",
        background: "var(--obsidian)",
        clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(8% 8% 8% 8%)",
        opacity: inView ? 1 : 0,
        transition:
          "clip-path 1.4s var(--ease-cine), opacity 1.2s var(--ease-cine)",
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
        }}
      >
        {video ? (
          <video
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload={priority ? "auto" : "metadata"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={label}
            loading={priority ? "eager" : "lazy"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>

      {/* placeholder grid when empty */}
      {!hasMedia && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(243,242,239,0.02) 0 1px, transparent 1px 14px)",
          }}
        >
          <span className="eyebrow" style={{ opacity: 0.5 }}>
            {label}
          </span>
        </div>
      )}

      {/* subtle vignette + label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(5,5,6,0.55), transparent 40%)",
        }}
      />
      <span
        className="eyebrow"
        style={{
          position: "absolute",
          left: "1rem",
          bottom: "0.9rem",
          color: "var(--titanium)",
          opacity: inView ? 0.7 : 0,
          transition: "opacity 1s var(--ease-cine) .4s",
          mixBlendMode: "difference",
        }}
      >
        {label}
      </span>
    </div>
  );
}
