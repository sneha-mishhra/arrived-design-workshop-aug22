import Link from "next/link";

import type { CalendarEvent } from "@/lib/happily/calendar";
import type { PublicEventData } from "@/lib/happily/types";

import { AddToCalendar } from "./add-to-calendar";
import { formatEventDate, text } from "./helpers";
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  IconTile,
  MailIcon,
  SparkleIcon,
  VideoIcon,
} from "./icons";
import { Reveal } from "./scroll-reveal";
import { ShareRow } from "./share-row";

/**
 * The screen someone lands on straight after registering. It has one job that
 * the starter's version was not doing: make it obvious the seat is held, say
 * what happens next, and give somewhere to go rather than ending in a dead end.
 *
 * The pass is a ticket stub, perforation and all, because that is the clearest
 * object for "you are on the list" and it carries the details someone will want
 * to check later.
 */
export function ConfirmationPanel({
  event,
}: {
  event: PublicEventData["event"];
}) {
  const content = event.content;

  const weekday = formatEventDate(event.start_date, event.timezone, {
    weekday: "long",
  });
  const date = formatEventDate(event.start_date, event.timezone, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = formatEventDate(event.start_date, event.timezone, {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Written from the attendee's point of view, since they are the one posting
  // it. Names the date so the link does not depend on the card rendering.
  const shareMessage = [
    "Just signed up for the Arrived Design Workshop by Happily.",
    "An hour on how event design work happens, and how to get paid doing it.",
    weekday && date ? `Free and online, ${weekday} ${date}.` : "Free and online.",
  ].join(" ");

  // The CMS has no end time for this event, and the starter hides the calendar
  // button whenever one is missing. An hour past the start matches the agenda,
  // and a calendar entry with a sensible length beats no entry at all.
  const calendarEvent: CalendarEvent | null = event.start_date
    ? {
        title: event.name,
        description: text(content.aboutDescription),
        startDate: event.start_date,
        endDate:
          event.end_date ??
          new Date(
            new Date(event.start_date).getTime() + 60 * 60 * 1000,
          ).toISOString(),
        timezone: event.timezone ?? "UTC",
        location: event.location ?? undefined,
      }
    : null;

  return (
    <section className="relative isolate overflow-hidden bg-page-bg text-[#171310]">
      <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-16 sm:pt-24">
        <Reveal stagger>
          <p className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] text-black/55">
            <span className="grid size-5 place-items-center rounded-full bg-brand-green text-brand-ink">
              <CheckIcon className="size-3" />
            </span>
            You&rsquo;re on the list
          </p>

          <h1 className="mt-6 text-center text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
            {text(content.confirmationTitle, "See you there")}
          </h1>

          {/* the pass */}
          <div className="relative mx-auto mt-12 max-w-xl">
            <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-[0_14px_40px_rgba(9,9,9,0.09)] sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-black/45">
                    Your pass
                  </p>
                  <p className="mt-2 text-2xl font-extrabold uppercase leading-tight tracking-[-0.02em] sm:text-3xl">
                    {text(event.name, "Design Workshop")}
                  </p>
                </div>
                <IconTile tone="lime">
                  <SparkleIcon />
                </IconTile>
              </div>

              {/* perforation */}
              <div className="relative my-7">
                <span className="absolute -left-[37px] top-1/2 size-6 -translate-y-1/2 rounded-full bg-white ring-1 ring-black/10 sm:-left-[45px]" />
                <span className="absolute -right-[37px] top-1/2 size-6 -translate-y-1/2 rounded-full bg-white ring-1 ring-black/10 sm:-right-[45px]" />
                <div className="border-t border-dashed border-black/20" />
              </div>

              <dl className="grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-black/45">
                    <CalendarIcon className="size-3.5" />
                    Date
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium">
                    {weekday ? `${weekday}, ` : ""}
                    {date}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-black/45">
                    <ClockIcon className="size-3.5" />
                    Starts
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium">{time}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-black/45">
                    <VideoIcon className="size-3.5" />
                    Where
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium">
                    {text(event.location, "Live online")}
                  </dd>
                </div>
              </dl>
            </div>

          </div>

          {/* what happens next */}
          <div className="mx-auto mt-16 max-w-xl">
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em]">
              What happens next
            </p>

            <ul className="mt-6 grid gap-3">
              {[
                {
                  tone: "sky" as const,
                  icon: <MailIcon />,
                  title: "A confirmation email",
                  body: "Landing in your inbox now, with everything you need.",
                },
                {
                  tone: "mint" as const,
                  icon: <VideoIcon />,
                  title: "The joining link",
                  body: "Comes with that email.",
                },
                {
                  tone: "sand" as const,
                  icon: <SparkleIcon />,
                  title: "Notes and resources",
                  body: "Details on everything we cover, sent after the session.",
                },
              ].map((step) => (
                <li
                  key={step.title}
                  className="flex items-start gap-4 rounded-xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm"
                >
                  <IconTile tone={step.tone}>{step.icon}</IconTile>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="mt-0.5 text-sm text-black/60">{step.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* dock: the two things worth doing from this screen */}
            <div className="mt-10 flex flex-col items-center gap-4">
              {calendarEvent ? (
                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/90 p-2.5 shadow-[0_6px_22px_rgba(9,9,9,0.09)] backdrop-blur-sm">
                  <IconTile tone="ink">
                    <CalendarIcon />
                  </IconTile>
                  <AddToCalendar event={calendarEvent} />
                </div>
              ) : null}

              <Link
                href="/"
                className="text-[11px] uppercase tracking-[0.14em] text-black/50 underline-offset-4 transition-colors hover:text-[#090909] hover:underline"
              >
                Back to the workshop page
              </Link>
            </div>

            <ShareRow message={shareMessage} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
