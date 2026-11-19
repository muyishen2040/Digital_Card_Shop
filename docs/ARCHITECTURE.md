# Architecture

## Current recipient-experience prototype

This repository uses Next.js App Router, React, and TypeScript to serve reusable interactive greeting cards. The current goal is to validate the **recipient's experience**: every implemented card route is a complete interactive scene, without storefront UI or a sender customization form.

```text
src/app/                    Next.js routes
src/app/page.tsx            Minimal card-experience launcher
src/app/cards/[slug]/       Recipient-facing card routes
src/components/cards/       Independently styled card interactions
src/lib/cards/             Template catalog and pure personalization helpers
src/types/                 Shared card data contracts
docs/plans/                Feature designs and implementation plans
```

The launcher lists three working recipient experiences from `src/lib/cards/catalog.ts`: the Sunshine envelope, the fold-open Same Sky card, and the Make a Wish birthday candle. Each card uses public sample personalization and owns its interaction state, animations and scoped CSS.

The retired `/create/little-sunshine` address redirects to the recipient demo to preserve existing prototype links. No personalized card instance, API, database, or real delivery pipeline is deployed yet.

## Card-instance storage foundation (staged, not connected)

The repository contains the **internal storage contract** (`src/lib/cards/instance-model.ts`), a **server-only Supabase REST repository** (`src/server/cards/card-instances.ts`), and a proposed restricted database schema (`db/schema/card_instances.sql`). These are build-tested foundations, not live services. The available Supabase connection currently points to an unrelated application, so no schema has been applied and no environment secrets have been installed.

The storage model binds a reusable template to a private message, a SHA-256 token digest, and explicit availability/expiration times. Supabase RLS is enabled with no public grants or policies. Internal server functions use a secret key, which may **never** be sent to the browser.

See [card instance storage design](plans/card-instance-storage-design.md) and [database setup](../db/README.md).

## Planned backend service boundary

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

Card-creation callers can initially be an internal test client and later a verified WooCommerce order webhook. No client should be trusted to mark an order paid or to issue unbounded public emails.

Email delivery, scheduling and WooCommerce are separate later integrations. Order processing will need webhook signature verification, idempotency, retries, and atomic inventory reservation if capacity is enforced. Card access will need server-side expiration and data retention rules. Never put personal notes, email addresses or tokens in analytics events, public source code or insecure query parameters.

The backend diagram is a target architecture, not an implemented feature.
