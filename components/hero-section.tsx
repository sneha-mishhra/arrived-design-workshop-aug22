import type { PublicEventData } from "@/lib/happily/types";

import { CanvasGrid } from "./canvas-grid";
import { Countdown } from "./countdown";
import { formatEventDate, text } from "./helpers";
import { HeroIntro } from "./hero-intro";
import { ScrollLink } from "./scroll-link";
import { SelectionFrame } from "./selection-frame";
import { Sticker } from "./sticker";

type HeroSectionProps = {
  event: PublicEventData["event"];
  formActive?: boolean;
};

/**
 * The hero reads as an open design file: ruler, grid, a selected headline, and
 * annotations stuck around the edges. It suits the subject (a workshop for
 * designers) and it lets the event's own data carry the labels rather than
 * decorative filler.
 *
 * Everything scattered around the title is absolutely positioned at `lg` and
 * up only. Below that the annotations stack into a normal flow row, because
 * scattered stickers on a phone collide with the content they annotate.
 */
export function HeroSection({ event, formActive }: HeroSectionProps) {
  const heroCTA = event.display_settings.buttonLinks?.heroCTA;
  const showCTA = Boolean(formActive && heroCTA?.display);

  const weekday = formatEventDate(event.start_date, event.timezone, {
    weekday: "long",
  });
  const day = formatEventDate(event.start_date, event.timezone, {
    day: "numeric",
    month: "short",
  });
  const time = formatEventDate(event.start_date, event.timezone, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // The title is the one piece of copy that has to look designed, so it is
  // split on whitespace and set as stacked lines rather than left to wrap.
  const titleLines = text(event.name, "Design Workshop").split(/\s+/);

  return (
    <section className="relative isolate overflow-hidden bg-white text-[#090909]">
      <CanvasGrid />

      <HeroIntro>
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-14 sm:pt-20 lg:pb-32">
        <p data-hero-item className="text-center text-black/55">
          <Countdown startDate={event.start_date} />
        </p>

        <p
          data-hero-item
          className="mt-6 text-center font-(family-name:--font-hand) text-2xl leading-none sm:text-3xl"
        >
          you&rsquo;re invited to the
        </p>

        <div data-hero-item className="mt-8 flex justify-center sm:mt-10">
          <SelectionFrame
            label="by team happily"
            inset="-inset-x-4 -inset-y-3 sm:-inset-x-6 sm:-inset-y-4"
          >
            <h1
              data-hero-title
              className="text-center font-(family-name:--font-display) text-[clamp(2.6rem,10vw,7rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.03em]"
            >
              {titleLines.map((line) => (
                // Each word gets its own clipping line box so it can climb into
                // place instead of simply fading in.
                <span key={line} className="block overflow-hidden">
                  <span className="block">{line}</span>
                </span>
              ))}
            </h1>
          </SelectionFrame>
        </div>

        <p
          data-hero-item
          className="mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-black/70 sm:text-xs"
        >
          <span className="size-2.5 rounded-full bg-[#38BDF8]" />
          {weekday && day ? (
            <span>
              {weekday}, {day}
            </span>
          ) : null}
          {time ? <span className="text-black/30">/</span> : null}
          {time ? <span>{time}</span> : null}
          <span className="text-black/30">/</span>
          <span>{text(event.location, "Live online")}</span>
        </p>

        <p
          data-hero-item
          className="mx-auto mt-8 max-w-2xl text-center font-(family-name:--font-display) text-2xl leading-tight tracking-[-0.02em] sm:text-3xl"
        >
          An hour on how event design work happens at Arrived, and how to get
          paid doing it.
        </p>

        {showCTA ? (
          <div data-hero-item className="mt-10 flex justify-center">
            <ScrollLink
              href="#register"
              className="group inline-flex items-center gap-3 bg-[#090909] p-1.5 pr-6 text-white transition-transform hover:-translate-y-0.5"
            >
              <span className="grid size-11 place-items-center rounded-full bg-[#38BDF8] text-[#090909] transition-transform group-hover:translate-x-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-xs uppercase tracking-[0.16em]">
                {text(heroCTA?.text, "Save my spot")}
              </span>
            </ScrollLink>
          </div>
        ) : null}

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 lg:hidden">
          <Sticker
            data-hero-sticker
            data-hero-tilt="7"
            tone="mint"
            rotate={-3}
          >
            Free to join
          </Sticker>
          <Sticker
            data-hero-sticker
            data-hero-tilt="-7"
            tone="sky"
            rotate={-2}
          >
            No prep needed
          </Sticker>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <Sticker
            data-hero-sticker
            data-hero-tilt="7"
            tone="mint"
            rotate={-8}
            className="absolute left-[4%] top-[24%]"
          >
            Free to join
          </Sticker>
          <Sticker
            data-hero-sticker
            data-hero-tilt="-7"
            tone="sky"
            rotate={4}
            className="absolute right-[5%] top-[26%]"
          >
            No prep needed
          </Sticker>
        </div>
      </div>
      </HeroIntro>

    </section>
  );
}
