"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

import { INTRO_DONE_EVENT } from "./intro-overlay";

/**
 * The hero's entrance, played once the opening curtain has lifted.
 *
 * The framed artwork settles first, easing down from a slight overscale so it
 * reads as the image coming to rest in its frame, then the details laid over
 * it rise in sequence.
 *
 * Children opt in through `data-hero-item` (the frame) and `data-hero-copy`
 * (the overlay), so anything unmarked simply renders. Under reduced motion
 * nothing animates and nothing is hidden, which is why the pre-animation state
 * is set in JS: if the script never runs, the hero is already visible.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const frame = q("[data-hero-item]");
      const copy = q("[data-hero-copy]");

      if (!frame.length) return;

      gsap.set(frame, { opacity: 0, scale: 1.03 });
      if (copy.length) gsap.set(copy, { opacity: 0, y: 20 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      timeline.to(frame, { opacity: 1, scale: 1, duration: 1.1 });

      if (copy.length) {
        timeline.to(
          copy,
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          "-=0.6",
        );
      }

      const start = () => timeline.play();

      if (document.documentElement.dataset.introDone === "true") {
        start();
      } else {
        window.addEventListener(INTRO_DONE_EVENT, start, { once: true });
      }

      return () => {
        window.removeEventListener(INTRO_DONE_EVENT, start);
        timeline.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
