import Image from "next/image";

import type { PublicEventData } from "@/lib/happily/types";

import { Countdown } from "./countdown";
import { formatEventDate, text } from "./helpers";
import { HeroIntro } from "./hero-intro";
import { IntroStatement } from "./intro-statement";
import { ScrollLink } from "./scroll-link";

type HeroSectionProps = {
  event: PublicEventData["event"];
  formActive?: boolean;
};

/**
 * A framed piece of artwork on a cream page, with the practical details set
 * beneath it.
 *
 * Nothing is laid over the image on purpose. The artwork already carries the
 * wordmark and the event name across its middle, so overlaid copy collides
 * with it at every crop; the frame keeps the source 16:9 ratio so none of it
 * is cut off either. The visible title lives in the image, and the `h1` here
 * is for screen readers and search engines, which cannot read artwork.
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

  return (
    <section className="relative isolate bg-page-bg px-3 pb-20 pt-3 sm:px-5 sm:pb-28 sm:pt-5">
      <h1 className="sr-only">{text(event.name, "Arrived Design Workshop")}</h1>

      <HeroIntro>
        <div
          data-hero-item
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[22px] sm:rounded-[32px] lg:aspect-[21/9]"
        >
          <Image
            src="/arrived-workshop-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center px-3 text-center sm:mt-14">
          <p
            data-hero-copy
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171310]/70 sm:text-xs"
          >
            {weekday && day ? (
              <span>
                {weekday}, {day}
              </span>
            ) : null}
            {time ? <span className="text-[#171310]/30">/</span> : null}
            {time ? <span>{time}</span> : null}
            <span className="text-[#171310]/30">/</span>
            <span>{text(event.location, "Live online")}</span>
          </p>

          <div data-hero-copy className="mt-8 w-full sm:mt-10">
            <IntroStatement />
          </div>

          <div
            data-hero-copy
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
          >
            {showCTA ? (
              <ScrollLink
                href="#register"
                className="group inline-flex items-center gap-3 rounded-xl bg-[#171310] p-1.5 pr-5 text-white transition-transform hover:-translate-y-0.5"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-(--event-primary-bg) text-(--event-primary-text) transition-transform group-hover:translate-x-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em]">
                  {text(heroCTA?.text, "Save my spot")}
                </span>
              </ScrollLink>
            ) : null}

            <span className="inline-flex items-center rounded-full border border-[#171310]/15 px-3.5 py-2 text-[#171310]/60">
              <Countdown startDate={event.start_date} />
            </span>
          </div>
        </div>
      </HeroIntro>
    </section>
  );
}
