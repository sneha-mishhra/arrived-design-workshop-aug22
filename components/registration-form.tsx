"use client";

import { useActionState, useEffect } from "react";

import {
  type RegistrationState,
  submitRegistration,
} from "@/app/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  HappilyEnv,
  PublicForm,
  RegistrationFormType,
} from "@/lib/happily/types";

type RegistrationFormProps = {
  eventId: string;
  env: HappilyEnv;
  form: PublicForm;
  formType?: RegistrationFormType;
  redirectTo?: string;
  buttonText?: string | null;
  onSuccess?: () => void;
};

const initialState: RegistrationState = {
  ok: false,
};

export function RegistrationForm({
  eventId,
  env,
  form,
  formType = 2,
  redirectTo,
  buttonText,
  onSuccess,
}: RegistrationFormProps) {
  const action = submitRegistration.bind(null, {
    eventId,
    env,
    formId: form.id,
    formType,
    redirectTo,
  });
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok && onSuccess) {
      onSuccess();
    }
  }, [state.ok, onSuccess]);

  if (!form.is_active) {
    return (
      <p className="rounded-(--event-border-radius) border border-(--event-base-text)/10 bg-(--event-base-bg)/70 p-4 text-sm">
        Registration is currently closed.
      </p>
    );
  }

  if (form.at_capacity) {
    return (
      <p className="rounded-(--event-border-radius) border border-(--event-base-text)/10 bg-(--event-base-bg)/70 p-4 text-sm">
        Registration is at capacity.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="mx-auto flex w-full max-w-lg flex-col gap-4 text-left"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="first_name">First name *</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            required
            placeholder="First name"
            autoComplete="given-name"
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Last name"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
        />
      </div>

      {/* Neither of these is in the CMS field list, so both travel to the API
          as custom data fields on the registration. Optional on purpose: they
          are useful for spotting who is already working as a designer, but not
          worth losing a signup over. */}
      <div className="grid w-full gap-1.5">
        <Label htmlFor="portfolio">Portfolio link</Label>
        <Input
          id="portfolio"
          name="portfolio"
          type="url"
          placeholder="https://your-work.com"
        />
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          name="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/…"
        />
      </div>

      {state.message ? (
        <p
          className={`rounded-md p-3 text-sm ${
            state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-(--event-primary-bg) px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-(--event-primary-text) transition-opacity hover:bg-(--event-primary-bg) hover:opacity-90"
      >
        {isPending ? "Submitting…" : buttonText || "Request to Join"}
        <span aria-hidden="true">↗</span>
      </Button>
    </form>
  );
}
