# Digital Card Shop database foundation

## Status

The SQL in [schema/card_instances.sql](schema/card_instances.sql) is a reviewed **schema proposal**, not an applied migration. No database was changed by this PR. No dedicated Digital Card Shop Supabase project is configured for this repository. **Do not apply this schema to an unrelated application database.**

## Setup after the dedicated project is ready

1. Create or select a dedicated Digital Card Shop Supabase project and verify it is healthy.
2. Install the current Supabase CLI and check its commands with `supabase --help`, `supabase migration --help`, and `supabase migration new --help`.
3. Create a real timestamped migration using `supabase migration new create_card_instances`; copy the SQL from `schema/card_instances.sql` into the generated file.
4. Apply it to the intended project through the normal migration workflow, **after** confirming the target project and reviewing the diff. This repo deliberately does not contain a migration timestamp invented without the CLI.
5. Verify the table constraints, RLS and grants in the destination with [security-check.sql](security-check.sql), then run Supabase security advisors. Correct any findings before allowing real card creation.
6. Configure the server environment only after the project is ready:

   - `SUPABASE_URL` — dedicated project's HTTPS URL
   - `SUPABASE_SECRET_KEY` — its `sb_secret_...` server-only key

Never expose the secret through `NEXT_PUBLIC_`, commit it, or place it in a client component.

## Contract

The `public.card_instances` table contains a `template_slug`, sender/recipient names, message, hashed bearer token, and availability/expiration times. Its template-specific upper bounds are Sunshine (32-character names, 240-character message), Same Sky (24/140), and Make a Wish (24/100). These are not visual-fit guarantees; live previews also need to measure actual rendered text. The original token is returned only once by the internal `createCardInstance` server function and is never stored.

The internal `findActiveCardByToken` checks both availability and expiry, even if no cleanup job has deleted expired rows. Expiration is **not** implemented by hiding a page in the browser.

Only trusted server code uses these functions. **There is no public creation endpoint or live recipient token route in this PR.** Those require authorization, abuse prevention, and UX review in later PRs.

## Privacy and retention

- RLS is enabled, and all grants to `anon` and `authenticated` are explicitly revoked. No user policies are installed.
- The key bypasses RLS, so server functions must never be exposed without their own authorization checks.
- Card data and bearer tokens must never appear in query strings used for analytics, error logs, or public static content.
- The intended recipient URL will include a capability token (planned route `/c/[token]`); it must use `Referrer-Policy: no-referrer`, avoid third-party trackers, and set appropriate cache controls.
- Before public launch, implement a scheduled cleanup and an explicit retention policy. A deleted row is cleanup; access is cut off immediately at `expires_at`.
- Scheduled delivery is deferred. The current issuance window starts at card creation; later delivery work must define when a card becomes available without extending its lifetime unexpectedly.

## Verification boundary

TypeScript/Vitest tests in this PR cover strict input validation, access windows, and token generation. Live RLS, database constraints, and service-key requests **cannot be tested until a dedicated project is provisioned**.
