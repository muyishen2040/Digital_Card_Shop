# Architecture

## Phase 1 (in this repository)

```text
src/app/               Next.js routes
src/lib/cards/         Reusable catalog and pure functions
src/types/             Shared type contracts
src/components/cards/  Independent interactive card components (future)
docs/plans/            Approved designs and task plans
```

Gallery metadata lives in `src/lib/cards/catalog.ts`. A future card component should take typed personalization props and own its animation and styling.

The current `/cards/[slug]` route is only a concept placeholder; there is no real personalized card link yet.

## Later: event boundaries

```text
WooCommerce paid/free order
           |
   verified webhook
           v
   order service -> capacity reservation -> card instance in database
                                         -> schedule transactional delivery
Recipient email -------------------------> secret /c/[token] route
                                            (server checks expiration)
                                         -> expiry and deletion worker
```

Order webhooks require signature verification, retries/idempotency, and atomic stock reservation. Card access requires a cryptographically unguessable token and server-side expiration check. Image storage and private messages need strict retention. Never put email addresses or messages in query strings, public event properties, or third-party marketing events.

Do not implement this planned system during the visual-prototype phase.
