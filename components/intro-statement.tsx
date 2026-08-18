"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * The page's spoken headline: one bold sentence with small images set into the
 * line, each cycling through its own set on a timer.
 *
 * The two slots carry different jobs: the work that comes out of the session,
 * then the people doing it, so the sentence shows what it is describing while
 * it says it.
 *
 * Slots offset their timers so the two never swap on the same beat, which is
 * what stops the effect reading as a slideshow. Under reduced motion the
 * interval never starts and each slot holds its first image.
 */

// One looping clip per slot. Each carries its own motion, so crossfading
// between several would be movement stacked on movement; the slot code skips
// its timer whenever there is only one source.
//
// Slot A uses the untouched original: palette reduction wrecked the globe's
// smooth gradients. It is heavy, and that is a deliberate trade for fidelity.
const SLOT_A = ["/a-1.gif"];
const SLOT_B = ["/b-1-web.gif"];


/** How long each image holds before the crossfade to the next one. */
const HOLD_MS = 2600;

function InlineSlot({
  images,
  delay,
  label,
}: {
  images: string[];
  /** Milliseconds to stagger this slot behind the other one. */
  delay: number;
  label: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(
        () => setIndex((i) => (i + 1) % images.length),
        HOLD_MS,
      );
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [images.length, delay]);

  return (
    <span
      role="img"
      aria-label={label}
      className="relative mx-1.5 inline-block h-[0.72em] w-[1.44em] shrink-0 translate-y-[0.04em] overflow-hidden rounded-full bg-brand-violet/15 align-middle sm:mx-2"
    >
      {images.map((src, i) =>
        src.endsWith(".gif") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ) : (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="160px"
            className="object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
            priority={i === 0}
          />
        ),
      )}
    </span>
  );
}

export function IntroStatement() {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-balance text-[clamp(1.75rem,5.2vw,3.25rem)] font-bold leading-[1.15] tracking-[-0.02em] text-brand-ink">
        Learn to build custom event sites
        <InlineSlot images={SLOT_B} delay={0} label="Event sites built on Arrived" />
        with Arrived and get paid
        <InlineSlot images={SLOT_A} delay={1300} label="Designers at work" />
        for it.
      </p>

      <p className="mx-auto mt-7 max-w-2xl text-balance text-sm text-brand-ink/55 sm:text-base">
        For people who love building amazing events: designers, vibe coders,
        event marketers, freelancers.
      </p>
    </div>
  );
}
