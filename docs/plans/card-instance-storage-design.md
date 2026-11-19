# Card-instance storage — Phase 2 foundation

## Problem and goal

The three recipient card experiences are reusable React components with public sample content. Real sharing requires an independent per-recipient **card instance** while preserving the creative animations and avoiding accidental disclosure of private messages.

This foundation PR defines the data contract, restricted Supabase table, token material and internal server repository. It intentionally does not launch a public sender UI, creation API, private recipient URL, email delivery, scheduling or checkout.

## Model

- `template_slug`: an existing card template (Sunshine, Same Sky, Make a Wish)
- `recipient_name`, `sender_name`: nonempty text, up to 40 characters
- `message`: 1–600 characters, supports line breaks
- `access_token_hash`: unique SHA-256 hash of a 256-bit randomly generated capability token
- `available_at`, `expires_at`: an explicit 24/48/72-hour access window
- `id`, `created_at`: internal UUID and timestamps

No recipient email address, image, purchase status, or payment-related fields are needed for the initial sharing foundation.

## Security decisions

1. **Separate deployment boundary.** Use a dedicated Supabase project. Never apply schema changes to unrelated applications.
2. **Public schema with private access.** The table is in `public` only for server-side REST access through the Supabase gateway. Enable RLS and revoke `anon`/`authenticated` privileges explicitly; there are no client RLS policies. The server secret key is never public.
3. **Capability tokens.** A token is 32 cryptographically random bytes encoded for URLs. The token itself is returned on creation but only its SHA-256 digest is stored. Revoking or deleting a row invalidates the link.
4. **No untrusted writers.** The repository functions are internal; a later public creation endpoint requires explicit authorization, quotas and rate limits. Sharing a link gives read access to the specific card, not permission to create more.
5. **Server-enforced expiry.** Fetch using a token digest and available/expiration filters, then recheck in server time. Invalid, expired, and unknown tokens receive the same not-found result. Delayed database cleanup must never be the sole access control.
6. **No sensitive logging.** Do not log token values, messages, API responses containing note fields, or email addresses.

## Server integration

`src/server/cards/card-instances.ts` is marked server-only and uses the Supabase REST Data API with a backend `sb_secret_` key. Its two internal functions are:

- `createCardInstance(draft)`: validates a known design and required sender fields, issues a token, persists only its hash with an expiration, and returns internal ID, token and expiration to a **trusted** caller.
- `findActiveCardByToken(token)`: validates token shape, hashes it, loads one still-active instance and returns safe content. Returns `null` for non-existent or expired cards.

There are intentionally no public API handlers invoking these functions yet. The templates and animations continue to work with hard-coded demo content.

## Follow-on work

- **PR #8:** Implement `/c/[token]` with server-side retrieval, cache and referrer protections, anonymous-link abuse controls and uniform unavailable pages.
- **PR #9:** Implement an authenticated or abuse-protected sender creation path plus a form for personalization and share.
- **Delivery phase:** Add scheduled activation and email integration with retention/cleanup coordination.
- **Pre-production:** Apply the SQL through a CLI-generated migration in the dedicated Supabase project and verify RLS/grants with the security script and advisors.

## Acceptance criteria

- Model enforces valid template IDs and size/time limits without silently truncating personal content.
- A unique unguessable token is generated; only its digest enters the database payload.
- Database blueprint enables RLS and denies all direct client read/write access.
- No secret reaches a client bundle or public route; no sensitive data is included in logs.
- Tests cover validation, token format/hash, expiry boundary and invalid inputs.
- All three existing card routes continue to render and build without configured Supabase variables.
- No unrelated Supabase project was modified.
