"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getScrollVelocity,
  prefersReducedMotion,
  seededRandom,
  subscribeScrollVelocity,
} from "@/lib/motion";

function makeSprite() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}

/**
 * The MONARCH Intelligence Core.
 * A shell of particles on a sphere (fibonacci distribution) that breathes,
 * rotates slowly and reacts to the visitor:
 *   - cursor proximity parts the field
 *   - SCROLL VELOCITY scatters the shell outward; on pause it reforms toward
 *     the wordmark (Tier 1.2)
 *   - the field is seeded per session so repeat visits differ subtly (Tier 2.5)
 * Reduced-motion visitors get a still, gently-breathing shell with no
 * velocity- or cursor-tracking.
 */
export default function IntelligenceCore({ count = 6400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();
  const sprite = useMemo(() => makeSprite(), []);
  const RADIUS = 1.55;
  const reduced = useMemo(() => prefersReducedMotion(), []);

  // keep the shared scroll-velocity tracker alive for this component's life
  useEffect(() => subscribeScrollVelocity(), []);

  const { positions, colors, home, seeds } = useMemo(() => {
    const rand = seededRandom(); // per-session RNG (Tier 2.5)
    const positions = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    const platinum = new THREE.Color("#e9eaec");
    const champagne = new THREE.Color("#e8c98f");
    // gold fraction wobbles a touch per session (0.12–0.20)
    const gold = 0.12 + rand() * 0.08;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      // slight radial jitter so the shell has depth — seeded per session
      const rr = RADIUS * (0.92 + rand() * 0.16);
      const x = Math.cos(theta) * r * rr;
      const z = Math.sin(theta) * r * rr;
      const yy = y * rr;
      positions[i * 3] = home[i * 3] = x;
      positions[i * 3 + 1] = home[i * 3 + 1] = yy;
      positions[i * 3 + 2] = home[i * 3 + 2] = z;
      // per-particle phase so EVERY particle drifts on its own rhythm
      seeds[i * 3] = rand() * Math.PI * 2;
      seeds[i * 3 + 1] = rand() * Math.PI * 2;
      // seeds[.z] doubles as a per-particle scatter bias (0.4–1.0)
      seeds[i * 3 + 2] = 0.4 + rand() * 0.6;
      const c = rand() < gold ? champagne : platinum;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, home, seeds };
  }, [count]);

  const mouse = useRef(new THREE.Vector3(999, 999, 0));
  const scatter = useRef(0); // eased scroll-driven dispersion
  // Own clock that only advances while frames render. R3F's clock keeps
  // running while the hero is paused off-screen; on return the rotation angle
  // had jumped, so every particle sprang sideways to its new home — the
  // "particles slide right and retract" bug.
  const time = useRef(0);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const d = Math.min(delta, 0.05);
    time.current += d;
    const t = time.current;

    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;

    const breathe = 1 + Math.sin(t * 0.6) * 0.025;

    // ---- REDUCED MOTION: gentle breathing shell, nothing else ----
    if (reduced) {
      const ang = t * 0.02;
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const bx = home[ix];
        const bz = home[ix + 2];
        arr[ix] = (bx * cosA + bz * sinA) * breathe;
        arr[ix + 1] = home[ix + 1] * breathe;
        arr[ix + 2] = (-bx * sinA + bz * cosA) * breathe;
      }
      (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
      return;
    }

    // cursor in world space near the core's front
    mouse.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      RADIUS
    );

    // only react while the hero is actually on screen — and when scrolled
    // away, snap the shell home so it's always pristine on return
    const heroVisible =
      typeof window !== "undefined" &&
      window.scrollY < window.innerHeight * 0.85;
    const springK = heroVisible ? 3.6 : 16;

    // scroll velocity → dispersion. eases up fast, reforms slowly toward home.
    const vel = heroVisible ? getScrollVelocity() : 0;
    const targetScatter = Math.min(vel, 1.6) * 0.7;
    const ease = targetScatter > scatter.current ? 8 : 2.4; // scatter fast, reform slow
    scatter.current += (targetScatter - scatter.current) * Math.min(1, d * ease);
    const sc = scatter.current;

    const AMP = 0.045;
    const ang = t * 0.05;
    const cosA = Math.cos(ang);
    const sinA = Math.sin(ang);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const bx = home[ix];
      const by = home[ix + 1];
      const bz = home[ix + 2];
      const rx = bx * cosA + bz * sinA;
      const rz = -bx * sinA + bz * cosA;

      // outward dispersion along the (rotated) radial direction, biased per
      // particle so the shell scatters unevenly like disturbed dust
      const disp = 1 + sc * seeds[ix + 2];

      const ox = Math.sin(t * 0.9 + seeds[ix]) * AMP;
      const oy = Math.sin(t * 1.15 + seeds[ix + 1]) * AMP;
      const oz = Math.cos(t * 0.8 + seeds[ix]) * AMP;
      const hx = rx * breathe * disp + ox;
      const hy = by * breathe * disp + oy;
      const hz = rz * breathe * disp + oz;
      let x = arr[ix];
      let y = arr[ix + 1];
      let z = arr[ix + 2];

      const k = Math.min(1, d * springK);
      x += (hx - x) * k;
      y += (hy - y) * k;
      z += (hz - z) * k;

      // cursor parts the field dramatically — only while the hero is in view
      if (heroVisible) {
        const front = Math.max(0, (z + RADIUS * 0.5) / (RADIUS * 1.5));
        if (front > 0) {
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const dist2 = dx * dx + dy * dy;
          const R2 = 2.3;
          if (dist2 < R2) {
            const f = (1 - dist2 / R2) * front * d * 16;
            const inv = 1 / Math.sqrt(dist2 + 0.001);
            x += dx * inv * f;
            y += dy * inv * f;
            z += f * 0.5;
          }
        }
      }

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }
    (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
      true;
  });

  return (
    // frustumCulled off — we mutate positions every frame, so the stale
    // bounding sphere would make Three cull (blink out) the whole cloud on
    // rotation. This is the fix for the "glitch".
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        vertexColors
        size={0.055}
        sizeAttenuation
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        opacity={0.95}
      />
    </points>
  );
}
