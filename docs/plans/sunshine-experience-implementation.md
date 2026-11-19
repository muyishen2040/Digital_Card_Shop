# A Little Sunshine — implementation plan

## Goal and scope

Implement a self-contained, recipient-first interactive envelope card at `/cards/little-sunshine`, plus a minimal launcher at `/` for testing multiple card experiences. This plan excludes accounts, sender customization, persisted instances, card APIs, email delivery, WooCommerce, and payments.

The design contract is [sunshine-experience-design.md](sunshine-experience-design.md).

## 1. Personalization contract

**Files:** `src/types/card.ts`, `src/lib/cards/personalization.ts`, `src/lib/cards/personalization.test.ts`.

- Accept `recipientName`, `senderName`, and `message` through typed props.
- Normalize whitespace and line breaks; apply readable fallbacks to empty fields.
- Bound name and message lengths, without mutating the caller's data.
- Unit test the pure normalization behavior, including long content.

## 2. Envelope interaction

**Files:** `src/components/cards/sunshine/SunshineCard.tsx`, `SunshineCard.module.css`.

- Render a native button styled as a physical envelope; the envelope is the activation target.
- On click/tap/keyboard activation, open the flap, move the envelope aside and reveal the letter.
- Show only the recipient salutation, message and sender signature in the open state.
- Offer an unobtrusive replay control; handle focus handoff for keyboard and screen-reader users.
- Ensure long content can scroll, reduced motion works, and the card adapts to narrow phones.

## 3. Standalone routes

**Files:** `src/app/page.tsx`, `src/app/page.module.css`, `src/app/cards/[slug]/page.tsx`, `src/app/create/little-sunshine/page.tsx`.

- Provide a minimal launcher that distinguishes interactive cards from design concepts.
- Render Sunshine directly as a full-screen recipient experience with fixed demo data.
- Preserve other concept routes as placeholders.
- Redirect the existing `/create/little-sunshine` URL to the recipient demo instead of maintaining a sender-facing form.

## 4. Verification

- Run `npm run check` (ESLint, TypeScript, Vitest) and `npm run build` through CI.
- Check `/`, `/cards/little-sunshine`, and other concept routes on the Vercel preview.
- In a real browser, review closed → hover/focus → tap/click/keyboard open → reading → replay.
- Test phone widths down to 320px, a 600-character message, reduced motion and keyboard-only interaction.
- Keep the PR open for visual review; CI and HTTP checks alone do not establish visual polish.

## Later service integration

A verified backend API can create persisted instances with server-enforced expiration and return an unguessable card URL. The recipient route should still render the same card component with stored personalization data.
