"use client";

import { useEffect, useState } from "react";

import {
  CheckIcon,
  IconTile,
  LinkedInIcon,
  LinkIcon,
  WhatsAppIcon,
  XIcon,
} from "./icons";

/**
 * Share controls for the confirmation screen.
 *
 * The origin is read when a button is pressed rather than stored during an
 * effect: it keeps the links correct across local, preview and production
 * without a first paint where they are empty or disabled.
 *
 * Every target points at the event page rather than this one, so anyone
 * following the link lands somewhere they can actually register.
 */
export function ShareRow({ message }: { message: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const shareUrl = () => `${window.location.origin}/`;

  const targets = [
    {
      name: "LinkedIn",
      tone: "sky" as const,
      icon: <LinkedInIcon />,
      // LinkedIn ignores any text passed alongside the URL and builds its card
      // from the page's own metadata, so only the link is sent.
      href: (url: string) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "X",
      tone: "ink" as const,
      icon: <XIcon />,
      href: (url: string) =>
        `https://x.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      tone: "mint" as const,
      icon: <WhatsAppIcon />,
      href: (url: string) =>
        `https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
    } catch {
      // Clipboard access can be refused by the browser; nothing to recover
      // from, the other share targets still work.
    }
  };

  return (
    <div className="mt-14 text-center">
      <p className="text-xl font-semibold sm:text-2xl">
        Know someone who&rsquo;d be interested?
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-black/55">
        Send them the page. Seats are free, and the room is better with more
        people in it.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/90 p-2.5 shadow-[0_6px_22px_rgba(9,9,9,0.09)] backdrop-blur-sm">
        {targets.map((target) => (
          <button
            key={target.name}
            type="button"
            aria-label={`Share on ${target.name}`}
            onClick={() =>
              window.open(
                target.href(shareUrl()),
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="transition-transform hover:-translate-y-0.5"
          >
            <IconTile tone={target.tone}>{target.icon}</IconTile>
          </button>
        ))}

        <span className="mx-1 h-6 w-px bg-black/10" />

        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-black/70 transition-colors hover:bg-black/5 hover:text-brand-ink"
        >
          {copied ? (
            <CheckIcon className="size-4 text-brand-violet" />
          ) : (
            <LinkIcon className="size-4" />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
