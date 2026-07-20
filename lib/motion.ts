/**
 * Shared motion primitives for MONARCH.
 * - reduced-motion helper (SSR-safe)
 * - a single global scroll-velocity tracker read by the hero sphere AND the
 *   cursor smear, so velocity is measured once and stays consistent.
 * - a per-session seed so repeat visitors see subtle variation, not a replay.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True if the browser can give us a WebGL context. */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/* ---- per-session seed (Tier 2.5) ------------------------------------- */
// Seeded once per tab load from the session timestamp. Deterministic mulberry32
// so the same session is stable across reads, but a fresh visit differs.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let _sessionSeed: number | null = null;
export function sessionSeed(): number {
  if (_sessionSeed !== null) return _sessionSeed;
  // Persist within a tab session so React StrictMode double-mounts agree.
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem("monarch:seed");
  } catch {
    /* private mode — fall through to timestamp */
  }
  _sessionSeed = stored ? Number(stored) : Date.now() % 1_000_000;
  try {
    if (!stored) sessionStorage.setItem("monarch:seed", String(_sessionSeed));
  } catch {
    /* ignore */
  }
  return _sessionSeed;
}

/** A seeded RNG for this session — used to vary the particle field per visit. */
export function seededRandom() {
  return mulberry32(sessionSeed());
}

/* ---- global scroll velocity (Tier 1.2) ------------------------------- */
// Normalised, smoothed |velocity| in [0..1+]. One listener, ref-counted so
// multiple consumers share it and it tears down cleanly.
let _lastY = 0;
let _rawVel = 0; // px since last sample
let _smoothVel = 0; // eased, normalised
let _consumers = 0;
let _raf = 0;
let _lastT = 0;

function onScroll() {
  const y = window.scrollY;
  _rawVel += Math.abs(y - _lastY);
  _lastY = y;
}

function tick(t: number) {
  const dt = _lastT ? Math.min((t - _lastT) / 1000, 0.05) : 0.016;
  _lastT = t;
  // px/second normalised against ~1 viewport/sec, then eased toward it
  const target = Math.min(_rawVel / (dt * window.innerHeight || 1), 2);
  _smoothVel += (target - _smoothVel) * Math.min(1, dt * 6);
  _rawVel = 0;
  _raf = requestAnimationFrame(tick);
}

export function subscribeScrollVelocity(): () => void {
  if (typeof window === "undefined") return () => {};
  if (_consumers === 0) {
    _lastY = window.scrollY;
    _lastT = 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    _raf = requestAnimationFrame(tick);
  }
  _consumers++;
  return () => {
    _consumers = Math.max(0, _consumers - 1);
    if (_consumers === 0) {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(_raf);
      _smoothVel = 0;
      _rawVel = 0;
    }
  };
}

/** Smoothed normalised scroll speed (0 at rest, ~1 at a brisk flick). */
export function getScrollVelocity(): number {
  return _smoothVel;
}
