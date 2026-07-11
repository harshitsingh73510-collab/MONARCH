"use client";

import { useEffect, useRef } from "react";

type Project = {
  name: string;
  category: string;
  line: string;
  role: string;
  year: string;
  image: string;
  focus: string; // background-position
};

const PROJECTS: Project[] = [
  {
    name: "Aurelis",
    category: "Luxury brand world",
    line: "A fragrance house, reborn as a place you could step inside.",
    role: "Brand · Experience · WebGL",
    year: "2025",
    image: "/assets/ai-core.webp",
    focus: "center",
  },
  {
    name: "Meridian",
    category: "Spatial commerce",
    line: "A maison’s collection, rendered as a city you explore at dusk.",
    role: "Art Direction · Engineering",
    year: "2025",
    image: "/assets/dubai.webp",
    focus: "center 60%",
  },
  {
    name: "Obsidian",
    category: "Interactive product",
    line: "An architectural configurator carved from black glass and light.",
    role: "Design · Creative Technology",
    year: "2024",
    image: "/assets/birth-architecture.webp",
    focus: "center",
  },
  {
    name: "Solstice",
    category: "Launch film",
    line: "A cinematic reveal for a product the world hadn’t seen yet.",
    role: "Direction · Motion · Web",
    year: "2024",
    image: "/assets/vision-sunrise.webp",
    focus: "center 40%",
  },
];

function Panel({ p, i }: { p: Project; i: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const bg = bgRef.current;
    if (!wrap || !bg) return;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const prog = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
      bg.style.transform = `scale(1.14) translateY(${prog * -34}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={wrapRef}
      data-hover
      className="work-panel"
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${p.image})`,
          backgroundSize: "cover",
          backgroundPosition: p.focus,
          willChange: "transform",
          filter: "saturate(0.92)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(5,5,6,0.92) 0%, rgba(5,5,6,0.3) 40%, rgba(5,5,6,0.55) 100%)",
        }}
      />

      <div
        className="section"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "84rem",
          margin: "0 auto",
          paddingBottom: "clamp(3rem, 10vh, 8rem)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <p className="eyebrow text-champagne" style={{ marginBottom: "1.4rem" }}>
              {String(i + 1).padStart(2, "0")} · {p.category}
            </p>
            <h3
              className="font-display work-title"
              style={{
                fontSize: "clamp(3.2rem, 10vw, 9rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 0.92,
                marginBottom: "1.2rem",
              }}
            >
              {p.name}
            </h3>
            <p className="lede" style={{ maxWidth: "34ch", color: "var(--platinum)" }}>
              {p.line}
            </p>
          </div>

          <div style={{ textAlign: "right", minWidth: "12rem" }}>
            <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
              {p.role}
            </p>
            <p className="eyebrow" style={{ color: "var(--titanium-dim)" }}>
              {p.year}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" style={{ position: "relative", zIndex: 2 }}>
      <div
        className="section"
        style={{ maxWidth: "84rem", margin: "0 auto", paddingBlock: "16vh 8vh", textAlign: "center" }}
      >
        <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
          05 — Selected work
        </p>
        <h2 className="display-md font-display" style={{ maxWidth: "18ch", margin: "0 auto" }}>
          A few worlds we&apos;ve been trusted to build.
        </h2>
      </div>

      {PROJECTS.map((p, i) => (
        <Panel key={p.name} p={p} i={i} />
      ))}

      <style>{`
        .work-panel .work-title { transition: transform .6s var(--ease-cine); }
        .work-panel:hover .work-title { transform: translateX(0.6rem); }
      `}</style>
    </section>
  );
}
