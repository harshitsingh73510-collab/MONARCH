"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

const REGIONS = [
  { code: "UAE", industry: "Real Estate", note: "Brokers, developers, sovereign scale." },
  { code: "USA", industry: "Healthcare", note: "Clinics and networks, run by intelligence." },
  { code: "UK", industry: "Finance", note: "Compliance, risk and capital, orchestrated." },
  { code: "KSA", industry: "Government", note: "Cities and ministries, as one system." },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const onScroll = () => {
      const r = img.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = `translateY(${p * -40}px) scale(1.08)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="industries"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 2,
        paddingBlock: "16vh",
      }}
    >
      {/* reused monolith monument */}
      <div
        ref={imgRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url(/assets/hero-monolith.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.32,
          willChange: "transform",
          maskImage:
            "linear-gradient(to right, transparent, black 40%, black 60%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 40%, black 60%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(80% 80% at 50% 50%, transparent, rgba(5,5,6,0.8))",
        }}
      />

      <div
        className="section"
        style={{ position: "relative", zIndex: 1, maxWidth: "84rem", margin: "0 auto", width: "100%" }}
      >
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
            007 — Industries
          </p>
          <h2 className="display-md font-display" style={{ maxWidth: "16ch", marginBottom: "3rem" }}>
            One system. Every sector it touches transforms.
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1px",
            background: "var(--fog)",
            border: "1px solid var(--fog)",
          }}
        >
          {REGIONS.map((r, i) => (
            <button
              key={r.code}
              data-hover
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              style={{
                background: active === i ? "rgba(232,201,143,0.05)" : "var(--void)",
                border: "none",
                padding: "clamp(1.6rem, 3vw, 2.6rem)",
                textAlign: "left",
                transition: "background .5s var(--ease-cine)",
                color: "inherit",
              }}
            >
              <div
                className="font-display"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.4rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: active === i ? "var(--platinum)" : "var(--titanium)",
                  transition: "color .4s",
                }}
              >
                {r.code}
              </div>
              <p
                className="eyebrow"
                style={{
                  margin: "1rem 0 0.6rem",
                  color: active === i ? "var(--champagne)" : "var(--titanium-dim)",
                  transition: "color .4s",
                }}
              >
                {r.industry}
              </p>
              <p
                className="lede"
                style={{
                  fontSize: "0.9rem",
                  opacity: active === i ? 1 : 0.5,
                  transition: "opacity .4s",
                }}
              >
                {r.note}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
