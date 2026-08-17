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
 * Share controls for the confirmation screen. The link points at the event page
 * rather than this one, so anyone who follows it lands somewhere they can
 * actually register.
 *
 * The URL is read from the browser at mount rather than hardcoded, which keeps
 * it correct across local, preview and production deployments. Until it
 * resolves the buttons stay disabled, so nobody can share a half-formed link.
 */
export function ShareRow({ message }: { message: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/`);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(message);

  const targets = [
    {
      name: "LinkedIn",
      tone: "sky" as const,
      icon: <LinkedInIcon />,
      // LinkedIn strips any text passed alongside the URL and builds the card
      // from the page's own metadata, so only the link is sent.
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "X",
      tone: "ink" as const,
      icon: <XIcon />,
      href: `https://x.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      tone: "mint" as const,
      icon: <WhatsAppIcon />,
      href: `https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard access can be refused; the link is visible in the field
      // below either way, so there is nothing to recover from.
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
          <a
            key={target.name}
            href={url ? target.href : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${target.name}`}
            aria-disabled={!url}
            className={`transition-transform hover:-translate-y-0.5 ${
              url ? "" : "pointer-events-none opacity-40"
            }`}
          >
            <IconTile tone={target.tone}>{target.icon}</IconTile>
          </a>
        ))}

        <span className="mx-1 h-6 w-px bg-black/10" />

        <button
          type="button"
          onClick={copy}
          disabled={!url}
          aria-label="Copy link"
          className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-black/70 transition-colors hover:bg-black/5 hover:text-[#090909] disabled:opacity-40"
        >
          {copied ? (
            <CheckIcon className="size-4 text-[#34D399]" />
          ) : (
            <LinkIcon className="size-4" />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
