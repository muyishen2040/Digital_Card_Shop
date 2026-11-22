# A Little Sunshine — recipient experience design

## Goal

Create a comforting, interactive digital greeting card that feels like opening a personally addressed paper letter. The recipient should focus on a single tactile action and the sender's note, rather than a surrounding website or instructions.

This specification covers the sample card at `/cards/little-sunshine` and personalized private cards at `/c/[token]`. The demo uses sample text; private cards load stored personalization. Email delivery and checkout are separate features and are not implemented.

## Art direction

- **Emotion:** Warmth, remembrance, quiet delight
- **Character:** Tactile, tender, lightly playful
- **Material:** Peach-colored folded envelope, cream letter paper, soft afternoon light
- **Hero interaction:** Tap/click to open the envelope; tap its letter's folded corner to fold the note back into the envelope
- **Signature motif:** A round sun seal and restrained botanical details

The artwork should feel coherent and handmade. Avoid floating interface labels, manufactured excitement, unrelated animations and excessive ornament.

## Visual composition and typography

The card is a full-viewport paper environment, not a narrow background inside a centered content panel.

- **Full-bleed atmosphere:** The warm paper and sunlight gradients cover the entire recipient viewport at mobile, tablet, and desktop widths. The central stage may limit the positions of the envelope and botanical decorations, but not the background. Large desktop displays must not expose plain side columns or different-colored margins.
- **Reading proportions:** The opened letter uses a maximum width of approximately 560px, slightly wider than the original narrow note. On phones it expands near the available viewport width with comfortable inner padding and scrolls for longer messages. The body text should retain a comfortable line length instead of stretching to the full screen.
- **Typeface roles:** Use Cormorant Garamond for the envelope address, recipient salutation, and signature; use Lora for the main sender message. Keep fallback serif stacks. Fonts are optimized and served with Next.js `next/font/google`, not requested from Google by the reader's browser at runtime.
- **Hierarchy:** Expressive typography is reserved for short personal details; the main letter remains readable. No new titles, instructions, toolbar, or decorative copy appear in the received card.
- **Physical close affordance:** A small folded paper corner in the upper right of the opened letter acts as the close control. It is part of the stationery, not a separate toolbar icon.

### Visual review

Compare a closed envelope and an opened letter at narrow phone width (~320–375px), tablet width, and wide desktop (~1440px). Confirm no background side bands, no letter clipping for 600-character messages, coherent typography fallback, and intact fold-back, keyboard, and reduced-motion behavior.

## Recipient journey

1. **Closed:** A full-viewport scene contains a central envelope addressed to the recipient and quiet botanical artwork. No navigation, preview notice, guidance, or shop controls are visible.
2. **Invitation:** On devices with a pointer, the envelope may lift slightly on hover. Keyboard focus has a visible indicator. Neither effect opens the card without an intentional activation.
3. **Open:** Click, tap, Enter or Space activates the envelope as a native button. The flap opens and the paper note rises and settles. There is no separate "Open envelope" action.
4. **Read:** The letter displays the recipient salutation, sender's message and signature as selectable DOM text. The recipient can scroll inside a long letter. No timer closes it.
5. **Fold back:** Tap/click/keyboard-activate the folded top corner of the letter to return it to the envelope. The note shrinks and slides toward the envelope, then the flap closes. A native 56px button supplies the touch target and accessible label without adding visible instructional text. The rest of the letter remains inert as a close target so users can select and scroll the message safely.
6. **Reopen:** The closed envelope becomes interactive again. The same note can be opened repeatedly.

The animation must respect `prefers-reduced-motion`, remain smooth on a typical phone, and prevent competing open/close actions while a transition is in progress. Transition completion or a recovery fallback restores a stable state and keyboard focus.

## Page structure and component boundaries

- `/`: the gallery of card designs, not a storefront
- `/cards/little-sunshine`: the uninterrupted recipient experience
- `src/components/cards/sunshine/SunshineCard.tsx`: standalone interactive component receiving typed `CardPersonalization` props
- `src/lib/cards/personalization.ts`: normalization and safe display defaults
- `/create/little-sunshine`: redirects to the card demo to preserve an earlier shared prototype URL

The other card concepts, Under the Same Sky and Make a Wish, are separate designs and should not inherit Sunshine's art direction or mechanics.

## Acceptance criteria

- A first-time recipient can discover and open the envelope without visible instruction text.
- The card can be opened and physically folded closed using mouse, touch, or keyboard, with accessible controls and reversible motion.
- The sender's note is the dominant content after opening.
- A long message and long names remain readable on narrow phones without clipping; the folded corner remains accessible while scrolling the message.
- Reduced-motion mode reveals the complete letter without animation-dependent behavior.
- The card contains no shop, editor, payment, or delivery UI.

## Integration boundaries

The sender editor creates expiring private card instances, and the same card component renders both sample content and personalized recipient messages. Token validation, storage, and abuse controls are handled separately on the server. Email delivery and checkout are not part of this card design.

See [CARD_DESIGN_QUALITY.md](../CARD_DESIGN_QUALITY.md) for cross-card design standards.
