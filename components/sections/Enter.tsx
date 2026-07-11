"use client";

import { useRef } from "react";
import Reveal from "@/components/Reveal";

export default function Enter() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  // magnetic pull on the CTA
  const onMove = (e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.34}px)`;
  };
  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  };

  return (
    <section
      id="enter"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        zIndex: 2,
      }}
    >
      {/* light aperture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(60vw, 640px)",
          height: "min(60vw, 640px)",
          background:
            "radial-gradient(circle, rgba(232,201,143,0.12) 0%, transparent 62%)",
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "2.4rem" }}>
            006 — The door
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="display-lg font-display" style={{ maxWidth: "16ch", marginInline: "auto" }}>
            Give your company a mind.
          </h2>
        </Reveal>

        <Reveal delay={280}>
          <div
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ marginTop: "clamp(3rem, 6vh, 5rem)", display: "inline-block", padding: "2rem" }}
          >
            <a
              ref={btnRef}
              href="mailto:hello@monarch.studio"
              data-hover
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.9rem",
                padding: "1.1rem 2.4rem",
                border: "1px solid var(--fog-strong)",
                borderRadius: "999px",
                color: "var(--platinum)",
                fontSize: "0.82rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "transform .35s var(--ease-cine), border-color .4s, background .4s",
                background: "rgba(232,201,143,0.02)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: "var(--champagne)",
                }}
              />
              Request access
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
