import type { components } from "./generated/schema";

export type HappilyEnv = "staging" | "prod";
export type PublicEventData = components["schemas"]["PublicEventApiResponse"];
export type PublicEvent = PublicEventData["event"];
export type PublicForm = NonNullable<PublicEventData["form"]>;
export type PublicPhotoData = components["schemas"]["PublicPhotosApiResponse"];
export type PublicAttendeesData =
  components["schemas"]["PublicRegistrationAttendeesApiResponse"];
export type RegistrationFormType = 2 | 3;
