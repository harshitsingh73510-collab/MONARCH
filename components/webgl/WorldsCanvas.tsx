"use client";

import dynamic from "next/dynamic";
import { Component, Suspense, type ReactNode } from "react";
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
  onError,
}: {
  images: string[];
  progressRef: React.MutableRefObject<number>;
  onSelect?: (i: number) => void;
  onError: () => void;
}) {
  return (
    <Boundary onError={onError}>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.2, 6.2], fov: 42 }}
        dpr={[1, 1.75]}
        style={{ position: "absolute", inset: 0 }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <Worlds
            images={images}
            progressRef={progressRef}
            onSelect={onSelect}
          />
        </Suspense>
      </Canvas>
    </Boundary>
  );
}
