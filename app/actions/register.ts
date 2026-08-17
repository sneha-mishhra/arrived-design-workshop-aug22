"use server";

import { redirect } from "next/navigation";

import { happilyClient } from "@/lib/happily/client";
import { getEventEnv, getEventId } from "@/lib/happily/config";
import type { HappilyEnv, RegistrationFormType } from "@/lib/happily/types";

export type RegistrationState = {
  ok: boolean;
  message?: string;
};

type RegistrationActionConfig = {
  eventId?: string;
  env?: HappilyEnv;
  formId: number;
  formType: RegistrationFormType;
  redirectTo?: string;
};

const CORE_FIELD_KEYS = new Set([
  "firstName",
  "first_name",
  "lastName",
  "last_name",
  "email",
  "emailAddress",
  "email_address",
]);

function valueFromFormData(formData: FormData, names: string[]) {
  for (const name of names) {
    const value = formData.get(name);

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function customDataFromFormData(formData: FormData) {
  const data: Record<string, unknown> = {};

  for (const key of new Set(formData.keys())) {
    if (CORE_FIELD_KEYS.has(key) || key.startsWith("$ACTION_")) {
      continue;
    }

    const values = formData
      .getAll(key)
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    if (values.length === 1) {
      data[key] = values[0];
    }

    if (values.length > 1) {
      data[key] = values;
    }
  }

  return data;
}

export async function submitRegistration(
  config: RegistrationActionConfig,
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const eventId = config.eventId ?? getEventId();
  const env = config.env ?? getEventEnv();
  const email = valueFromFormData(formData, [
    "email",
    "emailAddress",
    "email_address",
  ]);

  if (!email) {
    return {
      ok: false,
      message: "Email is required.",
    };
  }

  const { error } = await happilyClient.POST("/api/events/{eventId}/register", {
    params: {
      path: { eventId },
    },
    body: {
      form_id: config.formId,
      firstName: valueFromFormData(formData, ["firstName", "first_name"]),
      lastName: valueFromFormData(formData, ["lastName", "last_name"]),
      email,
      data: customDataFromFormData(formData),
      status: "APPROVED",
      env,
      form_type: config.formType,
    },
  });

  if (error) {
    return {
      ok: false,
      message: error.error,
    };
  }

  if (config.redirectTo) {
    redirect(config.redirectTo);
  }

  return {
    ok: true,
    message: "Submitted successfully.",
  };
}
