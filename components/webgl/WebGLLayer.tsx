"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";

// three.js cannot server-render — load only on the client, after mount.
const WebGLBackdrop = dynamic(() => import("./WebGLBackdrop"), { ssr: false });

/** If WebGL/three fails on a device, silently drop the layer — never crash the page. */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* swallow — the DOM experience stands on its own */
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function WebGLLayer() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // guard against environments without WebGL
    try {
      const c = document.createElement("canvas");
      const gl =
        c.getContext("webgl2") || c.getContext("webgl");
      if (gl) setOk(true);
    } catch {
      /* no webgl — leave the layer off */
    }
  }, []);

  if (!ok) return null;
  return (
    <Boundary>
      <WebGLBackdrop />
    </Boundary>
  );
}
