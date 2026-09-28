"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * MONARCH page transitions — one persistent layer in the root layout.
 * go(href): a brushed-titanium sheet rises, the route swaps behind it, the
 * sheet keeps rising and leaves. Same-page #hash links glide via Lenis.
 */

type Ctx = { go: (href: string, label?: string) => void };
const TransitionCtx = createContext<Ctx | null>(null);

export function useTransition() {
  const c = useContext(TransitionCtx);
  if (!c) throw new Error("useTransition outside provider");
  return c;
}

const lenis = () => (window as unknown as { lenis?: Lenis }).lenis;
const raf2 = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function jump(top: number) {
  lenis()?.scrollTo(top, { immediate: true, force: true });
  window.scrollTo(0, top);
}

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const arrived = useRef<((p: string) => void) | null>(null);

  useEffect(() => {
    arrived.current?.(pathname);
  }, [pathname]);

  const waitForRoute = (path: string) =>
    new Promise<void>((resolve) => {
      if (path === pathname) return resolve();
      const t = setTimeout(resolve, 4000); // never hang the curtain
      arrived.current = (p) => {
        if (p === path) {
          clearTimeout(t);
          arrived.current = null;
          resolve();
        }
      };
    });

  const go = useCallback(
    async (href: string, label?: string) => {
      const [rawPath, hash] = href.split("#");
      const path = rawPath || "/";
      if (path === pathname) {
        if (hash) {
          const el = document.getElementById(hash);
          const l = lenis();
          if (el && l) l.scrollTo(el, { duration: 1.4 });
          else el?.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
      if (busy.current) return;
      busy.current = true;
      const sheet = sheetRef.current!;
      const reduced = prefersReducedMotion();
      if (labelRef.current) labelRef.current.textContent = label || "";
      const ease = "cubic-bezier(.76,0,.24,1)";

      if (!reduced)
        await sheet.animate([{ transform: "translate3d(0,101%,0)" }, { transform: "translate3d(0,0,0)" }], {
          duration: 720,
          easing: ease,
          fill: "forwards",
        }).finished;
      router.push(path, { scroll: false });
      await waitForRoute(path);
      await raf2();
      const target = hash ? document.getElementById(hash) : null;
      jump(target ? target.getBoundingClientRect().top + window.scrollY : 0);
      await raf2();
      if (!reduced) {
        await sleep(120);
        await sheet.animate([{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,-101%,0)" }], {
          duration: 820,
          easing: ease,
          fill: "forwards",
        }).finished;
        sheet.getAnimations().forEach((a) => a.cancel());
      }
      busy.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, router]
  );

  return (
    <TransitionCtx.Provider value={{ go }}>
      {children}
      <div ref={sheetRef} className="tx-sheet" aria-hidden>
        <span className="tx-sheet-word font-display">MONARCH</span>
        <span ref={labelRef} className="tx-sheet-label eyebrow" />
      </div>
    </TransitionCtx.Provider>
  );
}
