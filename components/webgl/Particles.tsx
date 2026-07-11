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
  g.addColorStop(0.3, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export default function Particles({ count = 2600 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, pointer } = useThree();
  const sprite = useMemo(() => makeSprite(), []);

  const { positions, seeds, home } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // distribute in a soft disc/volume
      const r = Math.pow(Math.random(), 0.5) * 9;
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = (Math.random() - 0.5) * 11;
      const z = Math.sin(a) * r - 2;
      positions[i * 3] = home[i * 3] = x;
      positions[i * 3 + 1] = home[i * 3 + 1] = y;
      positions[i * 3 + 2] = home[i * 3 + 2] = z;
      seeds[i] = Math.random();
    }
    return { positions, seeds, home };
  }, [count]);

  const mouse = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    // cursor projected into world at z=0 plane
    mouse.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;

    const d = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      let x = arr[ix];
      let y = arr[ix + 1];
      const z = arr[ix + 2];

      // drift back toward home + gentle noise sway
      const hx = home[ix];
      const hy = home[ix + 1];
      const sway = Math.sin(t * 0.3 + seeds[i] * 6.28) * 0.15;
      x += (hx + sway - x) * d * 1.2;
      y += (hy - y) * d * 1.2;

      // cursor gravity well (repel close, attract mid)
      const dx = x - mouse.current.x;
      const dy = y - mouse.current.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 9) {
        const f = (1 - dist2 / 9) * d * 6;
        const inv = 1 / Math.sqrt(dist2 + 0.001);
        x += dx * inv * f;
        y += dy * inv * f;
      }

      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = z;
    }
    (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
      true;

    pts.rotation.y = Math.sin(t * 0.05) * 0.12;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={0.075}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={new THREE.Color("#cfd2d6")}
        opacity={0.9}
      />
    </points>
  );
}
