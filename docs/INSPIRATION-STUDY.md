# MONARCH — Inspiration Study & Gap Analysis

A study of best-in-class sites, filtered through one rule: **keep Monarch's feel and
technology (void black · titanium · champagne · particle Intelligence Core · peel ·
R3F v9 · GSAP · Lenis).** Take the *idea*, never the skin. Nothing here replaces a
signature system — everything is additive or an in-place upgrade.

---

## 1. What Monarch already nails (do NOT rebuild)

- Particle **Intelligence Core** hero — scroll-velocity dispersion + cursor parting, seeded per session.
- **Peel** signature transition (brushed-titanium sheet with a champagne seam).
- **3D Worlds** cover-flow navigator for work (+ 2D panel fallback).
- Custom **cursor** (dot / ring / label), grain + vignette, opt-in WebAudio **sound**.
- **Lenis** smooth scroll, scroll-progress bar, staggered blur-in wordmark, reveal system.
- Contact form wired to `/api/contact`.

This is already a strong, coherent dark-luxury build. The gaps below are about **depth,
first-impression, and the "award-site" interaction layer** — not the fundamentals.

---

## 2. The reference lexicon — one thing to steal from each

| Site | The single move worth stealing |
|---|---|
| **obys.agency** | WebGL image **hover-distortion** in the work grid + **magnetic** UI + page-transition curtains |
| **ultranoir.com** | Cinematic dark WebGL + a **curtain transition** between routes |
| **dogstudio / hellomonday** | A crafted **preloader** that hands off into the hero (first 3 seconds) |
| **monopo.london** | **Kinetic typography** — velocity-reactive marquees, split-line scrub |
| **paveldogreat fluid** | Pointer-reactive **fluid/ink** field (GPU ping-pong) |
| **resn / makemepulse** | Playful, immersive **interactive WebGL** as a section, bold cursor |
| **rolls-royce Spectre** | **Chapter-based scroll-scrubbed** product reveal, bespoke tone |
| **porsche** | **Configurator** — a real interactive tool, technical-spec precision |
| **richard mille** | Extreme restraint, **macro material detail**, product-as-hero |
| **omniyat** | A **collection / project index** with interior depth (not a one-pager) |
| **videinfra / ERA** | Deep **modular case-study** scroll storytelling |
| **aman** | Restraint, whitespace, slow calm, a **journal** for legitimacy |
| **threejs keyframes / webglsamples blob** | A **real reflective 3D object** (env-mapped chrome), not a faked video orb |

---

## 3. Gap analysis → prioritized fills

Effort scale: ● small · ●● medium · ●●● large.

### TIER A — signature moves (highest lift on perceived craft)

**A1 · Ignition preloader ●●**
*Ref: dogstudio, hellomonday, ultranoir.* Monarch currently just fades Arrival in after
200ms — there is no "first three seconds." Build an `<Ignition>` overlay: void screen,
a champagne line/counter runs to 100 while `document.fonts.ready` + a min ~1.4s resolve,
then **the existing `.peel` titanium sheet peels up to reveal the hero.** The peel is
already the brand's signature move — making it the *opening curtain* makes it earn its
keep twice. Stack: GSAP timeline + the peel CSS already in `globals.css`.

**A2 · WebGL hover-distortion on work ●●**
*Ref: obys, monopo, ultranoir.* The award-site tell. Work thumbnails get a small R3F
plane with a **displacement + subtle champagne RGB-split** shader driven by a hover
progress uniform and mouse position — image warps toward the cursor and settles on
leave. Pure R3F v9, sits inside the existing Worlds/panel system. This is the single
biggest "this studio is elite" upgrade.

**A3 · Interior case-study pages + peel page-transition ●●●**
*Ref: omniyat, videinfra/ERA, richard mille, ultranoir.* Today work opens **external in a
new tab** — Monarch's world has no interior; it ends at the hero. Add `/work/[slug]`
routes with a **curtain transition** (the champagne peel sheet sweeps across → route
swaps → retracts to reveal). Each case study = hero + scroll-scrubbed story + "visit
live" CTA. This turns Monarch from a one-pager into an actual studio site with depth.

### TIER B — texture & delight (cheaper, high polish-per-line)

**B1 · Pointer-reactive fluid/ink interlude ●●**
*Ref: paveldogreat, resn.* One dark section (Vision or Contact) gets a **low-res GPU
ping-pong fluid**: champagne ink blooming under the cursor on void black, dialed *way*
down so it reads as living metal-smoke, not a toy. Additive background only — the
particle hero stays the signature.

**B2 · Kinetic typography ●–●●**
*Ref: monopo, obys.* A **velocity-reactive marquee** band ("DIGITAL EXPERIENCE STUDIO ·")
that skews/accelerates with scroll velocity — and you already track it
(`getScrollVelocity` in `lib/motion`). Plus **split-line reveals** that scrub on scroll
for the big statements. Reuses existing velocity infra.

**B3 · Magnetic CTAs + refined link hovers ●**
*Ref: obys.* Buttons lerp toward the cursor within a radius; nav links get a clip/char
reveal on hover instead of a plain color fade. Tiny amount of code, immediately reads as
premium. Pairs with the existing cursor system.

### TIER C — depth & credibility (content-driven)

**C1 · Field notes / journal ●●** — *aman, omniyat.* A short index of thinking pieces.
Adds legitimacy and an SEO surface a one-pager can't have.

**C2 · "Shape your engagement" configurator ●●●** — *porsche.* Pick scope → the page
assembles a tailored brief. A genuine interactive tool instead of a static form. Optional
— watch for scope creep.

### In-place upgrade (not a new feature)

**U1 · Real reflective heart ●●** — *threejs keyframes, webglsamples blob.* The hero's
"liquid-metal heart" is currently a **masked looping .mp4**. The reference sites would do
this as **real env-mapped chrome geometry** (drei metaball / MeshTransmission + a
RoomEnvironment). The particle Intelligence Core — the actual signature — stays untouched;
only the faked video orb becomes real, reflective geometry. Honest craft upgrade.

---

## 4. Recommended build order

1. **A1 Ignition** — biggest first-impression jump, reuses the peel.
2. **B3 Magnetic/links** — cheap, instantly felt.
3. **A2 Hover-distortion** — the award-site signature.
4. **B2 Kinetic type** — reuses velocity infra.
5. **A3 Case-study pages + curtain** — the structural leap to a "real site."
6. **B1 Fluid interlude** / **U1 real heart** — texture upgrades.
7. **C1 Journal** / **C2 configurator** — depth, as scope allows.

Guardrails: never hide the cursor; never disable a signature WebGL system to gain perf —
optimize in place; every fluid/type effect stays restrained enough to read *luxury*, not
*playground*.
