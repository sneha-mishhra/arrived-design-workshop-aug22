import type { PublicAttendeesData } from "@/lib/happily/types";

type AttendeesListProps = {
  attendees: NonNullable<PublicAttendeesData>["attendees"];
  title?: string;
};

export function AttendeesList({
  attendees,
  title = "Who's attending",
}: AttendeesListProps) {
  if (!attendees.length) {
    return null;
  }

  return (
    <section className="rounded-(--event-border-radius) bg-(--event-base-bg) p-6 text-(--event-base-text)">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-3">
        {attendees.map((attendee) => (
          <article
            key={attendee.id}
            className="rounded-(--event-border-radius) border border-(--event-base-text)/10 p-4"
          >
            <p className="font-semibold">
              {[attendee.first_name, attendee.last_name]
                .filter(Boolean)
                .join(" ")}
            </p>
            <p className="text-sm text-(--event-base-text)/60">
              {[attendee.job_title, attendee.company]
                .filter(Boolean)
                .join(", ")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
