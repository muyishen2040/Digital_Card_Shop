# A Little Sunshine — recipient-first design

**Revised:** 2026-11-19, following review of PR #2

## Creative direction

- **Feeling:** Warmth, being remembered, quiet delight
- **Character:** Tactile, tender, lightly playful
- **World:** Peach folded paper, warm natural light, a restrained botanical sprig
- **Moment:** A tap on the envelope causes its flap to open; the letter rises and settles for reading
- **Signature:** One round sun seal and a small botanical sprig

## Recipient scene

The route `/cards/little-sunshine` is the entire recipient experience, full-screen and free of surrounding UI.

- Closed: paper envelope with sender-provided **For {recipient}** name; no marketing, demo, or instructional copy
- Desktop hover/focus: a gentle invitation through slight movement; **hover does not open**
- Click/tap/Enter/Space: the envelope itself is a native button; the flap flips and the letter rises smoothly
- Open: sender's message with recipient salutation, sender signature, and one discreet replay icon
- The message remains open until replay, scrolls when necessary, and never depends on animation or hover
- Keyboard focus, accessible names, reduced-motion behavior and touch targets are mandatory

## Prototype launcher

The homepage simply opens card experiences. Sunshine works; future cards may still be placeholders. There is no sender/mock shop form in this phase. The old `/create/little-sunshine` route redirects to the immersive card.

Eventually, the backend will provide personalized content to this **same card component**, using private expiring card instances.

## Review

Inspect opening, final text and replay on mobile and desktop. Test short/long messages, keyboard navigation, and reduced motion. Successful CI is necessary but not a substitute for visual review.

See [CARD_DESIGN_QUALITY.md](../CARD_DESIGN_QUALITY.md).
