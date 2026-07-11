"use client";

import { Canvas } from "@react-three/fiber";
import Particles from "./Particles";

/**
 * Fixed, transparent WebGL layer that sits behind the DOM content.
 * A single cursor-reactive particle constellation — the ambient
 * "intelligence field" that runs the whole experience.
 */
export default function WebGLBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 12], fov: 55 }}
        dpr={[1, 1.75]}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
