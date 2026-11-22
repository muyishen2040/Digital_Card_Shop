# Make a Wish — implementation plan

## Goal and boundaries

Implement a stand-alone birthday card under `/cards/make-a-wish`. The recipient interacts directly with the candle to reveal a birthday message. No sender UI, orders, persistence, link delivery or WooCommerce.

This design is specified in [make-a-wish-experience-design.md](../designs/make-a-wish.md).

## Modules

1. `src/lib/cards/wish-demo.ts`: public example `CardPersonalization`.
2. `src/components/cards/wish/WishCard.tsx`: native candle button, reversible lit/blown-out state, focus management, a visible poster for the message, and accessible state announcements. The recipient message must never be a clickable reset target.
3. `src/components/cards/wish/WishCard.module.css`: warm cut-paper background, original SVG cake art, candle/flame/smoke, one finite confetti reveal, responsive typography, reduced-motion alternative.
4. `src/components/cards/wish/WishCard.test.tsx`: static semantic contract: the native candle control is named and the sender/recipient content is ordinary DOM text with no purchase controls.
5. `src/app/cards/[slug]/page.tsx`: render the birthday card for its existing catalog slug. Remove placeholder presentation once all three cards are interactive.
6. `src/app/page.tsx`: mark the birthday route as interactive.
7. `src/app/layout.tsx`: register the birthday display font while reusing the existing DM Sans body font.

## Verification

- GitHub Actions: `npm run check`, `npm run build`.
- Vercel PR preview: launcher, birthday route, and regression checks for Sunshine and Sky.
- Manual browser review: touch/click/keyboard candle action, finite confetti, message and focus, relight/reset, narrow phone, long text, reduced motion.

Keep the card reusable: the backend can eventually pass personalization without coupling visual controls to a checkout flow.
