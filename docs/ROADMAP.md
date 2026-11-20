# Roadmap

## Phase 1 — Recipient experience validation

- [x] Create public GitHub repository and initial application scaffold
- [x] Establish agent guidance for obra/superpowers
- [x] Add product context, catalog metadata, tests, and lightweight experience launcher
- [ ] Install Superpowers in the chosen local coding agent
- [x] Brainstorm and approve the first card's interaction direction
- [x] Implement first interactive card and personalization unit tests
- [x] Complete the remaining distinct card experiences
  - [x] Under the Same Sky — fold-open celestial friendship card
  - [x] Make a Wish — candle-based birthday card
- [ ] Review mobile layout, accessibility, and reduced-motion behavior
- [x] Import the repository to Vercel
- [ ] Review the Sunshine recipient interaction on phone and desktop

**Phase 1 is recipient-first.** The launcher opens immersive card experiences. Sender forms and store features are deferred until they support a real API or purchase flow.

## Phase 2 — Shareable temporary card instances

- [x] Define private instance IDs, token hashing, stored personalization and data-retention boundaries (schema proposal and server repository)
- [ ] Provision a dedicated Supabase project, apply the schema as a migration, and verify RLS/grants
- [ ] Add private recipient links with server-enforced expiration (1–3 days) and a generic unavailable page
- [ ] Add authorized, abuse-protected sender creation and share flow, with layout-aware message fitting at mobile and desktop sizes
- [ ] Implement expired-data cleanup and observability without storing sensitive values in logs
- [ ] Optional image uploads with validation/limits

## Phase 3 — Delivery

- [ ] Verified sending domain, provider and rate limits
- [ ] Timezone-safe scheduling, retries, and failure handling
- [ ] Separate sender confirmation and recipient message

## Phase 4 — Storefront

- [ ] WordPress + WooCommerce
- [ ] Customization/checkout handoff and verified order webhooks
- [ ] Atomic shared-capacity reservation and automatic replenishment

## Phase 5 — Klaviyo

- [ ] WooCommerce integration and Customer Hub eligibility check
- [ ] Buyer/customer events and optional marketing consent
- [ ] Recommendation and retention experiments

Phases 2–5 describe planned capabilities and are not part of the recipient-experience prototype.
