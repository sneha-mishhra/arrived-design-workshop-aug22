import { AttendeesList } from "@/components/attendees-list";
import { ConfirmationPanel } from "@/components/confirmation-panel";
import { Container } from "@/components/container";
import { text } from "@/components/helpers";
import { getEventEnv, getEventId } from "@/lib/happily/config";
import { getPublicAttendees, getPublicEvent } from "@/lib/happily/queries";

// Same reasoning as the event page: the pass and its details come from the CMS,
// so a build-time snapshot would go stale the moment the schedule moves.
export const revalidate = 60;

export default async function ConfirmationPage() {
  const eventId = getEventId();
  const env = getEventEnv();
  const eventData = await getPublicEvent({ eventId, env });
  const attendees =
    eventData.event.content.displayAttendeesList === true
      ? await getPublicAttendees({
          eventId,
          env,
          pageSize: eventData.event.content.attendeesPageSize ?? 12,
        })
      : null;
  const { event } = eventData;

  return (
    <main>
      <ConfirmationPanel event={event} />

      {attendees?.attendees.length ? (
        <Container>
          <AttendeesList
            attendees={attendees.attendees}
            title={text(event.content.attendeesListTitle, "Who's coming")}
          />
        </Container>
      ) : null}
    </main>
  );
}
