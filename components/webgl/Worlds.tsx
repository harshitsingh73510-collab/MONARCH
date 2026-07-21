"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const CARD_W = 2.85;
const CARD_H = 1.78;
const SPACING = 3.05;
// lift the whole rig into the upper half of the stage so the caption text has a
// clean band beneath the cards (no more text-over-card overlap)
const GROUP_Y = 1.95;

/**
 * MONARCH "worlds" — the case studies as physical cards floating in 3D space
 * (a cover-flow the visitor flies through). `progressRef` (0..1) is driven by
 * the section scroll; the focused card comes forward, flat and lit with a
 * champagne rim, while the others recede and turn away. Cards are clickable and
 * the whole rig parallaxes gently toward the pointer.
 */
export default function Worlds({
  images,
  progressRef,
  onSelect,
  onOpen,
}: {
  images: string[];
  progressRef: React.MutableRefObject<number>;
  onSelect?: (i: number) => void;
  onOpen?: (i: number) => void;
}) {
  const textures = useTexture(images) as THREE.Texture[];
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
  }, [textures]);

  const groups = useRef<THREE.Group[]>([]);
  const rig = useRef<THREE.Group>(null);
  const N = images.length;
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const f = progressRef.current * (N - 1);
    const focus = Math.round(f);
    const k = Math.min(1, d * 7);

    // responsive fit: shrink the whole rig so the focused card always fits the
    // viewport width with breathing room — this is what makes it work on a
    // narrow phone as well as a wide desktop.
    const fit = THREE.MathUtils.clamp(
      (viewport.width * 0.82) / CARD_W,
      0.34,
      1
    );

    for (let i = 0; i < N; i++) {
      const g = groups.current[i];
      if (!g) continue;
      const offset = i - f;
      const ax = Math.abs(offset);
      const compression = 1 / (1 + ax * 0.16);
      const tx = offset * SPACING * compression;
      const tz = -ax * 1.7;
      const ry = THREE.MathUtils.clamp(-offset * 0.5, -0.95, 0.95);
      const scale = 1 + Math.max(0, 1 - ax) * 0.12;

      g.position.x += (tx - g.position.x) * k;
      g.position.z += (tz - g.position.z) * k;
      g.rotation.y += (ry - g.rotation.y) * k;
      const s = g.scale.x + (scale - g.scale.x) * k;
      g.scale.setScalar(s);
      // a whisper of independent float
      g.position.y = Math.sin(t * 0.6 + i * 1.3) * 0.03;

      const img = g.children[0] as THREE.Mesh;
      const imgMat = img.material as THREE.MeshBasicMaterial;
      const targetOp = THREE.MathUtils.clamp(1 - ax * 0.26, 0.16, 1);
      imgMat.opacity += (targetOp - imgMat.opacity) * k;

      const glow = g.children[1] as THREE.Mesh;
      const glowMat = glow.material as THREE.MeshBasicMaterial;
      const targetGlow = i === focus ? 0.85 : 0;
      glowMat.opacity += (targetGlow - glowMat.opacity) * k;
    }

    // scroll-driven only — the rig holds a fixed, centred position and just
    // eases its responsive fit scale (no pointer/cursor parallax)
    if (rig.current) {
      rig.current.position.x += (0 - rig.current.position.x) * k * 0.6;
      rig.current.position.y += (GROUP_Y - rig.current.position.y) * k * 0.6;
      const rs = rig.current.scale.x + (fit - rig.current.scale.x) * k;
      rig.current.scale.setScalar(rs);
    }
  });

  return (
    <group ref={rig} position={[0, GROUP_Y, 0]}>
      {images.map((img, i) => (
        <group
          key={img}
          ref={(el) => {
            if (el) groups.current[i] = el;
          }}
          position={[i * SPACING, 0, -2]}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            // clicking the focused (front) card opens its live site; clicking a
            // side card brings it to the front first
            const focus = Math.round(progressRef.current * (N - 1));
            if (i === focus) onOpen?.(i);
            else onSelect?.(i);
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          {/* image card (child 0) */}
          <mesh>
            <planeGeometry args={[CARD_W, CARD_H]} />
            <meshBasicMaterial
              map={textures[i]}
              transparent
              opacity={1}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* champagne rim/halo behind (child 1) — glows on focus */}
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[CARD_W + 0.16, CARD_H + 0.16]} />
            <meshBasicMaterial
              color={"#e8c98f"}
              transparent
              opacity={0}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
