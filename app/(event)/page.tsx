import { EventPage } from "@/components/event-page";
import { getEventEnv, getEventId } from "@/lib/happily/config";
import { getPublicEvent } from "@/lib/happily/queries";

// Without this the route is fully static and the event data is frozen at build
// time, so a CMS edit only appears after a redeploy. A minute keeps the CDN
// doing its job while letting agenda and copy changes land on their own.
export const revalidate = 60;

export default async function Home() {
  const eventId = getEventId();
  const env = getEventEnv();
  const eventData = await getPublicEvent({ eventId, env });

  return <EventPage eventData={eventData} eventId={eventId} env={env} />;
}
