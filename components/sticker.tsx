import type { ReactNode } from "react";

/**
 * Tilted sticker label, the kind that gets slapped onto a moodboard. Rotation
 * is passed in degrees so each instance can sit at its own angle; a shared
 * angle across several of them reads as a template, which is the opposite of
 * what this is for.
 */

const TONES = {
  mint: "bg-[#B9E3D0] text-black",
  sand: "bg-[#EFDFA8] text-black",
  sky: "bg-[#BFE4F7] text-black",
  ink: "bg-[#090909] text-white",
  lime: "bg-(--event-primary-bg) text-(--event-primary-text)",
} as const;

export type StickerTone = keyof typeof TONES;

export function Sticker({
  children,
  tone = "mint",
  rotate = -4,
  className = "",
  ...rest
}: {
  children: ReactNode;
  tone?: StickerTone;
  /** Degrees of tilt. Keep it small, 2 to 8 either way. */
  rotate?: number;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  // Two layers on purpose: the shell owns placement and whatever scroll-linked
  // rotation the page applies to it, while the body owns the resting tilt and
  // the idle wiggle. One element cannot carry two independent rotations.
  return (
    <span className={`inline-block ${className}`} {...rest}>
      <span
        data-sticker-body
        className={`inline-block px-3 py-1.5 text-[11px] uppercase leading-none tracking-[0.1em] shadow-[0_2px_10px_rgba(9,9,9,0.12)] ${TONES[tone]}`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * The little name tag that trails a collaborator's cursor in a shared file.
 * Static and decorative here: it marks up the canvas without pretending anyone
 * else is actually in the room.
 */
export function CursorTag({
  name,
  color = "#38BDF8",
  className = "",
}: {
  name: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-flex items-start gap-1 ${className}`}
    >
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
        <path
          d="M1 1L1 14.5L4.8 11.2L7.2 16.5L9.6 15.4L7.2 10.2L12 10.2L1 1Z"
          fill={color}
          stroke="white"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="translate-y-2 rounded-sm px-1.5 py-0.5 text-[10px] uppercase leading-none tracking-[0.08em] text-white"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </span>
  );
}
