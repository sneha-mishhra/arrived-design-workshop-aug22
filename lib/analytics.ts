/**
 * Umami website id for this deployment.
 *
 * Per-project like lib/meeting.ts, and for the same reason: the two sites are
 * mirrored file by file, and a shared value would quietly report Thursday's
 * traffic into Saturday's dashboard. `null` disables the script entirely.
 */
export const UMAMI_WEBSITE_ID: string | null =
  "0c373bc9-b509-4d63-9181-13c76252f244";

export const UMAMI_SRC = "https://cloud.umami.is/script.js";
