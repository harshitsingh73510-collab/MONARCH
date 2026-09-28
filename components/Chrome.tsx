"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { sound, SOUND_EVENT } from "@/lib/sound";
import TLink from "@/components/transition/TLink";
import { useTransition } from "@/components/transition/TransitionProvider";
import { PROJECTS } from "@/lib/projects";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/founder", label: "Founder" },
  { href: "/contact", label: "Contact" },
];

// home-page chapters for the active-section readout
const CHAPTERS: [string, string][] = [
  ["problem", "01 — The exception"],
  ["capabilities", "03 — Capabilities"],
  ["process", "04 — Process"],
  ["why", "06 — Why Monarch"],
  ["contact", "07 — Let's begin"],
];

export default function Chrome() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { go } = useTransition();
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState<string | null>(null);
  const [peek, setPeek] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    sound.init();
    setSoundOn(sound.enabled);
    const onSound = (e: Event) => setSoundOn((e as CustomEvent<boolean>).detail);
    window.addEventListener(SOUND_EVENT, onSound);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(SOUND_EVENT, onSound);
    };
  }, [pathname]);

  // active chapter readout (home only)
  useEffect(() => {
    if (!isHome) {
      setChapter(null);
      return;
    }
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const hit = CHAPTERS.find(([id]) => seen.get(id));
        setChapter(hit ? hit[1] : null);
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    const t = setTimeout(() => {
      CHAPTERS.forEach(([id]) => {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }, 300);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [isHome]);

  // full-screen menu: lock scroll, Esc to close, grow from the button
  useEffect(() => {
    const l = (window as unknown as { lenis?: Lenis }).lenis;
    if (open) l?.stop();
    else l?.start();
    const menu = menuRef.current;
    const btn = btnRef.current;
    if (menu && btn) {
      const r = btn.getBoundingClientRect();
      menu.style.setProperty("--ox", `${r.left + r.width / 2}px`);
      menu.style.setProperty("--oy", `${r.top + r.height / 2}px`);
    }
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    menu?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const nav = (href: string, label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => go(href, label), 380);
  };

  const showMark = !isHome || scrolled || open;

  return (
    <>
      <header className={`chrome${open ? " is-menu" : ""}`}>
        <TLink
          href="/"
          label="Home"
          className="font-display chrome-mark"
          style={{
            opacity: showMark ? 1 : 0,
            transform: showMark ? "none" : "translateY(-6px)",
            pointerEvents: showMark ? "auto" : "none",
          }}
        >
          MONARCH
        </TLink>

        <nav className="chrome-nav" aria-label="Primary">
          <button
            type="button"
            onClick={() => sound.toggle()}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute sound" : "Unmute sound"}
            className="pill pill-light pill-round"
          >
            <svg className={`wave${soundOn ? " on" : ""}`} viewBox="0 0 20 12" aria-hidden>
              <path d={soundOn ? "M1 6 Q4 0 7 6 T13 6 T19 6" : "M1 6 L19 6"} />
            </svg>
          </button>
          <TLink href="/contact" label="Let's begin" className="pill pill-dark hide-sm" data-cursor-label="OPEN →">
            <span className="pill-roll" data-text="Let's talk">
              Let&apos;s talk
            </span>
            <i className="pill-dot" />
          </TLink>
          <button
            ref={btnRef}
            type="button"
            className={`pill pill-light chrome-menu-btn${open ? " is-open" : ""}`}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="pill-roll" data-text={open ? "Close" : "Menu"}>
              {open ? "Close" : "Menu"}
            </span>
            <span className="pill-dots" aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </nav>

        <div className="chrome-progress" aria-hidden>
          <div ref={barRef} />
        </div>
      </header>

      {/* active chapter readout */}
      <div className={`chapter-readout eyebrow${chapter && !open ? " is-on" : ""}`} aria-hidden>
        <span className="chapter-tick" />
        <span key={chapter ?? "none"} className="chapter-text">
          {chapter}
        </span>
      </div>

      {/* full-screen menu */}
      <div
        id="site-menu"
        ref={menuRef}
        className={`menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu-inner">
          <ol className="menu-pages">
            {PAGES.map((p, i) => (
              <li key={p.href} style={{ ["--i" as string]: i }}>
                <a
                  href={p.href}
                  onClick={nav(p.href, p.label)}
                  className={`menu-page font-display${pathname === p.href ? " is-active" : ""}`}
                  data-hover
                >
                  <span className="menu-no eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <span className="menu-word">{p.label}</span>
                </a>
              </li>
            ))}
          </ol>

          <div className="menu-side">
            <p className="eyebrow" style={{ marginBottom: "1.4rem" }}>
              Worlds we built
            </p>
            <ul className="menu-work">
              {PROJECTS.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setPeek(p.cover)}
                    onMouseLeave={() => setPeek(null)}
                    onFocus={() => setPeek(p.cover)}
                    onBlur={() => setPeek(null)}
                    data-hover
                  >
                    <span className="eyebrow">{p.no}</span>
                    <span className="font-display">{p.name}</span>
                    <span className="eyebrow menu-work-cat">{p.kind} ↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="menu-peek" style={{ opacity: peek ? 1 : 0 }}>
              {peek && <div style={{ backgroundImage: `url(${peek})` }} />}
            </div>
            <div className="menu-foot">
              <button
                type="button"
                className="eyebrow"
                onClick={() => sound.toggle()}
                style={{ color: soundOn ? "var(--champagne)" : "var(--titanium)" }}
              >
                Sound — {soundOn ? "on" : "off"}
              </button>
              <span className="eyebrow" style={{ color: "var(--titanium-dim)" }}>
                Monarch · Digital experience studio
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
