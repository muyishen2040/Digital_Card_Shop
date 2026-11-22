# Digital Card Shop — database runbook

## Current architecture

The application stores temporary private cards in the dedicated Supabase project `digital-card-shop` (`zrgnwwrfrchhgmznbblb`, region `us-east-1`). It is **already deployed and used by the live public card-creation flow**.

- `src/app/api/public/cards/route.ts` is the anonymous creation endpoint. It requires same-origin requests, server-validated Cloudflare Turnstile and a shared atomic quota before the server writes a card.
- `src/app/api/cards/route.ts` is a separate **legacy pilot** endpoint requiring a creator access code when configured. It is not the public flow.
- `src/server/cards/card-instances.ts` uses a server-only Supabase key. Public roles do not receive table access.
- `src/app/c/[token]/page.tsx` checks an unguessable link server-side and refuses unknown or expired instances. The raw bearer token is never stored in the table.
- `src/app/api/cron/expire-cards/route.ts` implements authenticated scheduled cleanup; see the [retention runbook](../docs/plans/expired-card-retention.md).
- Each card has names (at most 40 Unicode code points each), a message (at most 600), validated text size (`small`, `medium`, `large`) and an availability/expiration window of 24, 48 or 72 hours. The editor's recommended message length depends on design; it is not a database limit.

## Migration history and rollout

The original `db/schema/card_instances.sql` is a **historical bootstrap snapshot**, not the live schema or an up-to-date migration. Do not execute it against the deployed database.

The authoritative, ordered schema change history is in [`supabase/migrations/`](../supabase/migrations/). These were verified as applied in the dedicated project on **2026-11-22**:

| Version | Change |
| --- | --- |
| `20261120050919` | Private card instance table and security |
| `20261120220816` | Atomic public creation quota |
| `20261121224534` | Hong Kong postcard allowlist |
| `20261121230604` | Backward-compatible text size |
| `20261121235346` | Taipei postcard allowlist |

**Deployment attention — recorded 2026-11-22:** The repository also contains `20261122192815_extend_city_postcard_allowlist.sql` for Kyoto, Seoul, Paris, San Francisco and Singapore. This migration was **not yet present in the live migration history** when checked. Until it is reviewed, applied and verified, the database rejects private-card creation for those five designs even if they appear in the deployed gallery. Confirm and update this status after applying the migration; do not assume merging a PR applies SQL.

For every new destination, preserve all existing allowed `template_slug` values in the forward migration and apply the reviewed migration **before** publishing an application build that enables the new slug. Never edit already-applied migrations.

## Verification checklist

1. Confirm the target Supabase project before running any SQL. Compare the project's recorded migration versions against `supabase/migrations/`; do not apply a migration twice or manually mark it as applied.
2. Confirm that `public.card_instances` has RLS enabled, no direct `anon` or `authenticated` SELECT/INSERT/UPDATE/DELETE privileges, and server-only service role access. The dedicated project was rechecked on 2026-11-22: RLS was enabled, public SELECT/INSERT were denied and service-role SELECT/INSERT were allowed.
3. Confirm that the current `card_instances_template_slug_check` includes every published template, including old slugs, and `card_instances_text_size_check` still accepts only the three supported sizes. Use read-only schema queries or [`db/security-check.sql`](security-check.sql) to verify privileges.
4. Confirm that the quota reservation function can only be executed by `service_role`, not browser roles. The function permissions were rechecked on 2026-11-22.
5. After an approved migration and deployment, perform a controlled creation-and-retrieval test with a non-sensitive message. Open the returned link in a fresh anonymous session; verify expiry/error handling separately. Do not log a real token or private content.

## Server configuration and privacy

Use `SUPABASE_URL` and `SUPABASE_SECRET_KEY` only in trusted server code, with the secret entered directly into the deployment environment. Never prefix the secret with `NEXT_PUBLIC_` or put it into source, screenshots, issue comments or logs. Public creation also requires the feature flags, Turnstile server-side secret and `CARD_RATE_LIMIT_SECRET`; details live in [the security design](../docs/plans/public-card-creation-design.md) and [`.env.example`](../.env.example).

Recipient URLs contain capability tokens; apply `Referrer-Policy: no-referrer`, no caching, and no indexing. Access stops at the expiration timestamp even before asynchronous row deletion. No scheduled email delivery exists.
