"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * A collaborator's cursor, the kind you see moving around a shared design file:
 * an arrow with a name tag trailing half a beat behind it.
 *
 * Only engages for fine pointers, and only then hides the native cursor, so
 * touch users, keyboard users and anyone who hits a JS error keep the real one.
 * Reduced-motion visitors keep it too: a lagging custom cursor is exactly the
 * kind of movement that setting asks us to drop.
 */
export function CanvasCursor({ name = "you" }: { name?: string }) {
  const arrowRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    const arrow = arrowRef.current;
    const tag = tagRef.current;
    if (!arrow || !tag) return;

    const root = document.documentElement;
    root.classList.add("has-canvas-cursor");

    // The tag lags behind the arrow, which is what sells it as a cursor being
    // dragged around rather than two elements pinned to the same point.
    const arrowX = gsap.quickTo(arrow, "x", { duration: 0.08, ease: "power3" });
    const arrowY = gsap.quickTo(arrow, "y", { duration: 0.08, ease: "power3" });
    const tagX = gsap.quickTo(tag, "x", { duration: 0.28, ease: "power3" });
    const tagY = gsap.quickTo(tag, "y", { duration: 0.28, ease: "power3" });

    let seen = false;
    const onMove = (event: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.set([arrow, tag], { x: event.clientX, y: event.clientY });
        gsap.to([arrow, tag], { opacity: 1, duration: 0.25 });
      }

      arrowX(event.clientX);
      arrowY(event.clientY);
      tagX(event.clientX);
      tagY(event.clientY);
    };

    const INTERACTIVE = "a, button, input, textarea, select, [role='button']";
    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement)?.closest?.(INTERACTIVE);
      gsap.to(arrow, {
        scale: target ? 1.35 : 1,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    const onLeave = () => gsap.to([arrow, tag], { opacity: 0, duration: 0.2 });
    const onEnter = () => {
      if (seen) gsap.to([arrow, tag], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      root.classList.remove("has-canvas-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      gsap.killTweensOf([arrow, tag]);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-9999">
      <div
        ref={arrowRef}
        className="absolute left-0 top-0 opacity-0 will-change-transform"
      >
        <svg width="20" height="24" viewBox="0 0 14 18" fill="none">
          <path
            d="M1 1L1 14.5L4.8 11.2L7.2 16.5L9.6 15.4L7.2 10.2L12 10.2L1 1Z"
            fill="#38BDF8"
            stroke="white"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        ref={tagRef}
        className="absolute left-0 top-0 translate-x-4 translate-y-5 opacity-0 will-change-transform"
      >
        <span className="rounded-sm bg-[#38BDF8] px-1.5 py-0.5 text-[10px] uppercase leading-none tracking-[0.08em] text-white">
          {name}
        </span>
      </div>
    </div>
  );
}
