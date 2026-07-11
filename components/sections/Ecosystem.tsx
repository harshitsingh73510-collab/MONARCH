"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import EcosystemGalaxy from "@/components/EcosystemGalaxy";

const PLANETS = [
  { name: "Experience Design", desc: "Interfaces that feel like places, not pages." },
  { name: "Creative Engineering", desc: "Ideas made real, down to the last frame." },
  { name: "Interactive Motion", desc: "Movement that carries meaning, never noise." },
  { name: "Luxury Branding", desc: "Identities with the weight of something permanent." },
  { name: "Immersive Web", desc: "WebGL worlds you enter, not websites you visit." },
  { name: "Product Strategy", desc: "The thinking that makes the craft matter." },
  { name: "Visual Systems", desc: "Design languages that scale without diluting." },
  { name: "Creative Technology", desc: "The edge of what a browser can be made to do." },
];

export default function Ecosystem() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="capabilities"
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
              02 — Capabilities
            </p>
            <h2 className="display-md font-display" style={{ marginBottom: "1.6rem" }}>
              Many disciplines. One obsession.
            </h2>
          </Reveal>

          {/* active planet detail */}
          <div style={{ minHeight: "5.5rem", marginBottom: "2rem" }}>
            <p className="eyebrow text-champagne" style={{ marginBottom: "0.8rem" }}>
              {PLANETS[active].name}
            </p>
            <p
              className="font-display"
              style={{
                fontSize: "clamp(1.1rem, 1.7vw, 1.55rem)",
                fontWeight: 300,
                lineHeight: 1.4,
                color: "var(--platinum)",
                maxWidth: "34ch",
              }}
            >
              {PLANETS[active].desc}
            </p>
          </div>

          <ul style={{ listStyle: "none", borderTop: "1px solid var(--fog)" }}>
            {PLANETS.map((p, i) => (
              <li
                key={p.name}
                data-hover
                onMouseEnter={() => setActive(i)}
                tabIndex={0}
                onFocus={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.9rem",
                  padding: "0.7rem 0",
                  borderBottom: "1px solid var(--fog)",
                  paddingLeft: active === i ? "0.9rem" : 0,
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
                    fontSize: "clamp(0.95rem, 1.5vw, 1.25rem)",
                    fontWeight: 400,
                    color: active === i ? "var(--platinum)" : "var(--titanium)",
                    transition: "color .4s",
                  }}
                >
                  {p.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <EcosystemGalaxy
          planets={PLANETS.map((p) => p.name)}
          active={active}
          setActive={setActive}
        />
      </div>

      <style>{`
        @media (max-width: 820px) {
          .eco-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
