import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";

import type { PublicEventData } from "@/lib/happily/types";

import { CanvasCursor } from "./canvas-cursor";
import { Footer } from "./footer";
import { Header } from "./header";
import { styleValue } from "./helpers";
import { IntroOverlay } from "./intro-overlay";
import type { NavLinkItem } from "./navbar";

type EventShellProps = {
  eventData: PublicEventData;
  children: ReactNode;
};

/** Local brand mark, used when the CMS event has no logo of its own. */
const LOCAL_LOGO = "/arrived-logo.png";

/**
 * Resolves the header logo. The event's own logo wins; otherwise the local
 * wordmark is used, but only if the file is actually on disk. Checking first
 * means a missing file shows no logo rather than a broken image.
 */
function resolveLogo(cmsLogo: string | null | undefined) {
  if (cmsLogo) return cmsLogo;

  return existsSync(join(process.cwd(), "public", LOCAL_LOGO))
    ? LOCAL_LOGO
    : null;
}

export function EventShell({ eventData, children }: EventShellProps) {
  const { event } = eventData;
  const styles = event.styles;

  // Only link to sections this page actually renders. Register is the last
  // item and carries the emphasis in the toolbar, so there is no separate CTA
  // pill saying the same word twice.
  const nav: NavLinkItem[] = [
    { label: "About", href: "/#about" },
    ...(eventData.sessions.length
      ? [{ label: "Agenda", href: "/#agenda" }]
      : []),
    ...(eventData.form?.is_active
      ? [{ label: "Register", href: "/#register" }]
      : []),
    ...(event.photos_toggle ? [{ label: "Gallery", href: "/photos" }] : []),
  ];

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-white text-[#090909]">
      <IntroOverlay />
      <CanvasCursor />
      {/* Frame: two vertical lines at the left+right edges of the max-w-7xl
          content column, running full page height. They double as the outer
          bounds of the canvas, so they are ink on white rather than the
          reverse. Section dividers come from border-b on Container. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 px-9"
      >
        <div className="mx-auto h-full max-w-7xl border-x border-black/[0.07]" />
      </div>
      <Header
        logo={resolveLogo(event.logo_url)}
        logoAlt={`${event.name} logo`}
        nav={nav}
        hideNavigation={event.display_settings.hideNavigation ?? false}
      />
      {children}
      <Footer baseTextColor={styleValue(styles, "baseText", "#171717")} />
    </div>
  );
}
