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

  const { positions, colors, home } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
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
      const c = Math.random() < gold ? champagne : platinum;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, home };
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

    const breathe = 1 + Math.sin(t * 0.6) * 0.02;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const hx = home[ix] * breathe;
      const hy = home[ix + 1] * breathe;
      const hz = home[ix + 2] * breathe;
      let x = arr[ix];
      let y = arr[ix + 1];
      let z = arr[ix + 2];

      // spring home
      x += (hx - x) * d * 3.2;
      y += (hy - y) * d * 3.2;
      z += (hz - z) * d * 3.2;

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
