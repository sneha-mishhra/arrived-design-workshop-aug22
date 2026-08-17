# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read the docs first

This repo uses **Next.js 16.2.6** and **React 19.2.4**. APIs, conventions, and file structure may differ from your training data. Before writing code that touches routing, caching, server components, or actions, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

- `npm install`
- `cp .env.example .env.local` and fill in `HAPPILY_API_BASE_URL`, `HAPPILY_API_SCHEMA_URL`, `HAPPILY_EVENT_ID`, `HAPPILY_EVENT_ENV` (`staging` | `prod`).
- `npm run api:types` — regenerate `lib/happily/generated/schema.d.ts` from the live OpenAPI schema. Run after initial setup and whenever the upstream API changes.
- `npm run dev` — Next dev server on `:3000`.
- `npm run build` / `npm run start`
- `npm run lint` — ESLint 9 (`next/core-web-vitals` + `next/typescript`).

No test runner is configured in this repo.

## Architecture

**Data flow (one-way, server-side):**
`HAPPILY_*` env → `lib/happily/config.ts` (`getEventId`, `getEventEnv` — throw if env missing) → `lib/happily/client.ts` (typed `openapi-fetch` client) → `lib/happily/queries.ts` (`getPublicEvent`, `getPublicPhotos`, `getPublicAttendees`) → async server components in `app/(event)/` → presentational components in `components/`.

The three query functions are the canonical entry points — reuse them rather than calling `happilyClient` directly. `getPublicEvent` and `getPublicPhotos` throw `notFound()` on missing data; `getPublicAttendees` returns `null`. The asymmetry is load-bearing for the confirmation page — don't "normalize" it without checking callers.

**Layout vs. shell.** `app/(event)/layout.tsx` is the Next.js layout — it fetches `event.styles` and injects them as `--event-*` CSS custom properties on `<body>` (using `styleValue()` from `components/helpers.ts` for fallbacks). `components/event-shell.tsx` is a *presentational* wrapper rendered inside that layout — it owns `Header`/`Footer` and the nav (Gallery link gated by `event.photos_toggle`, CTA gated by `eventData.form?.is_active && buttonLinks?.navCTA.display`). Don't conflate the two.

**Feature gating.** There is no central `event.features` flag. Conditionals come directly off the event payload: `event.photos_toggle`, `event.live_toggle`, `event.display_add_to_calendar`, `event.display_settings.{buttonLinks,hideNavigation}`. Grep for these names when adding a new gated section.

**Registration.** `<RegistrationForm>` (`"use client"`) drives React 19's `useActionState` against `app/actions/register.ts`. The server action accepts `firstName`/`first_name`, `lastName`/`last_name`, `email`/`emailAddress`/`email_address` interchangeably; everything else in `FormData` becomes a custom `data` field, except keys starting with `$ACTION_` (Next.js internals). The action `POST`s to `/api/events/{eventId}/register`.

**Type generation.** `scripts/generate-api-types.mjs` loads `.env.local` manually, fetches the OpenAPI schema, aliases `schema.definitions ??= schema.components.schemas` (workaround for an upstream `$ref` quirk), then emits `lib/happily/generated/schema.d.ts`. Treat `lib/happily/generated/` as read-only — regenerate, don't edit.

**Domain types.** `lib/happily/types.ts` re-exports named domain types (`PublicEventData`, `PublicAttendeesData`, `PublicPhotoData`, `HappilyEnv`, `RegistrationFormType`) from the generated schema. Import from `types.ts`, not from `generated/schema`.

**Reuse before writing new utilities:**
- `components/helpers.ts` — `text`, `hasText`, `styleValue`, `formatEventDate`, `eventDateRange`, `ordered`, `heroImage`. Most event fields are nullable; these are the established fallback patterns.
- `lib/happily/calendar.ts` — Google / Outlook / Office365 / Yahoo URL builders and ICS file generation. Use these before hand-rolling calendar logic.

## Conventions and gotchas

- **Tailwind v4 native CSS-var syntax**: `bg-(--event-primary-bg)`, `text-(--event-base-text)` — *not* the older `bg-[var(--event-primary-bg)]` arbitrary-value form. Match the existing style when adding classes.
- **`next/image` with `unoptimized: true`** (`next.config.ts`). Source images must already be sized appropriately; don't rely on Next image optimization.
- **Server components by default.** Only `<RegistrationForm>` and a handful of interactive components carry `"use client"`. Don't add it reflexively — check whether a server component will do.
- **No explicit fetch caching directives.** Queries are bare `await` calls. If you need revalidation, decide deliberately.
- **shadcn UI** lives in `components/ui/` (radix-vega style; see `components.json`). Path alias `@/*` maps to the repo root (`tsconfig.json`).
- **Customization scope:** everything in `components/` is meant to be redesigned per-event. The data layer (`lib/happily/`) and the registration endpoint stay the same — don't fork them per event.

## Reference

- API docs: `https://app.happily.events/api/docs`
- OpenAPI schema: `https://app.happily.events/api/openapi.json`
