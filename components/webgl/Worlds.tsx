"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const CARD_W = 3.15;
const CARD_H = 1.97;
const SPACING = 3.05;
const GROUP_Y = 0.28;

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
}: {
  images: string[];
  progressRef: React.MutableRefObject<number>;
  onSelect?: (i: number) => void;
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

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const f = progressRef.current * (N - 1);
    const focus = Math.round(f);
    const k = Math.min(1, d * 7);

    for (let i = 0; i < N; i++) {
      const g = groups.current[i];
      if (!g) continue;
      const offset = i - f;
      const ax = Math.abs(offset);
      const compression = 1 / (1 + ax * 0.16);
      const tx = offset * SPACING * compression;
      const tz = -ax * 1.7;
      const ry = THREE.MathUtils.clamp(-offset * 0.5, -0.95, 0.95);
      const scale = 1 + Math.max(0, 1 - ax) * 0.16;

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

    // camera-follow parallax for depth
    if (rig.current) {
      const px = state.pointer.x * 0.5;
      const py = state.pointer.y * 0.28;
      rig.current.position.x += (px - rig.current.position.x) * k * 0.6;
      rig.current.position.y +=
        (GROUP_Y + py - rig.current.position.y) * k * 0.6;
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
            onSelect?.(i);
          }}
          onPointerOver={() => (document.body.style.cursor = "none")}
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
