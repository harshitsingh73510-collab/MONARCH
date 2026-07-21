"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import SignatureReveal from "@/components/SignatureReveal";
import Worlds3DNav from "@/components/sections/Worlds3DNav";
import { hasWebGL, prefersReducedMotion } from "@/lib/motion";

type Project = {
  name: string;
  category: string;
  line: string;
  role: string;
  year: string;
  image: string;
  focus: string; // background-position
  url: string;
};

const PROJECTS: Project[] = [
  {
    name: "Noir",
    category: "Fragrance house · Cinematic web",
    line: "A house of invisible luxury — a perfume brand staged as a scent you move through, not a page you scroll.",
    role: "Art Direction · WebGL · Motion",
    year: "2025",
    image: "/assets/work-noir.webp",
    focus: "center",
    url: "https://p3-nwiw.vercel.app",
  },
  {
    name: "Solace",
    category: "Property · The Vela, Dubai",
    line: "A single tower on the Gulf, sold the way it deserves — an interactive masterplan and a cinematic sales gallery.",
    role: "Experience · Engineering",
    year: "2025",
    image: "/assets/work-solace.webp",
    focus: "center",
    url: "https://solace-development-group.vercel.app",
  },
  {
    name: "Studio Aurea",
    category: "Architecture studio · Editorial",
    line: "Architecture remembered for generations — a warm, editorial world for a firm that builds in stone and light.",
    role: "Brand · Art Direction · Web",
    year: "2025",
    image: "/assets/work-aurea.webp",
    focus: "center 60%",
    url: "https://studio-aurea-gray.vercel.app",
  },
  {
    name: "Strata",
    category: "Architecture practice · Live 3D",
    line: "Built on the blueprint-to-reality process — a live 3D massing model that assembles itself as you explore.",
    role: "Design · Creative Technology",
    year: "2025",
    image: "/assets/work-strata.webp",
    focus: "center",
    url: "https://strata-weld-two.vercel.app",
  },
];

function Panel({ p, i }: { p: Project; i: number }) {
  const wrapRef = useRef<HTMLAnchorElement>(null);
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

    // one low tone as each case study takes the screen (sound is opt-in)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) sound.chime("enter");
        }
      },
      { threshold: 0.6 }
    );
    io.observe(wrap);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <a
      ref={wrapRef}
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${p.name} — open live site in a new tab`}
      data-cursor="label"
      data-cursor-label="VISIT ↗"
      className="work-panel"
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        textDecoration: "none",
        color: "inherit",
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
            <span
              className="work-visit eyebrow text-champagne"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1.6rem" }}
            >
              Visit live site ↗
            </span>
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
    </a>
  );
}

export default function SelectedWork() {
  // Render the 2D panels on the server and as the universal fallback. Upgrade to
  // the 3D worlds navigator only on capable clients (WebGL · fine pointer · wide
  // viewport · motion allowed). A runtime WebGL error drops back to 2D.
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    // Runs on EVERY device with WebGL — phones, tablets, desktops. The scene is
    // responsive + touch-navigable. Only genuinely incapable clients (no WebGL)
    // or visitors who ask for reduced motion get the 2D panel fallback.
    setUse3D(hasWebGL() && !prefersReducedMotion());
  }, []);

  return (
    <section id="work" style={{ position: "relative", zIndex: 2 }}>
      <SignatureReveal
        className="section"
        style={{ maxWidth: "84rem", margin: "0 auto", paddingBlock: "16vh 8vh", textAlign: "center" }}
      >
        <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
          05 — Selected work
        </p>
        <h2 className="display-md font-display" style={{ maxWidth: "18ch", margin: "0 auto" }}>
          A few worlds we&apos;ve been trusted to build.
        </h2>
      </SignatureReveal>

      {use3D ? (
        <Worlds3DNav projects={PROJECTS} onFail={() => setUse3D(false)} />
      ) : (
        PROJECTS.map((p, i) => <Panel key={p.name} p={p} i={i} />)
      )}

      <style>{`
        .work-panel .work-title { transition: transform .6s var(--ease-cine); }
        .work-panel:hover .work-title { transform: translateX(0.6rem); }
        .work-visit { opacity: .55; transition: opacity .5s var(--ease-cine), transform .5s var(--ease-cine); }
        .work-panel:hover .work-visit { opacity: 1; transform: translateX(0.3rem); }
      `}</style>
    </section>
  );
}
