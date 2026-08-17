"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { INTRO_DONE_EVENT } from "./intro-overlay";

/**
 * The hero's entrance, played once the opening curtain has lifted.
 *
 * The order is the order a designer would actually build the thing in: the
 * canvas furniture first (ruler, grid), then the title wiping up line by line,
 * then the selection box snapping around it with its handles, then the details,
 * and finally the annotations landing on top.
 *
 * Children opt in through data attributes, so anything unmarked simply renders.
 * Under prefers-reduced-motion nothing animates and nothing is hidden, which is
 * why the pre-animation state is set in JS: if the script never runs, the hero
 * is already fully visible.
 */
export function HeroIntro({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);

      const titleLines = q("[data-hero-title] span > span");
      const frame = q("[data-selection-frame]");
      const handles = q("[data-selection-handle]");
      const frameLabel = q("[data-selection-label]");
      const items = q("[data-hero-item]");
      const stickers = q("[data-hero-sticker]");

      // Hold everything back before the curtain lifts, otherwise the hero
      // finishes animating behind it and reveals a static page.
      gsap.set([items, stickers, frame, frameLabel], { opacity: 0 });
      gsap.set(titleLines, { yPercent: 115, opacity: 0 });
      gsap.set(frame, { scale: 1.06 });
      gsap.set(handles, { scale: 0 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      timeline
        // Each word climbs out of its own line box, so the title assembles
        // rather than simply appearing.
        .to(titleLines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
        })
        // The marquee snaps shut around the finished title, then the handles
        // pop one corner at a time.
        .to(frame, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.3")
        .to(
          handles,
          { scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(3)" },
          "-=0.25",
        )
        .to(frameLabel, { opacity: 1, duration: 0.3 }, "-=0.2")
        .to(
          items,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.15",
        )
        .to(
          stickers,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(2.2)",
          },
          "-=0.4",
        );

      // Items rise as they fade; set the offset after the timeline is built so
      // the `to` above has somewhere to travel from.
      gsap.set(items, { y: 22 });
      gsap.set(stickers, { scale: 0.75 });

      const start = () => timeline.play();

      if (document.documentElement.dataset.introDone === "true") {
        start();
      } else {
        window.addEventListener(INTRO_DONE_EVENT, start, { once: true });
      }

      // Scroll-linked tilt: each annotation pivots on its own centre as the
      // page moves, so the corners swing while the sticker stays where it was
      // stuck. Scrubbed, so it tracks scroll position exactly and unwinds on
      // the way back up. Relative degrees, so each sticker rocks away from
      // whatever tilt it was placed at.
      gsap.registerPlugin(ScrollTrigger);

      // Idle wiggle on the sticker bodies, independent of the shells the scroll
      // tilt drives. Each one gets its own angle, speed and offset from
      // gsap.utils.random, because identical timing across every sticker reads
      // as a loop rather than as paper reacting to the room.
      const wiggleTweens = q("[data-sticker-body]").map((body) =>
        gsap.to(body, {
          rotation: `+=${gsap.utils.random(1.4, 2.6, 0.1)}`,
          duration: gsap.utils.random(1.6, 2.6, 0.1),
          delay: gsap.utils.random(0, 1.2, 0.1),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
      );

      const tilters = q("[data-hero-tilt]");
      const tiltTweens = tilters.map((target) => {
        const degrees = Number((target as HTMLElement).dataset.heroTilt) || 0;

        return gsap.to(target, {
          rotation: `+=${degrees}`,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      return () => {
        window.removeEventListener(INTRO_DONE_EVENT, start);
        timeline.kill();
        tiltTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        wiggleTweens.forEach((tween) => tween.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
