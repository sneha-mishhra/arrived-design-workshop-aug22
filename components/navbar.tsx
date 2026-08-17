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
 * links, with Register filled in as the page's one job. Labels only, so the
 * row stays quiet next to the wordmark.
 */

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
              className={`flex items-center rounded-full px-3.5 py-1.5 transition-colors ${
                isPrimary
                  ? "bg-[#090909] text-white hover:opacity-90"
                  : isActive
                    ? "bg-[#38BDF8] text-white"
                    : "text-[#090909]/70 hover:bg-black/5 hover:text-[#090909]"
              }`}
            >
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
