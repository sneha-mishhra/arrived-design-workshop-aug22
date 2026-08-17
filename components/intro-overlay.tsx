"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const INTRO_DONE_EVENT = "arrived:intro-done";

/** Marks the intro finished and releases the hero, whether it played or not. */
function finish() {
  document.documentElement.setAttribute("data-intro-done", "true");
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

/**
 * Opening curtain: "hello", then "welcome", then the sheet lifts to reveal the
 * page. Each greeting arrives with its own hand-drawn underline, which is the
 * same annotation vocabulary the rest of the canvas uses.
 *
 * Plays on every load, refreshes included. Only reduced motion skips it, and
 * there the hero is handed control immediately instead.
 */
export function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    if (reduced) {
      root.remove();
      finish();
      return;
    }

    document.body.style.overflow = "hidden";

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.body.style.overflow = "";
        finish();
        root.remove();
      },
    });

    const word = (el: HTMLElement | null, hold: number) => {
      if (!el) return;

      const text = el.querySelector("[data-word]");
      const rule = el.querySelector("[data-rule]");

      timeline
        // The wrapper starts hidden so the two greetings can be stacked on top
        // of each other; each one is revealed as its turn comes up.
        .set(el, { opacity: 1 })
        .fromTo(
          text,
          { opacity: 0, y: 26, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5 },
        )
        .fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, ease: "power2.inOut" },
          "-=0.25",
        )
        .to(el, { opacity: 0, y: -18, duration: 0.35, ease: "power2.in" }, `+=${hold}`);
    };

    word(helloRef.current, 0.35);
    word(welcomeRef.current, 0.3);

    // Lift from the bottom edge so the hero is uncovered upward.
    timeline.to(root, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.85,
      ease: "power4.inOut",
    });

    return () => {
      timeline.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-100 grid place-items-center bg-white"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="relative">
        <div
          ref={helloRef}
          className="absolute inset-0 grid place-items-center opacity-0"
        >
          <Greeting>hello</Greeting>
        </div>
        <div ref={welcomeRef} className="grid place-items-center opacity-0">
          <Greeting>welcome</Greeting>
        </div>
      </div>
    </div>
  );
}

function Greeting({ children }: { children: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        data-word
        className="text-5xl font-light leading-none tracking-[-0.02em] text-[#090909] sm:text-7xl"
      >
        {children}
      </span>
      <span
        data-rule
        className="block h-px w-[120%] origin-left bg-[#090909]/50"
      />
    </div>
  );
}
