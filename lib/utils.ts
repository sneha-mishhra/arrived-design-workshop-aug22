import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smooth-scroll to the element referenced by an anchor's hash,
 * offset for a sticky header. Call the optional callback after scrolling.
 */
export function scrollToTargetAdjusted(
  e: React.MouseEvent<HTMLAnchorElement>,
  callback?: () => void,
) {
  const hash = new URL(e.currentTarget.href).hash;
  if (!hash) return;

  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  e.preventDefault();

  const headerOffset = 96;
  const top =
    target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({ top, behavior: "smooth" });

  callback?.();
}
