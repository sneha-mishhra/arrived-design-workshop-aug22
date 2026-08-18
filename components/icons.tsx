import type { ReactNode } from "react";

/**
 * A small inline icon set, drawn on a 20x20 grid at a single stroke weight so
 * the marks sit together as one family. Inline rather than an icon package:
 * there are six of them, and they inherit `currentColor` from whatever tile
 * they are dropped into.
 */

type IconProps = { className?: string };

function Icon({
  children,
  className = "",
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-[18px] ${className}`}
    >
      {children}
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10.5 8 14.5 16 5.5" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4.5" width="14" height="12" rx="2" />
      <path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
      <path d="m3 6 7 5 7-5" />
    </Icon>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="5" width="10" height="10" rx="2" />
      <path d="m12.5 10 5-3v6l-5-3Z" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4.3l2.8 1.7" />
    </Icon>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 3.2c.6 3.3 1.5 4.2 4.8 4.8-3.3.6-4.2 1.5-4.8 4.8-.6-3.3-1.5-4.2-4.8-4.8 3.3-.6 4.2-1.5 4.8-4.8Z" />
      <path d="M15.2 13.4c.3 1.5.7 1.9 2.2 2.2-1.5.3-1.9.7-2.2 2.2-.3-1.5-.7-1.9-2.2-2.2 1.5-.3 1.9-.7 2.2-2.2Z" />
    </Icon>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1.2 1.2" />
      <path d="M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1.2-1.2" />
    </Icon>
  );
}

/** Brand marks are solid shapes, so they opt out of the stroked Icon wrapper. */
export function LinkedInIcon({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-[17px] ${className}`}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21h-4V9Z" />
    </svg>
  );
}

export function XIcon({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-[15px] ${className}`}
    >
      <path d="M17.53 3h3.06l-6.69 7.64L21.75 21h-6.16l-4.83-6.3L5.24 21H2.18l7.15-8.17L2.25 3h6.32l4.36 5.77L17.53 3Zm-1.07 16.15h1.7L7.62 4.76H5.8l10.66 14.39Z" />
    </svg>
  );
}

/**
 * Drawn as an outline rather than a solid glyph: the mark is a camera body, a
 * lens and a flash, and at 18px a filled version collapses into a smudge.
 */
export function InstagramIcon({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className={`size-[19px] ${className}`}
    >
      <rect x="3" y="3" width="18" height="18" rx="5.4" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-[17px] ${className}`}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-[17px] ${className}`}
    >
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.51 3.75 1.4 5.32L2 22l4.98-1.55a9.8 9.8 0 0 0 5.06 1.4h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.77 9.77 0 0 0 12.04 2Zm0 1.8a8 8 0 0 1 8.04 8.04c0 4.45-3.6 8.04-8.04 8.04a8.1 8.1 0 0 1-4.34-1.26l-.31-.19-2.95.92.94-2.88-.2-.32a7.98 7.98 0 0 1-1.24-4.31c0-4.45 3.6-8.04 8.1-8.04Zm-2.4 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.55 2.02.8 2.43.64 2.87.6.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.3-.73-1.78-.19-.46-.39-.4-.53-.4h-.47Z" />
    </svg>
  );
}

/**
 * Rounded tile that carries an icon. The dock along the bottom of the
 * confirmation page is a row of these, and the floating chips each start with
 * one.
 */
export function IconTile({
  children,
  tone = "sky",
  className = "",
}: {
  children: ReactNode;
  tone?: "sky" | "mint" | "sand" | "ink" | "lime";
  className?: string;
}) {
  const tones = {
    sky: "bg-brand-violet text-white",
    mint: "bg-brand-green text-brand-ink",
    sand: "bg-brand-violet-deep text-white",
    ink: "bg-brand-ink text-white",
    lime: "bg-(--event-primary-bg) text-(--event-primary-text)",
  } as const;

  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-[10px] shadow-[0_2px_8px_rgba(9,9,9,0.16)] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
