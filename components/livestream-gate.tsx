"use client";

import { useSyncExternalStore, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistrationForm } from "@/components/registration-form";
import type { HappilyEnv, PublicForm } from "@/lib/happily/types";

type LivestreamGateProps = {
  eventId: string;
  env: HappilyEnv;
  form: PublicForm | null;
  formActive: boolean;
  children: React.ReactNode;
};

function storageKey(eventId: string) {
  return `livestream-${eventId}-authorized`;
}

export function LivestreamGate({
  eventId,
  env,
  form,
  formActive,
  children,
}: LivestreamGateProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [authorized, setAuthorized] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(storageKey(eventId)) === "true";
  });

  const needsGate = mounted && !authorized && formActive && form;

  function handleSuccess() {
    localStorage.setItem(storageKey(eventId), "true");
    setAuthorized(true);
  }

  return (
    <>
      {needsGate ? (
        <Dialog open onOpenChange={() => {}}>
          <DialogContent
            showCloseButton={false}
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {form.form_title ?? "Access livestream"}
              </DialogTitle>
              {form.form_description ? (
                <DialogDescription className="whitespace-pre-line">
                  {form.form_description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
            <RegistrationForm
              eventId={eventId}
              env={env}
              form={form}
              formType={3}
              buttonText={form.form_button_text}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      {children}
    </>
  );
}
