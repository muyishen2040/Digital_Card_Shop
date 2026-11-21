# Product brief

## Vision

Little moments is a free-to-use, mobile-first collection of interactive digital greeting cards for meaningful tiny surprises. Rather than delivering a static image, each design opens as a personalized webpage with a tactile, purposeful interaction. The emotional experience of receiving a card comes first.

## Current product

A sender can browse existing designs by collection, personalize recipient and sender names, a message and text size, create a private expiring link after Cloudflare Turnstile verification, and share it. The recipient can open the link without an account. The Next.js application uses Supabase for private card instances and Vercel for deployment. See [the roadmap](ROADMAP.md) for what is verified and what remains to be tested.

The experience is free and does not require a purchase. Email delivery, scheduling, checkout, subscriptions and marketing integrations are not part of the current flow. Do not implement mock commerce to demonstrate new cards.

## Collection strategy

Organize the gallery around recognizable groups of designs rather than a flat list of unrelated cards. A collection provides an emotional or visual promise; an occasion helps a sender find the right card; a design is the actual reusable template. A card instance is a separate, private personalized copy of a design.

| Primary collection | Promise | Examples | Direction |
| --- | --- | --- | --- |
| City Postcards | Send a small, beautiful memory of a place. | Landmark, streetscape and waterfront postcards | First expansion; one consistent editorial postcard family |
| Birthday Cards | Celebrate someone's birthday with a joyful personal reveal. | Make a Wish; future distinct birthday concepts | Expand after the postcard foundation |
| General Cards | Send a meaningful note without needing a special occasion. | A Little Sunshine, Under the Same Sky; future gratitude and everyday greetings | Preserve and improve existing designs |

Additional collections (seasonal holidays, milestones, or others) can be considered after the initial three are useful. Do not create empty categories merely to fill a navigation menu.

A design has one primary collection and may later carry optional occasion tags (e.g. friendship, encouragement, gratitude, birthday), so discovery does not require duplicated templates. A city postcard is suitable for multiple occasions. Destination metadata (city, country/region) belongs to the postcard design, not the user's private message. Country/region is optional grouping metadata, not an assertion that city and country are interchangeable.

### First focus: City Postcards

Build a coherent, collectible series inspired by editorial travel photography and handmade paper illustration. Each destination uses a hero photograph, a complementary illustrated scene on the front, and a distinct illustrated paper reverse. The recipient turns the card over to reveal a real, personalized message. The front and back should feel like two sides of one physical postcard.

The series should share a repeatable artwork-production recipe, layout rules, typography and accessible flip interaction. Each city brings its own visual identity through carefully selected landmarks, palette and source images rather than custom animation code.

The reusable postcard renderer supports destination-specific artwork and shared personalization. Destination selection, source photographs, approved artwork and individual design implementation belong in separate destination-specific PRs.

### Product and engineering boundaries

- Keep the existing card experiences and their private links compatible.
- Reuse the existing sender, private-link, quota and expiration flow. A collection is discovery metadata, not a different storage or fulfillment system.
- Keep the recipient experience immersive: no storefront chrome, tutorials or unrelated controls on a received card.
- Within the postcard family, consistency of interaction is intentional. Other collections may use genuinely different mechanics.
- Keep personalization separate from artwork. Do not bake names, private messages or sender signatures into generated assets.
- New concepts require an explicit interaction/design specification and mobile accessibility review before feature implementation. Follow [the card design quality guide](CARD_DESIGN_QUALITY.md).

## Future user journey

A sender will be able to choose a design by collection and occasion, personalize a note, create a temporary private card and share it directly. Scheduled transactional delivery and an optional storefront may extend this flow later. A recipient's address does not imply permission to send marketing. Expiration must be enforced by access control, with eventual deletion for retention.

## Future integrations

- Vercel / Next.js: reusable card experiences under one app
- Supabase: card instances, expiration and future delivery schedules
- Resend or equivalent: scheduled transactional delivery
- WooCommerce / WordPress: optional storefront, orders and inventory
- Klaviyo: consented customer lifecycle and recommendation experiments

Use budget limits as guardrails; do not assume a fixed number of deployed pages is inventory. Scheduling and inventory must be race-safe when introduced.
