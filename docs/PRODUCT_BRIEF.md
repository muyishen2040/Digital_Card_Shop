# Product brief (working draft)

## Vision

A free-to-use (initially), mobile-first digital card shop for meaningful tiny surprises. Rather than deliver a static image, each card opens as a personalized HTML/CSS/JS webpage with a delightful interaction.

## User journey (target, not yet implemented)

1. Sender browses reusable card designs.
2. Sender personalizes recipient/sender names, message, and possibly an image.
3. Sender selects a delivery date/time and places an order through a future storefront.
4. A unique, unguessable e-card link is created.
5. At the requested time, a transactional email sends the link to the recipient and a separate confirmation/copy to the sender.
6. Recipient opens and interacts with the card; card access expires 1–3 days after delivery.
7. Expiration releases a shared capacity slot for later orders.

## Current experiment

The minimal launcher now offers three distinct interactive recipient card prototypes, suitable for reviewing on a phone. A received card shows the interaction and sender-provided content, not shopper UI, instruction copy, or extra framing. Phase 2 adds private card-instance foundations before a real sharing flow. **Do not implement mock checkout, order processing, emails or inventory merely to demonstrate the prototypes.**

Proposed design directions:
- **A Little Sunshine:** envelope opening and floral/message reveal
- **Under the Same Sky:** fold-open celestial greeting card with a moonlit message
- **Make a Wish:** birthday candle and confetti interaction

New card concepts require an explicit interaction design and accessibility review before feature implementation.

## Future integrations

- Vercel / Next.js: all reusable e-card experiences under one app
- Supabase: instances, schedules, expiration and optional images
- Resend or equivalent transactional sender: scheduled delivery
- WooCommerce / WordPress: storefront, $0 orders, catalog, inventory
- Klaviyo: Customer Hub, buyer lifecycle, consented marketing and recommendations

## Principles

- The emotional experience of receiving a card comes first.
- Do not assume every recipient is a marketing subscriber.
- Expiration is access control plus eventual deletion; never treat delayed cleanup as the sole expiration mechanism.
- Scheduling and inventory must be race-safe when added.
- Use budget limits as guardrails; Vercel does not impose a fixed number of pages as inventory.
