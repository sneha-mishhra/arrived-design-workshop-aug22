"use client";

import { useEffect, useState } from "react";

type Phase = "before" | "live" | "over";

/** How long after the start time the session still counts as live. */
const LIVE_WINDOW_MS = 90 * 60 * 1000;

function partsFrom(msRemaining: number) {
  const total = Math.max(0, Math.floor(msRemaining / 1000));

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Ticking countdown to the session. Renders a blank placeholder until the first
 * client tick: the remaining time is different on the server by definition, and
 * rendering it during SSR would guarantee a hydration mismatch.
 *
 * Once the start time passes the label flips to live, then to a closed state
 * after the session window, so a late visitor never sees a countdown at zero.
 */
export function Countdown({
  startDate,
  className = "",
}: {
  startDate: string | null;
  className?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("before");

  useEffect(() => {
    if (!startDate) return;

    const target = new Date(startDate).getTime();
    if (Number.isNaN(target)) return;

    const tick = () => {
      const diff = target - Date.now();

      if (diff <= 0) {
        const next: Phase = diff > -LIVE_WINDOW_MS ? "live" : "over";
        setPhase(next);
        setLabel(next === "live" ? "We are live now" : "This session has ended");
        return;
      }

      const { days, hours, minutes, seconds } = partsFrom(diff);
      setPhase("before");
      setLabel(
        `Starts in ${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`,
      );
    };

    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, [startDate]);

  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] tabular-nums sm:text-xs ${className}`}
      suppressHydrationWarning
    >
      {phase === "live" ? (
        <span className="size-2 animate-pulse rounded-full bg-[#E0396B]" />
      ) : null}
      {label ?? " "}
    </span>
  );
}
