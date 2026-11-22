# Roadmap

## Phase 1 — Recipient experience validation

- [x] Create repository and application scaffold
- [x] Establish Superpowers workflow guidance, product context and catalog
- [x] Implement three distinct recipient experiences: A Little Sunshine, Under the Same Sky, Make a Wish
- [x] Deploy the application to Vercel
- [ ] Review all existing cards on mobile and desktop, including long messages, accessibility and reduced motion

## Phase 2 — Public shareable temporary cards

- [x] Define private instances, hashed bearer tokens, and retention boundaries
- [x] Provision Supabase and apply private-card and creation-quota migrations
- [x] Implement sender editor, interactive preview and private recipient route
- [x] Implement Cloudflare Turnstile verification, shared quota counters and public creation controls
- [x] Implement native sharing and canonical public recipient links
- [x] Enable public creation in production and verify a real personalized link can be created and opened without login
- [x] Implement scheduled expiry cleanup
- [ ] Verify quota exhaustion, invalid/expired access, actual scheduled cleanup and error handling in controlled tests
- [ ] Test the complete creation, sharing and receiving journey on iOS and Android

The existing three cards are live. Continue reliability checks alongside visual work; do not weaken abuse controls to add new designs.

## Phase 3 — Collection expansion (next product focus)

The primary collections are City Postcards, Birthday Cards and General Cards. See [the product brief](PRODUCT_BRIEF.md) for the taxonomy and rationale.

### 3A — City Postcards (first)

- [x] Establish a reusable postcard art direction, front/back layout, typography, interaction and artwork generation playbook
- [x] Create and publish paired city artwork assets with text-free reverse writing space
- [x] Build one reusable city postcard renderer with accessible, reversible flip and DOM personalization
- [x] Integrate city postcards with catalog metadata, gallery, demo, sender preview, server validation and database template allowlist
- [ ] Validate at 320px, 390px, tablet and desktop, including 600-character notes, keyboard, touch and reduced motion
- [ ] Verify complete card creation and recipient access for each new city after its database migration is applied
- [x] Add a contrasting second city to validate reuse of the existing interaction
- [x] Expand to additional cities after validating the shared renderer

Keep this roadmap destination-independent. Review each city's artwork, provenance and behavior independently; a pull request may publish multiple destinations without implying they are one permanent group. See the [publishing guide](CITY_POSTCARDS.md).

### 3B — Collection browsing and existing-card polish

- [x] Add collection metadata and intentional gallery grouping; preserve all existing design slugs and links
- [x] Keep occasion tags and city/country metadata separate from the primary collection
- [ ] Verify collection filters and preserved sender drafts on narrow devices and desktop
- [ ] Review and refine the three existing designs with the card quality guide
- [ ] Confirm all existing templates remain compatible with the creation and receiving flow

Collection browsing can ship alongside the first postcard when useful. Do not add empty category pages or a storefront.

### 3C — Birthday and General Cards (later)

- [ ] Explore additional birthday designs with distinct celebrations
- [ ] Explore gratitude, everyday friendship and encouragement designs
- [ ] Reuse existing personalization infrastructure and distinguish each non-postcard concept's interaction

## Phase 4 — Delivery

- [ ] Verified sending domain, provider and rate limits
- [ ] Timezone-safe scheduling, retries and failure handling
- [ ] Separate sender confirmation and recipient message
- [ ] Evaluate optional image uploads with validation and limits

## Phase 5 — Storefront

- [ ] Evaluate WordPress + WooCommerce
- [ ] Customization/checkout handoff and verified order webhooks
- [ ] Atomic shared-capacity reservation and automatic replenishment if needed

## Phase 6 — Klaviyo

- [ ] WooCommerce integration and Customer Hub eligibility check
- [ ] Buyer/customer events and optional marketing consent
- [ ] Recommendation and retention experiments

Phases 3–6 are planned, not deployed features.
