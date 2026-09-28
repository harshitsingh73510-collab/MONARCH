"use client";

import Reveal from "@/components/Reveal";
import TLink from "@/components/transition/TLink";

const MAKE = [
  ["Immersive web", "WebGL worlds you enter, not websites you visit."],
  ["Creative direction", "One idea, carried from the first sentence to the last frame."],
  ["Interactive motion", "Movement that carries meaning, never noise."],
  ["Brand worlds", "Identities with the weight of something permanent."],
  ["Creative engineering", "Built to last, tuned to the final one percent."],
];

const WAY = [
  ["Small on purpose", "Monarch takes on a few projects at a time, so each one gets the whole studio."],
  ["Work, not decks", "We make it move early. Ideas are judged on screen, not in slides."],
  ["One point of view", "Every project answers a single question: what should this feel like?"],
];

export default function StudioIntro({ part = "intro" }: { part?: "intro" | "make" | "end" }) {
  if (part === "make")
    return (
      <section className="section" style={{ paddingBlock: "clamp(7rem,18vh,12rem)" }}>
        <div className="st-grid">
          <Reveal>
            <p className="eyebrow">What we make</p>
          </Reveal>
          <ul className="st-list">
            {MAKE.map(([t, d], i) => (
              <Reveal key={t} delay={i * 70}>
                <li>
                  <span className="eyebrow text-champagne">{String(i + 1).padStart(2, "0")}</span>
                  <span className="st-t font-display">{t}</span>
                  <span className="st-d">{d}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="st-grid" style={{ marginTop: "clamp(6rem,14vh,10rem)" }}>
          <Reveal>
            <p className="eyebrow">How we work</p>
          </Reveal>
          <div className="st-way">
            {WAY.map(([t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <div>
                  <h3 className="font-display">{t}</h3>
                  <p>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <style>{STYLE}</style>
      </section>
    );

  if (part === "end")
    return (
      <section className="section" style={{ paddingBlock: "clamp(8rem,20vh,14rem)", textAlign: "center" }}>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "1.6rem" }}>
            The proof
          </p>
          <h2 className="display-lg font-display" style={{ maxWidth: "16ch", margin: "0 auto 2.6rem" }}>
            We&apos;d rather show you.
          </h2>
          <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" }}>
            <TLink href="/work" label="Work" className="font-mono cta cta-primary" data-cursor-label="OPEN →">
              Enter the worlds
            </TLink>
            <TLink href="/contact" label="Let's begin" className="font-mono cta cta-ghost">
              Start a project
            </TLink>
          </div>
        </Reveal>
      </section>
    );

  return (
    <section className="section st-hero">
      <div className="st-hero-in">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: "2rem" }}>
            Studio
          </p>
          <h1 className="st-h1 font-display">
            <span className="mask-line">
              <span>A small studio</span>
            </span>
            <span className="mask-line">
              <span style={{ transitionDelay: ".1s" }}>for experiences</span>
            </span>
            <span className="mask-line">
              <span style={{ transitionDelay: ".2s" }}>
                with a <span className="text-champagne">point of view.</span>
              </span>
            </span>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="lede" style={{ maxWidth: "40ch", marginTop: "2.4rem" }}>
            Monarch is a digital experience studio. We engineer immersive brands, products and
            interactive experiences the world doesn&apos;t forget.
          </p>
        </Reveal>
      </div>
      <style>{STYLE}</style>
    </section>
  );
}

const STYLE = `
  .st-hero { min-height: 92svh; display: flex; align-items: flex-end; padding-bottom: clamp(3rem, 10vh, 7rem); }
  .st-hero-in { max-width: 88rem; margin: 0 auto; width: 100%; }
  .st-h1 { font-weight: 300; font-size: clamp(2.8rem, 8.4vw, 8.6rem); line-height: 0.95; letter-spacing: -0.045em; }
  .st-grid { max-width: 88rem; margin: 0 auto; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,2.2fr); gap: 2rem clamp(2rem,6vw,6rem); }
  .st-list { list-style: none; border-top: 1px solid var(--fog); }
  .st-list li { display: grid; grid-template-columns: 3rem minmax(0,1fr) minmax(0,1.2fr); gap: 1rem 2rem; align-items: baseline; padding: 1.4rem 0; border-bottom: 1px solid var(--fog); }
  .st-t { font-size: clamp(1.3rem, 2.4vw, 2.1rem); font-weight: 300; letter-spacing: -0.02em; }
  .st-d { color: var(--titanium); }
  .st-way { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 2rem; }
  .st-way h3 { font-weight: 400; font-size: clamp(1.2rem, 1.7vw, 1.5rem); margin-bottom: 0.8rem; }
  .st-way p { color: var(--titanium); line-height: 1.6; }
  @media (max-width: 860px) {
    .st-grid { grid-template-columns: 1fr; }
    .st-way { grid-template-columns: 1fr; }
    .st-list li { grid-template-columns: 2.4rem 1fr; }
    .st-list .st-d { grid-column: 2; }
  }
`;
