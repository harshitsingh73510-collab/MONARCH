"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
 * rotates slowly and parts around the cursor — a living intelligence that
 * reacts to the user. The site's single, deliberate WebGL investment.
 */
export default function IntelligenceCore({ count = 6400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();
  const sprite = useMemo(() => makeSprite(), []);
  const RADIUS = 1.55;

  const { positions, colors, home, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    const platinum = new THREE.Color("#e9eaec");
    const champagne = new THREE.Color("#e8c98f");
    const gold = 0.16; // fraction champagne
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      // slight radial jitter so the shell has depth
      const rr = RADIUS * (0.92 + Math.random() * 0.16);
      const x = Math.cos(theta) * r * rr;
      const z = Math.sin(theta) * r * rr;
      const yy = y * rr;
      positions[i * 3] = home[i * 3] = x;
      positions[i * 3 + 1] = home[i * 3 + 1] = yy;
      positions[i * 3 + 2] = home[i * 3 + 2] = z;
      // per-particle phase so EVERY particle drifts on its own rhythm
      seeds[i * 3] = Math.random() * Math.PI * 2;
      seeds[i * 3 + 1] = Math.random() * Math.PI * 2;
      seeds[i * 3 + 2] = Math.random() * Math.PI * 2;
      const c = Math.random() < gold ? champagne : platinum;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, home, seeds };
  }, [count]);

  const mouse = useRef(new THREE.Vector3(999, 999, 0));

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);

    // cursor in world space near the core's front
    mouse.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      RADIUS
    );

    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;

    // only react to the cursor while the hero is actually on screen — and when
    // it's scrolled away, snap the shell home so it's always pristine on return
    const heroVisible =
      typeof window !== "undefined" &&
      window.scrollY < window.innerHeight * 0.85;
    const springK = heroVisible ? 3.6 : 16; // hard snap-home when off-screen

    const breathe = 1 + Math.sin(t * 0.6) * 0.025;
    const AMP = 0.045; // subtle churn — alive but the shell reads as one object

    // rotation is BAKED into the per-particle target (not the object
    // transform) so local space stays aligned with world space — the cursor
    // then parts every side of the sphere symmetrically (fixes "dead" side).
    const ang = t * 0.05;
    const cosA = Math.cos(ang);
    const sinA = Math.sin(ang);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const bx = home[ix];
      const bz = home[ix + 2];
      const rx = bx * cosA + bz * sinA;
      const rz = -bx * sinA + bz * cosA;
      const ox = Math.sin(t * 0.9 + seeds[ix]) * AMP;
      const oy = Math.sin(t * 1.15 + seeds[ix + 1]) * AMP;
      const oz = Math.cos(t * 0.8 + seeds[ix + 2]) * AMP;
      const hx = rx * breathe + ox;
      const hy = home[ix + 1] * breathe + oy;
      const hz = rz * breathe + oz;
      let x = arr[ix];
      let y = arr[ix + 1];
      let z = arr[ix + 2];

      // spring toward the living target (critically damped-ish, always returns)
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
          const R2 = 2.3; // wider reach
          if (dist2 < R2) {
            const f = (1 - dist2 / R2) * front * d * 16; // stronger push
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
