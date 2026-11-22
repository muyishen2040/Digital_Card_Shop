# Digital Card Shop — database runbook

Digital Card Shop stores temporary personalized cards in the dedicated Supabase project `digital-card-shop` (`zrgnwwrfrchhgmznbblb`, region `us-east-1`). The browser does not directly access private card rows.

## How card storage works

- `src/app/api/public/cards/route.ts` checks same-origin requests, Cloudflare Turnstile and shared quotas before creating public cards.
- `src/app/api/cards/route.ts` is an optional legacy creator-code endpoint, not the public flow.
- `src/server/cards/card-instances.ts` accesses private storage with a server-only Supabase key.
- `src/app/c/[token]/page.tsx` resolves private recipient links and refuses unknown or expired cards. The database stores a hash of the access token, never the raw token.
- `src/app/api/cron/expire-cards/route.ts` removes expired rows on a schedule. See the [retention guide](../docs/RETENTION.md).

Names may contain up to 40 Unicode code points, messages up to 600, and reading text sizes are `small`, `medium` or `large`. Cards expire after 24, 48 or 72 hours.

## Database migrations

Use [`supabase/migrations/`](../supabase/migrations/) as the authoritative record of schema changes. The older [`db/schema/card_instances.sql`](schema/card_instances.sql) is a historical bootstrap snapshot; **do not apply it to the deployed database**.

| Change | Migration |
| --- | --- |
| Private card storage and permissions | `20261120050919_create_private_card_instances.sql` |
| Atomic public creation quotas | `20261120220816_public_card_creation_quota.sql` |
| Hong Kong postcard allowlist | `20261121224534_allow_hong_kong_postcard.sql` |
| Text-size support | `20261121230604_add_card_text_size.sql` |
| Taipei postcard allowlist | `20261121235346_allow_taipei_postcard.sql` |
| Kyoto, Seoul, Paris, San Francisco, and Singapore allowlist | `20261122192815_extend_city_postcard_allowlist.sql` |

**Merging a migration does not apply it.** Application deployment does not automatically execute database SQL. Before publishing a new destination, check that its migration is applied to the intended Supabase project and that `card_instances_template_slug_check` includes its slug. Preserve existing slugs in additive migrations, and never edit an already-applied migration.

## Release and security checks

1. Confirm the target Supabase project and compare its recorded migrations against `supabase/migrations/`. Apply only missing, reviewed changes.
2. Confirm row-level security is enabled on `public.card_instances`, browser roles (`anon` and `authenticated`) have no direct read/write privileges, and `service_role` has only the required access. [`security-check.sql`](security-check.sql) contains read-only permission checks.
3. Confirm that `card_instances_template_slug_check` includes all published designs and that `card_instances_text_size_check` accepts only supported sizes.
4. Confirm that the quota reservation function can be executed by `service_role`, not browser roles.
5. Create a controlled card with non-sensitive text, open the private link in a separate anonymous session and verify invalid and expired-link behavior. Do not log access tokens or personal content.
6. Check the Vercel cron schedule and execution logs separately; the existence of an endpoint alone does not prove the cleanup job has run.

## Server configuration and privacy

Use `SUPABASE_URL` and server-only `SUPABASE_SECRET_KEY` in trusted code. Never put secrets into source code, screenshots, tickets or variables prefixed with `NEXT_PUBLIC_`. Public creation also needs feature flags, Turnstile credentials and `CARD_RATE_LIMIT_SECRET`; see [`.env.example`](../.env.example), the [architecture](../docs/ARCHITECTURE.md), and the [public creation handler](../src/app/api/public/cards/route.ts).

Private recipient links are bearer credentials. Use no-referrer, no-cache and no-index policies. The server enforces expiration even before the cleanup job removes a row. Scheduled email delivery is not implemented.
