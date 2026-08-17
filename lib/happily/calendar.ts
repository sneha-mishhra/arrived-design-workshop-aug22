export type CalendarEvent = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location?: string;
};

function toUTCComponents(isoDate: string) {
  const d = new Date(isoDate);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** yyyyMMdd'T'HHmmss'Z' */
function formatCompactUTC(isoDate: string) {
  const c = toUTCComponents(isoDate);
  return `${c.year}${pad(c.month)}${pad(c.day)}T${pad(c.hour)}${pad(c.minute)}${pad(c.second)}Z`;
}

/** yyyy-MM-dd'T'HH:mm:ss'Z' */
function formatMicrosoftUTC(isoDate: string) {
  const c = toUTCComponents(isoDate);
  return `${c.year}-${pad(c.month)}-${pad(c.day)}T${pad(c.hour)}:${pad(c.minute)}:${pad(c.second)}Z`;
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set("details", event.description);
  url.searchParams.set("location", event.location ?? "");
  url.searchParams.set(
    "dates",
    `${formatCompactUTC(event.startDate)}/${formatCompactUTC(event.endDate)}`,
  );
  url.searchParams.set("ctz", event.timezone);
  return url.toString();
}

export function generateOffice365CalendarUrl(event: CalendarEvent): string {
  const url = new URL("https://outlook.office.com/calendar/0/action/compose");
  url.searchParams.set("subject", event.title);
  url.searchParams.set("body", event.description);
  url.searchParams.set("startdt", formatMicrosoftUTC(event.startDate));
  url.searchParams.set("enddt", formatMicrosoftUTC(event.endDate));
  url.searchParams.set("location", event.location ?? "");
  url.searchParams.set("path", "/calendar/action/compose");
  url.searchParams.set("rru", "addevent");
  url.searchParams.set("allday", "false");
  url.searchParams.set("timezone", "UTC");
  return url.toString();
}

export function generateOutlookCalendarUrl(event: CalendarEvent): string {
  const url = new URL("https://outlook.live.com/calendar/0/action/compose");
  url.searchParams.set("subject", event.title);
  url.searchParams.set("body", event.description);
  url.searchParams.set("startdt", formatMicrosoftUTC(event.startDate));
  url.searchParams.set("enddt", formatMicrosoftUTC(event.endDate));
  url.searchParams.set("location", event.location ?? "");
  url.searchParams.set("allday", "false");
  url.searchParams.set("tzid", "UTC");
  return url.toString();
}

export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const url = new URL("https://calendar.yahoo.com/");
  url.searchParams.set("v", "60");
  url.searchParams.set("view", "d");
  url.searchParams.set("type", "20");
  url.searchParams.set("title", event.title);
  url.searchParams.set("st", formatCompactUTC(event.startDate));
  url.searchParams.set("et", formatCompactUTC(event.endDate));
  url.searchParams.set("desc", event.description);
  url.searchParams.set("in_loc", event.location ?? "");
  return url.toString();
}

export function generateICSContent(event: CalendarEvent): string {
  const now = formatCompactUTC(new Date().toISOString());
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Happily//Event//EN",
    "BEGIN:VEVENT",
    `UID:${now}@happily.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatCompactUTC(event.startDate)}`,
    `DTEND:${formatCompactUTC(event.endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(icsContent: string) {
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "event.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
