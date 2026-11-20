# Public card creation — anonymous beta security design

## Objective and boundaries
Allow visitors to create personalized, short-lived interactive cards without accounts, email, or checkout. Preserve the existing pilot endpoint at `POST /api/cards` for authorized preview testing. Public publishing uses a separate `POST /api/public/cards` route; neither route may bypass the other's authorization.

This branch is deliberately **inactive by default**. Deploying code must not automatically enable public writes.

## Controls (all required)
1. Explicit server flag `CARD_PUBLIC_CREATION_ENABLED=true`. Missing or malformed configuration fails closed with 503.
2. Cloudflare Turnstile (free tier). The client obtains a single-use challenge token; the server validates it using Siteverify, requiring `success=true`, `hostname` equal to the actual request host and `action=create_card`. Never trust client-reported verification success.
3. Require a valid Vercel-overwritten `X-Forwarded-For` address; fail closed without one. Do not consume a client-provided IP in the request body.
4. `CARD_RATE_LIMIT_SECRET` (independent 32+-character secret) HMAC-hashes the address before quota storage. No raw IP address, personal message, token, or email is saved in quota counters or logs.
5. Atomic, service-role-only Supabase RPC checks and reserves limits in one serialized transaction: 3 per address per UTC hour, 10 per UTC day, and 150 across all visitors per UTC day. Reject exhausted quotas with 429. Quota reservations are not refunded after failed card writes to avoid complex retry races.
6. Same-origin JSON POST only, 8 KiB request-body cap and preexisting 40-code-point names / 600-code-point message limits.
7. Existing unguessable hashed recipient token, 24/48/72-hour expiration, RLS, and nightly expired-card deletion remain intact.

## Deployment steps
1. Review and apply the new `supabase/migrations/20261120194500_public_card_creation_quota.sql` to the dedicated project. Verify only service_role can execute `reserve_public_card_slot`, and that anon/authenticated roles have no access to the counters.
2. Register a Cloudflare Turnstile widget with the actual production hostname. Configure `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public), `TURNSTILE_SECRET_KEY` (server-only Sensitive), and `CARD_RATE_LIMIT_SECRET` (server-only Sensitive).
3. Deploy and test in Preview **without enabling the flag**. Test on a controlled Preview hostname if enabling the feature for a preview; allow that hostname in Turnstile.
4. After tests, set `CARD_PUBLIC_CREATION_ENABLED=true` and `NEXT_PUBLIC_CARD_PUBLIC_CREATION_ENABLED=true` in Production, then redeploy. Both are required for the user-facing editor.
5. Verify: successful publish, invalid/missing CAPTCHA rejection, rejected cross-origin request, 429 quota limits, no Supabase public access, and failure-closed behavior during downtime.

## Threat model and scope
This is a low-volume public beta, not a proven spam-free system. Turnstile can be bypassed by determined attackers; per-IP quotas can be circumvented by distributed sources and shared IPs can cause false positives. Monitor aggregate failures and costs, and shut off the flag if traffic is suspicious. Do not email arbitrary recipients from this endpoint. If the project grows, add account/order validation, abuse reporting, WAF-level rate limits, and an operational alert on excessive quota use.

Cloudflare Turnstile server-side validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
Supabase function privileges: https://supabase.com/docs/guides/database/functions
