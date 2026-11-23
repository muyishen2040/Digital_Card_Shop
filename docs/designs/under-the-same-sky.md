# Under the Same Sky — recipient experience design

## Purpose

Under the Same Sky is a quiet greeting card about closeness across distance. The recipient sees a recognizable **folded night-sky card** floating in a full-screen twilight setting. Tapping the cover unfolds it outward into a two-page greeting; folding it back returns to the night-sky cover. The physical card itself is the interaction.

The sample route `/cards/same-sky` uses demo personalization, while expiring private recipient links at `/c/[token]` use stored sender messages. Neither recipient view includes store controls, developer labels, or instructional UI.

## Distinctive identity

- **Feeling:** Connection, stillness, tenderness across distance
- **Character:** Cinematic, contemplative, intimate
- **World:** Midnight indigo cover with a crescent moon, star points and fine celestial linework; a lighter moonlit interior with handwritten-feeling editorial display typography
- **Moment:** A single cover unfolds around a vertical spine, revealing a personalized right-hand page; folding the cover back restores the original card
- **Signature:** Night sky on the front and a quieter constellation motif on the inside of the turning cover

Unlike A Little Sunshine, this design has **no envelope and no letter emerging from one**. The meaningful action is the entire folded greeting card opening into a spread. Unlike Make a Wish, the response is contemplative rather than celebratory.

## Layout and motion

- The first frame clearly shows a card with physical edges, depth and a visible paper spine. It is centered as a closed object, not hidden among tappable stars.
- At desktop widths, the closed right-hand cover pivots outward to the left around the spine; the book recenters into an open two-page spread. The left page is the inside of the cover, the right page contains the message.
- On narrow phones, size the closed cover at approximately a 4:5 portrait ratio instead of stretching it to the viewport height. Opening the cover directly reveals a full-width message page at a matching paper proportion, with internal scrolling for long notes. There is no separate reading step, reading toggle, or visible instructional text. The shared component is used in both sender preview and private recipient page.
- In the opened state, the back of the cover is the main close surface on desktop. A small folded page corner remains available on the upper-right of the message page, especially for mobile users.
- The text body itself never closes the card. It remains selectable and vertically scrollable for long messages.
- The experience settles into a still reading state, with no ongoing sparkling or looping reveal animations.

## Interaction and accessibility

1. **Closed:** A full-card native button with an accessible label is visible immediately. Subtle hover movement suggests the entire cover can be activated, but hover alone does nothing.
2. **Opening:** Tap/click/Enter/Space opens the cover. While the paper turn is occurring, additional activations are ignored.
3. **Open:** The personalized salutation, message and sender signature are rendered as normal DOM text. Keyboard focus moves to the message after the turn completes.
4. **Closing:** Tap the inside of the cover or the folded page corner. Both controls fold the cover closed. Focus returns to the cover after the animation.
5. **Repeat:** The same message can be opened and closed repeatedly.

The state model is `closed → opening → open → closing → closed`. Transition completion and a fallback settle the state. `prefers-reduced-motion` reveals or closes the card immediately while preserving all controls.

## Acceptance criteria

- An unfamiliar visitor can identify the **card** and discover its cover as the principal touch target without instructions.
- Opening and closing are reversible physical page turns without an envelope, moon reset icon or star-selection puzzle.
- The message is readable on mobile and desktop and supports 600 characters without clipping; taps/scrolling in the text never close the card.
- Card controls remain keyboard-operable and labeled for assistive technology. Focus and reduced-motion behavior work.
- No store, sender editor, price, navigation or generic replay icon appears in the recipient view.

The component accepts the shared `CardPersonalization` contract. Demo and private-link routes share the same interaction; the server handles private storage and token validation.
