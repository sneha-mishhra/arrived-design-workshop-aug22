"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const INTRO_DONE_EVENT = "arrived:intro-done";

/** Marks the intro finished and releases the hero, whether it played or not. */
function finish() {
  document.documentElement.setAttribute("data-intro-done", "true");
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

const WORD = "ARRIVED";
const BINARY = "01";
/** How long each letter stays scrambled before it locks in. */
const LOCK_STEP_MS = 130;
const SCRAMBLE_TICK_MS = 55;

/**
 * Opening loader: a row of flickering ones and zeros that resolve, letter by
 * letter, into the wordmark, with a counter racing alongside it. The binary is
 * borrowed from the hero artwork, so the load reads as part of the same picture
 * rather than a generic spinner.
 *
 * Plays on every load. Reduced motion skips it entirely and hands straight to
 * the hero, which is why the hero holds its own entrance until the event fires.
 */
export function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [chars, setChars] = useState<string[]>(() => WORD.split(""));
  const [locked, setLocked] = useState(WORD.length);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.remove();
      finish();
      return;
    }

    document.body.style.overflow = "hidden";
    const kickoff = window.setTimeout(() => setLocked(0), 0);

    // Flicker every unlocked position; the locked prefix holds the real word.
    let lockedCount = 0;
    const scramble = window.setInterval(() => {
      setChars(
        WORD.split("").map((letter, i) =>
          i < lockedCount
            ? letter
            : BINARY[Math.floor(Math.random() * BINARY.length)],
        ),
      );
    }, SCRAMBLE_TICK_MS);

    const lock = window.setInterval(() => {
      lockedCount += 1;
      setLocked(lockedCount);
      if (lockedCount >= WORD.length) window.clearInterval(lock);
    }, LOCK_STEP_MS);

    const counter = { value: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        finish();
        root.remove();
      },
    });

    timeline
      .to(counter, {
        value: 100,
        duration: WORD.length * (LOCK_STEP_MS / 1000) + 0.35,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(counter.value);
          if (countRef.current) {
            countRef.current.textContent = String(v).padStart(3, "0");
          }
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${v / 100})`;
          }
        },
      })
      .add(() => {
        window.clearInterval(scramble);
        setChars(WORD.split(""));
        setLocked(WORD.length);
      })
      // Lift from the bottom edge so the hero is uncovered upward.
      .to(root, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.8,
        ease: "power4.inOut",
      }, "+=0.25");

    // Failsafe. The timeline runs on requestAnimationFrame, which browsers
    // pause in background tabs, and the curtain locks body scroll while it is
    // up. If it has not finished by now, drop it rather than leave the page
    // stranded behind an opaque sheet.
    const bailout = window.setTimeout(() => {
      if (!document.documentElement.dataset.introDone) {
        timeline.kill();
        document.body.style.overflow = "";
        finish();
        root.remove();
      }
    }, 4000);

    return () => {
      window.clearTimeout(bailout);
      window.clearTimeout(kickoff);
      window.clearInterval(scramble);
      window.clearInterval(lock);
      timeline.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-100 grid place-items-center bg-page-bg"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <p className="flex gap-[0.04em] text-xl font-bold tracking-[0.16em] tabular-nums sm:text-2xl">
          {chars.map((char, i) => (
            <span
              key={i}
              className={
                i < locked ? "text-brand-ink" : "text-brand-green"
              }
            >
              {char}
            </span>
          ))}
        </p>

        <div className="flex w-[min(60vw,180px)] flex-col gap-2.5">
          <span className="block h-px w-full bg-brand-ink/12">
            <span
              ref={barRef}
              className="block h-full w-full origin-left bg-brand-violet"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span
            ref={countRef}
            className="text-[11px] font-semibold tracking-[0.16em] tabular-nums text-brand-ink/45"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
