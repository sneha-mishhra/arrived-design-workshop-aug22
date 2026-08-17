import type { PublicEvent } from "@/lib/happily/types";

import { eventDateRange, eventTimeRange } from "./helpers";

type EventDetailsProps = {
  event: PublicEvent;
  includeLocation?: boolean;
};

export function EventDetails({
  event,
  includeLocation = true,
}: EventDetailsProps) {
  const date = eventDateRange(event);
  // Formatted from the event's own timezone rather than pinned to a string, so
  // the hour follows whatever is set in the CMS.
  const time = eventTimeRange(event);
  const ds = event.display_settings;

  const elements = [
    includeLocation &&
      event.location &&
      (ds.displayLocation ?? true) &&
      event.location,
    date && (ds.displayDate ?? true) && date,
    time && (ds.displayTime ?? true) && time,
  ].filter(Boolean) as string[];

  if (elements.length === 0) return null;

  return (
    <p className="py-4 text-sm font-medium uppercase tracking-wide sm:text-base">
      {elements.map((element, index) => (
        <span key={index}>
          {element}
          {index < elements.length - 1 && (
            <span className="mx-2 opacity-40">&bull;</span>
          )}
        </span>
      ))}
    </p>
  );
}
