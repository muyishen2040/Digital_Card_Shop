# A Little Sunshine — recipient experience design

## Goal

Create a comforting, interactive digital greeting card that feels like opening a personally addressed paper letter. The recipient should focus on a single tactile action and the sender's note, rather than a surrounding website or instructions.

This specification covers the recipient experience at `/cards/little-sunshine`. Real personalized delivery is not implemented; the route uses a fixed sample note for testing.

## Art direction

- **Emotion:** Warmth, remembrance, quiet delight
- **Character:** Tactile, tender, lightly playful
- **Material:** Peach-colored folded envelope, cream letter paper, soft afternoon light
- **Hero interaction:** An envelope opens on direct tap/click; the letter rises into a calm reading state
- **Signature motif:** A round sun seal and restrained botanical details

The artwork should feel coherent and handmade. Avoid floating interface labels, manufactured excitement, unrelated animations and excessive ornament.

## Recipient journey

1. **Closed:** A full-viewport scene contains a central envelope addressed to the recipient and quiet botanical artwork. No navigation, preview notice, guidance, or shop controls are visible.
2. **Invitation:** On devices with a pointer, the envelope may lift slightly on hover. Keyboard focus has a visible indicator. Neither effect opens the card without an intentional activation.
3. **Open:** Click, tap, Enter or Space activates the envelope as a native button. The flap opens and the paper note rises and settles. There is no separate "Open envelope" action.
4. **Read:** The letter displays the recipient salutation, sender's message and signature as selectable DOM text. The recipient can scroll inside a long letter. No timer closes it.
5. **Replay:** A small, accessible replay control returns the scene to the closed state.

The animation must respect `prefers-reduced-motion`, remain smooth on a typical phone, and avoid triggering twice.

## Page structure and component boundaries

- `/`: a minimal launcher linking to standalone card routes, not a storefront
- `/cards/little-sunshine`: the uninterrupted recipient experience
- `src/components/cards/sunshine/SunshineCard.tsx`: standalone interactive component receiving typed `CardPersonalization` props
- `src/lib/cards/personalization.ts`: normalization and safe display defaults
- `/create/little-sunshine`: redirects to the card demo to preserve an earlier shared prototype URL

The other card concepts, Under the Same Sky and Make a Wish, are separate designs and should not inherit Sunshine's art direction or mechanics.

## Acceptance criteria

- A first-time recipient can discover and open the envelope without visible instruction text.
- The card can be opened with mouse, touch, or keyboard and replayed with an accessible control.
- The sender's note is the dominant content after opening.
- A long message and long names remain readable on narrow phones without clipping.
- Reduced-motion mode reveals the complete letter without animation-dependent behavior.
- The card contains no shop, editor, payment, or delivery UI.

## Deferred capabilities

An authenticated backend may later save personalized card instances, create secret expiring links, and load recipient content into the same component. Email sending and WooCommerce checkout are separate integrations, not requirements of this experience prototype.

See [CARD_DESIGN_QUALITY.md](../CARD_DESIGN_QUALITY.md) for cross-card design standards.
