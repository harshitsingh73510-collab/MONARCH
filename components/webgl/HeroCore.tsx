"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
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
  const wrapRef = useRef<HTMLDivElement>(null);
  // Only render frames while the hero is actually on screen. Once the visitor
  // scrolls into the work/story below, the sphere stops burning GPU entirely —
  // this is the single biggest smoothness win for the rest of the page.
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (c.getContext("webgl2") || c.getContext("webgl")) setOk(true);
    } catch {
      /* no webgl — the DOM hero still stands */
    }
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ok]);

  if (!ok) return null;

  return (
    <Boundary>
      <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
        <Canvas
          frameloop={onScreen ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 1.75]}
          style={{ position: "absolute", inset: 0 }}
        >
          <IntelligenceCore />
        </Canvas>
      </div>
    </Boundary>
  );
}
