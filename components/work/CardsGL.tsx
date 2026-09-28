"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * One WebGL layer that re-draws every `[data-gl-card]` image on the page, kept
 * pixel-locked to its DOM box. Because the images live in a shader they can do
 * what an <img> can't:
 *   · bend like fabric with scroll velocity (and split RGB at speed)
 *   · open with a curved wipe as they enter the viewport
 *   · zoom and lean toward the cursor on hover
 *   · play a silent reel of the live site on hover, frames dissolving through
 *     animated noise
 * If WebGL is unavailable the plain DOM images simply stay visible.
 */

const VERT = /* glsl */ `
  uniform float uVel;
  uniform float uReveal;
  varying vec2 vUv;
  #define PI 3.14159265
  void main(){
    vUv = uv;
    vec3 p = position;
    // fabric: the card bows against the direction of travel
    p.y += sin(uv.x * PI) * uVel * 0.09;
    p.x += sin(uv.y * PI) * uVel * 0.012;
    // entering: bottom edge lifts in on a curve
    p.y -= (1.0 - uReveal) * 0.12 * (1.0 - uv.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex0;
  uniform sampler2D uTex1;
  uniform vec2 uImg0;
  uniform vec2 uImg1;
  uniform vec2 uRes;
  uniform float uRadius;
  uniform float uMix;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uVel;
  uniform float uReveal;
  uniform float uTime;
  varying vec2 vUv;

  vec2 cover(vec2 uv, vec2 res, vec2 img){
    float rs = res.x / res.y, ri = img.x / img.y;
    vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
    return (uv - 0.5) * s + 0.5;
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  float sdRound(vec2 p, vec2 b, float r){
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  vec3 sample0(vec2 uv, vec2 off){
    vec2 c = cover(uv, uRes, uImg0);
    return vec3(texture2D(uTex0, c + off).r, texture2D(uTex0, c).g, texture2D(uTex0, c - off).b);
  }
  vec3 sample1(vec2 uv, vec2 off){
    vec2 c = cover(uv, uRes, uImg1);
    return vec3(texture2D(uTex1, c + off).r, texture2D(uTex1, c).g, texture2D(uTex1, c - off).b);
  }
  void main(){
    // hover: zoom in and lean toward the cursor
    vec2 uv = (vUv - 0.5) * (1.0 - 0.07 * uHover) + 0.5 + (uMouse - 0.5) * 0.035 * uHover;
    vec2 off = vec2(uVel * 0.006, 0.0);
    vec3 a = sample0(uv, off);
    vec3 col = a;
    if (uMix > 0.001) {
      vec3 b = sample1(uv, off);
      float n = noise(vUv * 5.0 + uTime * 0.3) * 0.7 + noise(vUv * 18.0) * 0.3;
      float edge = smoothstep(uMix - 0.12, uMix + 0.02, n);
      col = mix(b, a, edge);
      // a thin bright seam rides the dissolve front
      col += vec3(0.9, 0.8, 0.6) * (1.0 - smoothstep(0.0, 0.06, abs(n - uMix))) * 0.35 * step(0.01, uMix) * step(uMix, 0.99);
    }
    // soft light that follows the cursor
    float l = smoothstep(0.55, 0.0, distance(vUv, uMouse)) * uHover;
    col += l * 0.08;

    // rounded rect in CSS pixels
    vec2 px = vUv * uRes;
    float d = sdRound(px - uRes * 0.5, uRes * 0.5, uRadius);
    float alpha = 1.0 - smoothstep(-1.0, 0.5, d);
    // curved reveal wipe from the bottom
    float front = uReveal * 1.25 - (1.0 - vUv.y) - sin(vUv.x * 3.14159) * 0.12;
    alpha *= smoothstep(0.0, 0.04, front);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

type Card = {
  el: HTMLElement;
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  reel: string[];
  frame: number;
  hover: number;
  hoverT: number;
  mouse: THREE.Vector2;
  reveal: number;
  seen: boolean;
  nextAt: number;
  mixing: boolean;
  ready: boolean;
};

const loader = new THREE.TextureLoader();
const cache = new Map<string, Promise<THREE.Texture>>();
function tex(src: string) {
  if (!cache.has(src))
    cache.set(
      src,
      new Promise((res, rej) =>
        loader.load(
          src,
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.minFilter = THREE.LinearFilter;
            t.generateMipmaps = false;
            res(t);
          },
          undefined,
          rej
        )
      )
    );
  return cache.get(src)!;
}
const size = (t: THREE.Texture) => {
  const i = t.image as { width: number; height: number };
  return new THREE.Vector2(i.width, i.height);
};

export default function CardsGL({ scope }: { scope: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = scope.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    const geo = new THREE.PlaneGeometry(1, 1, 32, 32);
    let vw = 0,
      vh = 0;
    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      renderer.setSize(vw, vh, false);
      camera.left = -vw / 2;
      camera.right = vw / 2;
      camera.top = vh / 2;
      camera.bottom = -vh / 2;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const blank = new THREE.DataTexture(new Uint8Array([20, 20, 22, 255]), 1, 1);
    blank.needsUpdate = true;
    const cards: Card[] = [];

    root.querySelectorAll<HTMLElement>("[data-gl-card]").forEach((el) => {
      const reel = JSON.parse(el.dataset.glReel || "[]") as string[];
      const cover = el.dataset.glCard!;
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        uniforms: {
          uTex0: { value: blank },
          uTex1: { value: blank },
          uImg0: { value: new THREE.Vector2(1, 1) },
          uImg1: { value: new THREE.Vector2(1, 1) },
          uRes: { value: new THREE.Vector2(1, 1) },
          uRadius: { value: 18 },
          uMix: { value: 0 },
          uHover: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uVel: { value: 0 },
          uReveal: { value: reduced ? 1 : 0 },
          uTime: { value: 0 },
        },
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      scene.add(mesh);
      const c: Card = {
        el,
        mesh,
        mat,
        reel: [cover, ...reel],
        frame: 0,
        hover: 0,
        hoverT: 0,
        mouse: new THREE.Vector2(0.5, 0.5),
        reveal: reduced ? 1 : 0,
        seen: reduced,
        nextAt: 0,
        mixing: false,
        ready: false,
      };
      cards.push(c);
      tex(cover).then((t) => {
        mat.uniforms.uTex0.value = t;
        mat.uniforms.uImg0.value = size(t);
        c.ready = true;
        el.classList.add("gl-on");
      });

      const onEnter = () => {
        c.hoverT = 1;
        c.nextAt = performance.now() + 250;
        c.reel.slice(1).forEach((s) => tex(s)); // warm the reel
      };
      const onLeave = () => {
        c.hoverT = 0;
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        c.mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      };
      const link = el.closest("a") || el;
      link.addEventListener("pointerenter", onEnter);
      link.addEventListener("pointerleave", onLeave);
      link.addEventListener("pointermove", onMove as EventListener);
    });

    // advance a card's reel by one frame with the dissolve
    const advance = (c: Card) => {
      if (c.mixing || c.reel.length < 2) return;
      const next = (c.frame + 1) % c.reel.length;
      c.mixing = true;
      tex(c.reel[next]).then((t) => {
        c.mat.uniforms.uTex1.value = t;
        c.mat.uniforms.uImg1.value = size(t);
        const start = performance.now();
        const step = () => {
          const k = Math.min(1, (performance.now() - start) / 850);
          c.mat.uniforms.uMix.value = k * k * (3 - 2 * k);
          if (k < 1) requestAnimationFrame(step);
          else {
            c.mat.uniforms.uTex0.value = t;
            c.mat.uniforms.uImg0.value = size(t);
            c.mat.uniforms.uMix.value = 0;
            c.frame = next;
            c.mixing = false;
          }
        };
        requestAnimationFrame(step);
      });
    };

    let vel = 0;
    let raf = 0;
    let visible = false;
    const t0 = performance.now();
    const loop = () => {
      const now = performance.now();
      const lenis = (window as unknown as { lenis?: Lenis }).lenis;
      const target = reduced ? 0 : Math.max(-1.6, Math.min(1.6, (lenis?.velocity ?? 0) / 28));
      vel += (target - vel) * 0.12;

      // touch screens: the card nearest the centre plays its reel
      let centre: Card | null = null;
      if (coarse) {
        let best = Infinity;
        for (const c of cards) {
          const r = c.el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - vh / 2);
          if (d < best && d < vh * 0.25) {
            best = d;
            centre = c;
          }
        }
      }

      for (const c of cards) {
        const r = c.el.getBoundingClientRect();
        const on = r.bottom > -40 && r.top < vh + 40 && r.width > 0;
        c.mesh.visible = on && c.ready;
        if (!on) continue;
        if (!c.seen && r.top < vh * 0.92) c.seen = true;
        if (c.seen) c.reveal += (1 - c.reveal) * 0.06;
        if (coarse) c.hoverT = c === centre ? 1 : 0;
        c.hover += (c.hoverT - c.hover) * 0.1;
        if (c.hoverT && now > c.nextAt) {
          advance(c);
          c.nextAt = now + 1500;
        }

        c.mesh.position.set(r.left + r.width / 2 - vw / 2, vh / 2 - r.top - r.height / 2, 0);
        c.mesh.scale.set(r.width, r.height, 1);
        const u = c.mat.uniforms;
        u.uRes.value.set(r.width, r.height);
        u.uVel.value = vel;
        u.uHover.value = c.hover;
        u.uMouse.value.lerp(c.mouse, 0.12);
        u.uReveal.value = c.reveal;
        u.uTime.value = (now - t0) / 1000;
        u.uRadius.value = parseFloat(getComputedStyle(c.el).borderTopLeftRadius) || 18;
      }
      renderer.render(scene, camera);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
      if (!visible) {
        renderer.clear();
      }
    });
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      cards.forEach((c) => {
        c.mat.dispose();
        c.el.classList.remove("gl-on");
      });
      geo.dispose();
      renderer.dispose();
    };
  }, [scope]);

  return <canvas ref={canvasRef} className="cards-gl" aria-hidden />;
}
