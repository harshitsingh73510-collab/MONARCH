"use client";

import Founder from "@/components/sections/Founder";
import Reveal from "@/components/Reveal";
import TLink from "@/components/transition/TLink";

/**
 * /founder — the point-cloud portrait full-screen, then the note in the
 * founder's own words. No invented history, clients or accolades.
 */
const CARES = [
  {
    t: "A point of view",
    d: "Every project starts with a sentence worth defending. If a site could belong to anyone, it isn't finished.",
  },
  {
    t: "One idea, carried all the way",
    d: "Design, technology and story aren't three departments. They're one decision, made again at every scale.",
  },
  {
    t: "Craft you can feel",
    d: "The last one percent — timing, weight, silence — is the part people remember without knowing why.",
  },
];

export default function FounderProfile() {
  return (
    <main style={{ position: "relative", zIndex: 2 }}>
      <Founder page />

      <section className="section fp">
        <div className="fp-letter">
          <Reveal>
            <p className="eyebrow">A note</p>
          </Reveal>
          <div className="fp-letter-text">
            <Reveal>
              <p>Monarch exists because too much of the internet began to feel interchangeable.</p>
            </Reveal>
            <Reveal delay={120}>
              <p>
                I wanted to build experiences that had a point of view — where design, technology
                and storytelling could become one thing.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="eyebrow fp-sign">— Harshit Singh, Founder / Creative director</p>
            </Reveal>
          </div>
        </div>

        <div className="fp-cares">
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: "2rem" }}>
              What I care about
            </p>
          </Reveal>
          <ol>
            {CARES.map((c, i) => (
              <Reveal key={c.t} delay={i * 90}>
                <li>
                  <span className="eyebrow text-champagne">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="fp-ctas">
            <TLink href="/work" label="Projects" className="pill pill-light">
              <span className="pill-roll" data-text="See the work">
                See the work
              </span>
              <i className="pill-dot" />
            </TLink>
            <TLink href="/contact" label="Let's begin" className="pill pill-dark">
              <span className="pill-roll" data-text="Let's talk">
                Let&apos;s talk
              </span>
              <i className="pill-dot" />
            </TLink>
          </div>
        </div>
      </section>

      <style>{`
        .fp-letter, .fp-cares { max-width: 88rem; margin: 0 auto; }
        .fp-letter { padding-block: clamp(7rem,18vh,12rem); display: grid; grid-template-columns: minmax(0,1fr) minmax(0,2fr); gap: 2rem clamp(2rem,6vw,6rem); }
        .fp-letter-text p { font-family: var(--font-display), sans-serif; font-weight: 300; font-size: clamp(1.5rem,3.2vw,2.9rem); line-height: 1.18; letter-spacing: -0.02em; max-width: 24ch; }
        .fp-letter-text p + p { margin-top: 1.6em; color: var(--titanium); }
        .fp-letter-text .fp-sign { margin-top: 3rem; color: var(--champagne); font-family: var(--font-mono); font-size: .72rem; letter-spacing: .3em; }
        .fp-cares { padding-bottom: clamp(7rem,18vh,12rem); }
        .fp-cares ol { list-style: none; border-top: 1px solid var(--fog); }
        .fp-cares li { display: grid; grid-template-columns: 4rem minmax(0,1fr) minmax(0,1.2fr); gap: 1rem 2rem; padding: clamp(1.6rem,4vh,2.6rem) 0; border-bottom: 1px solid var(--fog); align-items: baseline; }
        .fp-cares h3 { font-family: var(--font-display), sans-serif; font-weight: 300; font-size: clamp(1.5rem,3vw,2.6rem); letter-spacing: -0.03em; }
        .fp-cares li p { color: var(--titanium); max-width: 44ch; }
        .fp-ctas { display: flex; gap: .7rem; flex-wrap: wrap; margin-top: clamp(3rem,8vh,5rem); }
        @media (max-width: 860px) {
          .fp-letter { grid-template-columns: 1fr; }
          .fp-cares li { grid-template-columns: 2.6rem 1fr; }
          .fp-cares li p { grid-column: 2; }
        }
      `}</style>
    </main>
  );
}
