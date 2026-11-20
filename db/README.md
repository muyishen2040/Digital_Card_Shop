# Digital Card Shop database foundation

## Status

The dedicated Supabase project is **`digital-card-shop`** (reference `zrgnwwrfrchhgmznbblb`, `us-east-1`). The `card_instances` table was deployed from [schema/card_instances.sql](schema/card_instances.sql) via the Supabase migration API, which recorded migration `20261120050919_create_private_card_instances`. The exact applied SQL is tracked at [supabase/migrations/20261120050919_create_private_card_instances.sql](../supabase/migrations/20261120050919_create_private_card_instances.sql). No other project's database was modified.

## Verified database setup and remaining app configuration

1. Supabase project `digital-card-shop` was created at the quoted $0/month project cost and reports `ACTIVE_HEALTHY`. This quote does not guarantee that optional paid features or future usage are free.
2. Migration `20261120050919_create_private_card_instances` is applied to that project. The table exists and is initially empty.
3. [security-check.sql](security-check.sql) completed successfully, verifying RLS, denied `anon`/`authenticated` table privileges and expected `service_role` access.
4. Supabase security advisors show only informational `rls_enabled_no_policy` for this table. **This is intentional:** no browser role is allowed to read private cards.
5. Before sending real cards, configure the server environment in Vercel:

   - `SUPABASE_URL` — `https://zrgnwwrfrchhgmznbblb.supabase.co`
   - `SUPABASE_SECRET_KEY` — the project's `sb_secret_...` server-only key (retrieve and paste it **directly in Vercel**, never in a message or repository)

Never expose the secret through `NEXT_PUBLIC_`, commit it, or place it in a client component.

## Contract

The `public.card_instances` table contains a `template_slug`, sender/recipient names, message, hashed bearer token, and availability/expiration times. The shared storage limits are 40 Unicode code points per name and 600 per message for all three templates. Design-specific writing recommendations (240 / 140 / 100) are guidance, not restrictions. Browser previews should measure actual layout and notify the sender about scrolling. The original token is returned only once by the internal `createCardInstance` server function and is never stored.

The internal `findActiveCardByToken` checks both availability and expiry, even if no cleanup job has deleted expired rows. Expiration is **not** implemented by hiding a page in the browser.

Only trusted server code uses these functions. **There is no public creation endpoint.** A dynamic `/c/[token]` recipient route is defined. The database schema is deployed, but live private-link rendering still needs `SUPABASE_SECRET_KEY` configured in Vercel and a real valid/expired-token integration test. Sender creation still requires authorization and abuse prevention.

## Privacy and retention

- RLS is enabled, and all grants to `anon` and `authenticated` are explicitly revoked. No user policies are installed.
- The key bypasses RLS, so server functions must never be exposed without their own authorization checks.
- Card data and bearer tokens must never appear in query strings used for analytics, error logs, or public static content.
- The intended recipient URL will include a capability token (planned route `/c/[token]`); it must use `Referrer-Policy: no-referrer`, avoid third-party trackers, and set appropriate cache controls.
- Before public launch, implement a scheduled cleanup and an explicit retention policy. A deleted row is cleanup; access is cut off immediately at `expires_at`.
- Scheduled delivery is deferred. The current issuance window starts at card creation; later delivery work must define when a card becomes available without extending its lifetime unexpectedly.

## Verification boundary

TypeScript/Vitest tests cover input validation, access windows, and token generation. The live table, RLS and role grants have been verified against the dedicated database. Live service-key REST operations and personalized recipient-link expiration **remain unverified** until the backend secret is configured and integration tests can run.
