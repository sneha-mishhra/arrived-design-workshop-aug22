/**
 * Join details for this deployment's session.
 *
 * Deliberately a per-project file rather than shared code: each session has its
 * own Zoom room, and a shared module would quietly hand Saturday's attendees
 * Thursday's link. Set to `null` in a deployment with no room yet, and the page
 * and the calendar entry both drop the join block.
 */
export type Meeting = {
  topic: string;
  joinUrl: string;
  meetingId: string;
  passcode: string;
  /** Dial-in numbers, already formatted for one-tap. */
  phone: { label: string; number: string }[];
  sip?: string;
};

export const MEETING: Meeting | null = {
  topic: "Arrived Design Workshop",
  joinUrl:
    "https://teamhappily.zoom.us/j/89749642434?pwd=QLvGPohJ34JexvWzXzUKJS7tDoMV85.1",
  meetingId: "897 4964 2434",
  passcode: "937522",
  phone: [
    { label: "US", number: "+15642172000,,89749642434#" },
    { label: "US", number: "+16469313860,,89749642434#" },
  ],
  sip: "89749642434@zoomcrc.com",
};

/**
 * The join details as plain text, for the body of a calendar entry. Calendar
 * apps linkify bare URLs, so the link is left unwrapped.
 */
export function meetingCalendarNotes(meeting: Meeting) {
  return [
    `Join Zoom Meeting`,
    meeting.joinUrl,
    ``,
    `Meeting ID: ${meeting.meetingId}`,
    `Passcode: ${meeting.passcode}`,
    ``,
    `One tap mobile`,
    ...meeting.phone.map((p) => `${p.number} ${p.label}`),
    ...(meeting.sip ? [``, `Join by SIP`, meeting.sip] : []),
  ].join("\n");
}
