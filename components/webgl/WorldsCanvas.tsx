"use client";

import dynamic from "next/dynamic";
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

const Worlds = dynamic(() => import("./Worlds"), { ssr: false });

class Boundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function WorldsCanvas({
  images,
  progressRef,
  onSelect,
  onOpen,
  onError,
}: {
  images: string[];
  progressRef: React.MutableRefObject<number>;
  onSelect?: (i: number) => void;
  onOpen?: (i: number) => void;
  onError: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Render frames only while the cover-flow is on screen. Paired with the hero
  // sphere's own off-screen pause, this means the two WebGL contexts are never
  // both drawing at once — the fix for the page-wide jank on modest GPUs.
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Boundary onError={onError}>
      <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
        <Canvas
          frameloop={onScreen ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0.2, 7.6], fov: 42 }}
          dpr={[1, 1.5]}
          style={{ position: "absolute", inset: 0 }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Suspense fallback={null}>
            <Worlds
              images={images}
              progressRef={progressRef}
              onSelect={onSelect}
              onOpen={onOpen}
            />
          </Suspense>
        </Canvas>
      </div>
    </Boundary>
  );
}
