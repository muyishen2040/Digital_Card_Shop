# Architecture

## Recipient experiences and shared card creation

This repository uses Next.js App Router, React, and TypeScript to serve reusable interactive greeting cards. Every recipient route is a complete interactive scene without storefront UI or a sender customization form. The separate sender editor creates expiring private card instances.

```text
src/app/                    Next.js routes
src/app/page.tsx            Minimal card-experience launcher
src/app/cards/[slug]/       Recipient-facing card routes
src/components/cards/       Independently styled card interactions
src/lib/cards/             Template catalog and pure personalization helpers
src/types/                 Shared card data contracts
docs/plans/                Active designs and implementation plans
docs/archive/              Completed plans and earlier design records
```

The launcher groups published recipient experiences from `src/lib/cards/catalog.ts` into City Postcards, Birthday Cards and General Cards. The homepage and sender editor share collection filters; each template has one primary collection, independent occasion tags, and destination metadata when applicable. Collection browsing does not change template slugs or private-card storage. The City Postcards collection is registered through `src/lib/cards/postcards/destinations.ts`, where each city is an independent manifest entry. The [publishing guide](CITY_POSTCARDS.md) describes artwork provenance, asset integrity checks, database allowlisting and how to add another destination. Each card uses public sample personalization and owns its interaction state, animations and scoped CSS.

The retired `/create/little-sunshine` address redirects to the recipient demo to preserve existing prototype links. The public sender editor at `/create` creates expiring instances through a Turnstile-verified and rate-limited API. The private recipient route `/c/[token]` renders the same card experience with persisted content. No scheduled email delivery or checkout is implemented.

## Card-instance storage

The repository contains the **internal storage contract** (`src/lib/cards/instance-model.ts`), a **server-only Supabase REST repository** (`src/server/cards/card-instances.ts`), and versioned schema migrations in `supabase/migrations/`. The dedicated Digital Card Shop Supabase project is deployed. Apply database changes through reviewed migrations, never by exposing credentials or public database access.

The storage model binds a reusable template to a private message, a SHA-256 token digest, and explicit availability/expiration times. Supabase RLS is enabled with no public grants or policies. Internal server functions use a secret key, which may **never** be sent to the browser.

See the [database runbook](../db/README.md) for schema changes, permissions, and deployment checks.

## Card creation service boundary

The interactive card component should remain reusable when content comes from a real card instance instead of a sample.

```text
Authorized card-creation request
           |
           v
 Validate input and fulfillment authorization
           |
           v
 Store card instance + expiration + unguessable access token
           |
           v
 Return private recipient link
           |
           v
 Recipient GET /c/[token] -> server verifies token and expiration
                           -> loads safe personalization
                           -> renders existing interactive card component
```

The current public creation caller is the sender editor with server-side Turnstile and quota verification. A future verified WooCommerce order webhook would be a separate authorized caller. No client should be trusted to mark an order paid or to issue unbounded public emails.

Email delivery, scheduling and WooCommerce are separate later integrations. Order processing will need webhook signature verification, idempotency, retries, and atomic inventory reservation if capacity is enforced. Recipient access already checks expiration on the server, while a separate scheduled retention job removes expired records. Never put personal notes, email addresses or tokens in analytics events, public source code or insecure query parameters.

Collection expansion should reuse this boundary. No new persistence or authorization surface is needed solely because a card belongs to a different collection.
