import type { HappilyEnv } from "./types";

export function getEventId() {
  const eventId = process.env.HAPPILY_EVENT_ID;

  if (!eventId) {
    throw new Error("Missing HAPPILY_EVENT_ID in .env.local");
  }

  return eventId;
}

export function getEventEnv(): HappilyEnv {
  const env = process.env.HAPPILY_EVENT_ENV;

  if (env === "prod" || env === "staging") {
    return env;
  }

  return "staging";
}
