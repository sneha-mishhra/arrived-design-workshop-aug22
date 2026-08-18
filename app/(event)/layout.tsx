import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../globals.css";

import { EventShell } from "@/components/event-shell";
import { formatEventDate, styleValue } from "@/components/helpers";
import { getPublicEvent } from "@/lib/happily/queries";

// The layout fetches the event too (metadata, design tokens, nav), so it needs
// the same revalidation as the pages beneath it. Left static, a CMS change to
// the title or colours would stay stale even once the page body refreshed.
export const revalidate = 60;

// One family, per the brand guidelines. Everything on the page is Open Sans and
// the hierarchy comes from weight, case and tracking instead: light for asides,
// regular for body, semibold for subheads, bold uppercase for anything that has
// to land as a statement.
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

// The CMS description is a long paragraph, which is right for the page body and
// wrong for a link preview: LinkedIn and X truncate at roughly 150 characters,
// so a shared link would break off mid-sentence. This is the short version that
// survives the cut, with the CMS still winning for the page title.
//
// The day is read from the event rather than written in, so the same codebase
// can serve more than one session without a stale date in the share card.
const SHARE_TITLE = "Arrived Design Workshop";
const SHARE_INTRO =
  "For designers, vibe coders and event marketers: build custom event sites with AI, and get paid for it.";

export async function generateMetadata(): Promise<Metadata> {
  const { event } = await getPublicEvent();
  const { metadata } = event;

  const title = metadata.title?.trim() || event.name.trim() || SHARE_TITLE;

  const when = formatEventDate(event.start_date, event.timezone, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const description = when
    ? `${SHARE_INTRO} Free, online, ${when}.`
    : `${SHARE_INTRO} Free and online.`;

  return {
    title,
    description,
    ...(metadata.allow_search_engine_indexing === false && {
      robots: "noindex, nofollow",
    }),
    openGraph: {
      title,
      description,
      type: "website",
      ...(metadata.image_url && { images: [metadata.image_url] }),
    },
    twitter: {
      card: metadata.image_url ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function EventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const eventData = await getPublicEvent();
  const styles = eventData.event.styles;

  // Colours come from the event's own design tokens in the CMS, so a change
  // there lands here without a deploy. The canvas neutrals (white ground, near
  // black ink) are fixed in the components: they are the layout, not a theme.
  // Border radius is squared off, because rounded corners fight the ruler grid.
  const eventVars = {
    // Primary is pinned to the artwork's violet rather than the CMS lime:
    // the hero is the loudest thing on the page and the buttons have to agree
    // with it. The rest still follows the event's own tokens.
    "--event-primary-bg": "#7761E2",
    "--event-primary-text": "#FFFFFF",
    "--event-secondary-bg": styleValue(styles, "secondaryBg", "#FFFFFF"),
    "--event-secondary-text": styleValue(styles, "secondaryText", "#090909"),
    "--event-accent-bg": styleValue(styles, "accentBg", "#090909"),
    "--event-accent-text": styleValue(styles, "accentText", "#FFFFFF"),
    "--event-base-bg": "#FFFFFF",
    "--event-base-text": "#090909",
    "--event-border-radius": "0px",
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${openSans.variable} ${openSans.className} h-full antialiased`}
    >
      <body style={eventVars} className="min-h-full flex flex-col">
        <EventShell eventData={eventData}>{children}</EventShell>
      </body>
    </html>
  );
}
