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
export default function IntelligenceCore({ count = 5200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();
  const sprite = useMemo(() => makeSprite(), []);
  const RADIUS = 2.15;

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

    const breathe = 1 + Math.sin(t * 0.6) * 0.03;
    const AMP = 0.09; // continuous churn amplitude — keeps EVERY particle alive

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // living target: home (breathing) + a unique per-particle drift so
      // the entire shell is always in motion, not just where the cursor is
      const ox = Math.sin(t * 0.9 + seeds[ix]) * AMP;
      const oy = Math.sin(t * 1.15 + seeds[ix + 1]) * AMP;
      const oz = Math.cos(t * 0.8 + seeds[ix + 2]) * AMP;
      const hx = home[ix] * breathe + ox;
      const hy = home[ix + 1] * breathe + oy;
      const hz = home[ix + 2] * breathe + oz;
      let x = arr[ix];
      let y = arr[ix + 1];
      let z = arr[ix + 2];

      // spring toward the living target
      x += (hx - x) * d * 3.4;
      y += (hy - y) * d * 3.4;
      z += (hz - z) * d * 3.4;

      // cursor parts the field (only front-facing particles feel it)
      if (z > 0) {
        const dx = x - mouse.current.x;
        const dy = y - mouse.current.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 1.4) {
          const f = (1 - dist2 / 1.4) * d * 9;
          const inv = 1 / Math.sqrt(dist2 + 0.001);
          x += dx * inv * f;
          y += dy * inv * f;
          z += f * 0.5;
        }
      }

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }
    (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
      true;

    // slow, intentional rotation + faint cursor-follow tilt
    pts.rotation.y += d * 0.06;
    pts.rotation.x += (pointer.y * 0.12 - pts.rotation.x) * d * 1.5;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        vertexColors
        size={0.045}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.95}
      />
    </points>
  );
}
