"use client";

import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useTransition } from "./TransitionProvider";

/**
 * Internal link that travels through the MONARCH transition layer instead of
 * hard-cutting. Real <a href> underneath, so middle-click / cmd-click / no-JS
 * all behave like a normal link.
 */
export default function TLink({
  href,
  label,
  children,
  onClick,
  ...rest
}: {
  href: string;
  label?: string;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { go } = useTransition();
  const router = useRouter();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(href, label);
  };

  return (
    <a
      href={href}
      onClick={handle}
      onMouseEnter={() => router.prefetch(href.split("#")[0] || "/")}
      {...rest}
    >
      {children}
    </a>
  );
}
