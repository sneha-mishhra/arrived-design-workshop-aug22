"use client";

import { useEffect, useState } from "react";

import { ScrollLink } from "./scroll-link";

export type NavLinkItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  nav: NavLinkItem[];
  ctaText?: string;
  ctaHref?: string;
};

// Extract the "#foo" portion from an href like "/#about" or "#about".
function hashOf(href: string): string {
  const idx = href.indexOf("#");
  return idx === -1 ? "" : href.slice(idx);
}

/**
 * A floating toolbar rather than a header bar: one rounded panel holding the
 * links, with the active one filled in. It reads as a control in a design app,
 * which is the language the rest of the page is speaking.
 *
 * Each link carries a small glyph, drawn inline so the toolbar has no icon
 * dependency and the marks stay on the same ink as the label.
 */
const GLYPHS: Record<string, string> = {
  // house
  About: "M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3v-4H7v4H4a1 1 0 0 1-1-1Z",
  // stacked rows
  Agenda: "M4 5h12M4 10h12M4 15h8",
  // question mark
  FAQ: "M7.5 7.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3M10 15h.01",
  // frame
  Gallery: "M4 5h12v10H4z M4 12l3-3 3 3 2-2 4 4",
  // arrow into a slot
  Register: "M4 12h9M10 8l4 4-4 4M16 4v12",
};

function Glyph({ label }: { label: string }) {
  const path = GLYPHS[label];
  if (!path) return null;

  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Navbar({ nav, ctaText, ctaHref }: NavbarProps) {
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const sync = () => setActiveHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <div className="hidden items-center gap-3 md:flex">
      <nav className="flex items-center gap-1 rounded-full border border-black/10 bg-white/90 p-1 text-[11px] uppercase tracking-[0.1em] shadow-[0_2px_14px_rgba(9,9,9,0.07)] backdrop-blur-sm">
        {nav.map((link) => {
          const linkHash = hashOf(link.href);
          const isActive = linkHash === activeHash && activeHash !== "";
          // Register is the page's one job, so it stays filled whether or not
          // it is the section currently in view.
          const isPrimary = linkHash === "#register";

          return (
            <ScrollLink
              key={link.href}
              href={link.href}
              onClick={() => setActiveHash(linkHash)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                isPrimary
                  ? "bg-[#090909] text-white hover:opacity-90"
                  : isActive
                    ? "bg-[#38BDF8] text-white"
                    : "text-[#090909]/70 hover:bg-black/5 hover:text-[#090909]"
              }`}
            >
              <Glyph label={link.label} />
              {link.label}
            </ScrollLink>
          );
        })}
      </nav>

      {ctaHref && ctaText ? (
        <ScrollLink
          href={ctaHref}
          className="group inline-flex items-center gap-2 rounded-full bg-[#090909] py-1.5 pl-1.5 pr-4 text-[11px] uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5"
        >
          <span className="grid size-6 place-items-center rounded-full bg-(--event-primary-bg) text-[#090909]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {ctaText}
        </ScrollLink>
      ) : null}
    </div>
  );
}
