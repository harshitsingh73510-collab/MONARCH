"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import MediaSlot from "@/components/MediaSlot";

const PLANETS = [
  "Broker AI",
  "CEO AI",
  "Manager AI",
  "Marketing AI",
  "Automation Engine",
  "Voice AI",
  "Knowledge Base",
  "Analytics",
];

export default function Ecosystem() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="ecosystem"
      className="section"
      style={{ paddingBlock: "22vh", position: "relative", zIndex: 2 }}
    >
      <div
        style={{
          maxWidth: "84rem",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: "clamp(2.5rem, 6vw, 6rem)",
          alignItems: "center",
        }}
        className="eco-grid"
      >
        <div>
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
              006 — The ecosystem
            </p>
            <h2 className="display-md font-display" style={{ marginBottom: "2rem" }}>
              One mind. Many bodies.
            </h2>
            <p className="lede" style={{ marginBottom: "2.6rem", maxWidth: "36ch" }}>
              Every product is a world of its own — orbiting a single core of
              intelligence. Choose one and it opens.
            </p>
          </Reveal>

          <ul style={{ listStyle: "none", borderTop: "1px solid var(--fog)" }}>
            {PLANETS.map((p, i) => (
              <li
                key={p}
                data-hover
                onMouseEnter={() => setActive(i)}
                tabIndex={0}
                onFocus={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.9rem 0",
                  borderBottom: "1px solid var(--fog)",
                  paddingLeft: active === i ? "1rem" : 0,
                  transition: "padding-left .4s var(--ease-cine)",
                }}
              >
                <span
                  className="eyebrow"
                  style={{ color: active === i ? "var(--champagne)" : "var(--titanium-dim)" }}
                >
                  0{i + 1}
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.05rem, 1.8vw, 1.5rem)",
                    fontWeight: 400,
                    color: active === i ? "var(--platinum)" : "var(--titanium)",
                    transition: "color .4s",
                  }}
                >
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ position: "relative" }}>
          <MediaSlot
            src="/assets/ai-core.webp"
            label={PLANETS[active]}
            ratio="1 / 1"
            parallax={20}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-10%",
              background:
                "radial-gradient(circle at 50% 50%, rgba(232,201,143,0.12), transparent 60%)",
              filter: "blur(30px)",
              zIndex: -1,
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .eco-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
