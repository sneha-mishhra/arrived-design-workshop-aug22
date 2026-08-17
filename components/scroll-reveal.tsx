"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds of delay after the element enters the viewport. */
  delay?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  /** Rise distance in px. */
  distance?: number;
};

/**
 * Editions-style entrance: content rises and fades as it scrolls into view,
 * once. Under prefers-reduced-motion nothing animates and everything stays
 * visible (gsap.matchMedia handles the branch, and the CSS class below keeps
 * the pre-animation state from sticking).
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  stagger = false,
  distance = 34,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        const targets = stagger
          ? (gsap.utils.toArray(el.children) as HTMLElement[])
          : [el];

        if (reduced) {
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(targets, { opacity: 0, y: distance });

        // Content always travels with the scroll: it rises into place on the
        // way down and sinks back out on the way up, so a section replays
        // every time it is passed rather than only on first sight.
        const animateIn = (fromBelow: boolean) => {
          gsap.killTweensOf(targets);
          gsap.fromTo(
            targets,
            { opacity: 0, y: fromBelow ? distance : -distance },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay,
              ease: "power3.out",
              stagger: stagger ? 0.09 : 0,
              overwrite: "auto",
            },
          );
        };

        const animateOut = (toBelow: boolean) => {
          gsap.killTweensOf(targets);
          gsap.to(targets, {
            opacity: 0,
            y: toBelow ? distance : -distance,
            duration: 0.45,
            ease: "power2.in",
            stagger: stagger ? 0.05 : 0,
            overwrite: "auto",
          });
        };

        // Everything hangs off the entry edge, which every section can reach.
        // An exit tied to the element clearing the top ("bottom top") is
        // unreachable for anything near the end of a short page: the document
        // runs out of scroll first, the reset never fires, and the section can
        // then never replay. Keying both directions to the same line avoids
        // that entirely, and the tween is off-screen either way.
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: () => animateIn(true),
          onLeaveBack: () => animateOut(true),
        });

        return () => {
          st.kill();
          gsap.killTweensOf(targets);
        };
      },
    );

    return () => mm.revert();
  }, [delay, stagger, distance]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Horizontal scroll drift for the marquee: the CSS loop keeps it moving on its
 * own, and this pushes the track further along as the page scrolls, so the
 * strip reacts to the reader rather than running at a constant crawl.
 */
export function ScrollDrift({
  children,
  className,
  distance = 220,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
} & { "aria-hidden"?: boolean | "true" | "false" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const track = el?.firstElementChild as HTMLElement | null;
    if (!el || !track) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        },
      );
    });

    return () => mm.revert();
  }, [distance]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}

/**
 * Vertical parallax: shifts the element as the page scrolls past it. Used to
 * give the cream sections a bit of depth against the black ones.
 */
export function Parallax({
  children,
  className,
  amount = 60,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { y: amount },
        {
          y: -amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    });

    return () => mm.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
