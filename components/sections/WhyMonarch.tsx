"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import SignatureReveal from "@/components/SignatureReveal";

const BELIEFS = [
  { no: "Anyone can follow references.", yes: "We become the reference." },
  { no: "Anyone can decorate a product.", yes: "We decide what it is." },
  { no: "Anyone can add motion.", yes: "We make it mean something." },
  { no: "Anyone can ship a file.", yes: "We ship a memory." },
];

export default function WhyMonarch() {
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
      id="why"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 2,
        paddingBlock: "18vh",
      }}
    >
      <div
        ref={imgRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url(/assets/hero-monolith.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.28,
          willChange: "transform",
          maskImage:
            "linear-gradient(to right, transparent, black 42%, black 58%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 42%, black 58%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(80% 80% at 50% 50%, transparent, rgba(5,5,6,0.82))",
        }}
      />

      <div
        className="section"
        style={{ position: "relative", zIndex: 1, maxWidth: "84rem", margin: "0 auto", width: "100%" }}
      >
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
            06 — Why Monarch
          </p>
          <h2 className="display-md font-display" style={{ maxWidth: "18ch", marginBottom: "clamp(3rem,7vh,5rem)" }}>
            The difference is obsession.
          </h2>
        </Reveal>

        <SignatureReveal
          contentStyle={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1px",
            background: "var(--fog)",
            border: "1px solid var(--fog)",
          }}
        >
          {BELIEFS.map((b, i) => (
            <div
              key={i}
              style={{
                background: "var(--void)",
                padding: "clamp(1.8rem, 3vw, 2.8rem)",
              }}
            >
              <p
                className="eyebrow"
                style={{
                  color: "var(--titanium-dim)",
                  marginBottom: "1rem",
                  letterSpacing: "0.22em",
                }}
              >
                {b.no}
              </p>
              <p
                className="font-display"
                style={{
                  fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  color: "var(--platinum)",
                }}
              >
                {b.yes}
              </p>
            </div>
          ))}
        </SignatureReveal>
      </div>
    </section>
  );
}
