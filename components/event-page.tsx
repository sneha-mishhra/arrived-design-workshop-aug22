import type { PublicEventData } from "@/lib/happily/types";

import { AgendaList } from "./agenda-list";
import { Container } from "./container";
import { ContentSection } from "./content-section";
import { DotPattern } from "./ui/dot-pattern";
import { FaqList } from "./faq-list";
import { formatEventDate, hasText, text } from "./helpers";
import { HeroSection } from "./hero-section";
import { Markdown } from "./markdown";
import { RegistrationForm } from "./registration-form";
import { Reveal } from "./scroll-reveal";
import { SectionHeading } from "./section-heading";
import { SpeakersGrid } from "./speakers-grid";
import { SponsorsGrid } from "./sponsors-grid";

type EventPageProps = {
  eventData: PublicEventData;
  eventId: string;
  env: "staging" | "prod";
};

export function EventPage({ eventData, eventId, env }: EventPageProps) {
  const { event, form, sessions, speakers, sponsors, faqs, tracks } = eventData;
  const content = event.content;

  // Signing off with the actual day keeps the line correct if the date moves in
  // the CMS, rather than hard-coding a weekday that quietly goes stale.
  const weekday = formatEventDate(event.start_date, event.timezone, {
    weekday: "long",
  });

  return (
    <main>
      <HeroSection event={event} formActive={form?.is_active} />

      {hasText(content.aboutTitle) || hasText(content.aboutDescription) ? (
        <Reveal stagger>
          <ContentSection
            id="about"
            title={text(content.aboutTitle, "About")}
            description={content.aboutDescription}
            image={content.aboutImage}
          />
        </Reveal>
      ) : null}

      {sessions.length ? (
        <Container id="agenda" wrapperClassName="border-b-0">
          <Reveal stagger>
            {/* A white panel on the cream ground, so the running order reads as
                one object rather than a list bleeding into the page. The dot
                grid sits behind the content and fades out towards the bottom,
                so it textures the top of the panel without competing with the
                session times. */}
            <div className="relative isolate overflow-hidden rounded-[20px] bg-white p-6 sm:p-10 lg:p-12">
              <DotPattern
                width={22}
                height={22}
                cr={1.1}
                className="-z-10 text-brand-violet/25 [mask-image:radial-gradient(420px_circle_at_top_left,white,transparent)]"
              />
              <p className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-violet">
                The hour, in four parts
              </p>
              <div className="mt-4">
                <SectionHeading title="Agenda" />
              </div>
              <div className="mt-8">
                <AgendaList
                  sessions={sessions}
                  speakers={speakers}
                  tracks={tracks}
                  event={event}
                />
              </div>
            </div>
          </Reveal>
        </Container>
      ) : null}

      {speakers.length ? (
        <Container id="speakers">
          <SectionHeading
            title={text(content.speakersTitle, "Speakers")}
            description={content.speakersDescription}
          />
          <div className="mt-8">
            <SpeakersGrid speakers={speakers} />
          </div>
        </Container>
      ) : null}

      {form ? (
        <Container id="register" className="max-w-7xl" wrapperClassName="pt-4">
          <Reveal className="grid gap-10 md:grid-cols-2 md:items-start md:gap-8 lg:gap-12" stagger>
            <div className="flex flex-col">
              <h2 className="text-4xl font-extrabold uppercase tracking-[-0.02em] sm:text-5xl">
                Save my spot
              </h2>
              <p className="mt-3 max-w-md text-base text-black/60 md:text-lg">
                Free to join. Two minutes. We&rsquo;ll send the link and one
                reminder, nothing else.
              </p>
              <div className="mt-10 w-full">
                <RegistrationForm
                  eventId={eventId}
                  env={env}
                  form={form}
                  redirectTo="/confirmation"
                  buttonText={form.form_button_text}
                />
              </div>
            </div>

            {/* Virtual event, so the second column carries the takeaways rather
                than a map. Annotated like a spec sheet pinned to the canvas. */}
            <div className="relative flex flex-col rounded-2xl border border-black/10 bg-white p-8">
              <span className="absolute -top-3 left-6 bg-(--event-primary-bg) px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-(--event-primary-text)">
                What you leave with
              </span>
              <ul className="mt-4 space-y-5">
                {[
                  "A chance to work with the Happily team and get inside our network.",
                  "A new way to earn money, from anywhere.",
                  "Early access to our partner program, and how it all works.",
                ].map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="text-xs text-black/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-black/10 pt-6 text-lg font-light">
                {weekday
                  ? `Looking forward to meeting you on ${weekday}.`
                  : "Looking forward to meeting you."}
              </p>
            </div>
          </Reveal>
        </Container>
      ) : null}

      {hasText(content.companyAboutTitle) ||
      hasText(content.companyAboutDescription) ? (
        <ContentSection
          id="host"
          title={text(content.companyAboutTitle, "About the Host")}
          description={content.companyAboutDescription}
          image={content.companyAboutImage}
        />
      ) : null}

      {sponsors.length ? (
        <Container id="sponsors">
          <SectionHeading
            title={text(content.sponsorsTitle, "Sponsors")}
            description={content.sponsorsDescription}
          />
          <div className="mt-8">
            <SponsorsGrid sponsors={sponsors} />
          </div>
        </Container>
      ) : null}

      {faqs.length ? (
        <Container id="faqs">
          <Reveal stagger>
            <SectionHeading
              title={text(content.faqsTitle, "FAQs")}
              description={content.faqsDescription}
            />
            <div className="mt-8">
              <FaqList faqs={faqs} />
            </div>
          </Reveal>
        </Container>
      ) : null}
    </main>
  );
}
