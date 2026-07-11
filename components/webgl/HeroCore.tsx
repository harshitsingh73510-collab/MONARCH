"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

const IntelligenceCore = dynamic(() => import("./IntelligenceCore"), {
  ssr: false,
});

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroCore() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (c.getContext("webgl2") || c.getContext("webgl")) setOk(true);
    } catch {
      /* no webgl — the DOM hero still stands */
    }
  }, []);

  if (!ok) return null;

  return (
    <Boundary>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.75]}
        style={{ position: "absolute", inset: 0 }}
      >
        <IntelligenceCore />
      </Canvas>
    </Boundary>
  );
}
