"use client";

import { useRef } from "react";
import Reveal from "@/components/Reveal";
import MediaSlot from "@/components/MediaSlot";

export default function MeetMonarch() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1400px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };
  const onLeave = () => {
    if (wrapRef.current)
      wrapRef.current.style.transform =
        "perspective(1400px) rotateY(0) rotateX(0)";
  };

  return (
    <section
      id="meet"
      className="section"
      style={{ paddingBlock: "22vh", position: "relative", zIndex: 2 }}
    >
      <div style={{ maxWidth: "82rem", margin: "0 auto" }}>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
            004 — Meet Monarch
          </p>
          <h2 className="display-md font-display" style={{ maxWidth: "20ch" }}>
            Not screenshots. A living interface.
          </h2>
        </Reveal>

        <div
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            marginTop: "clamp(3rem, 6vw, 5rem)",
            transformStyle: "preserve-3d",
            transition: "transform .6s var(--ease-cine)",
            willChange: "transform",
          }}
        >
          <MediaSlot
            src="/assets/dashboard.webp"
            label="Monarch OS · live command surface"
            ratio="16 / 9"
            parallax={30}
            priority
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 3rem)",
            marginTop: "clamp(3rem, 6vw, 5rem)",
          }}
        >
          {[
            ["Everything animated", "Panels, cards and analytics breathe in real time — the company as one moving surface."],
            ["Hover to expand", "Any panel opens into live workflows, micro-animations and the decisions behind the number."],
            ["Floating in space", "No windows, no chrome. Intelligence rendered like VisionOS — depth, glass, light."],
          ].map(([t, d], i) => (
            <Reveal key={i} delay={i * 100}>
              <p className="eyebrow" style={{ marginBottom: "0.9rem", color: "var(--champagne)" }}>
                0{i + 1}
              </p>
              <h3 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 400, marginBottom: "0.6rem" }}>
                {t}
              </h3>
              <p className="lede" style={{ fontSize: "0.98rem" }}>
                {d}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
