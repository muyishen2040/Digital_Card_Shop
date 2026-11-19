# Under the Same Sky — recipient experience design

## Purpose

Create a quiet, cinematic digital greeting card about staying close across distance. Instead of opening paper stationery, a recipient touches bright stars in a dark sky to form a constellation. Once four stars are connected, the sender's message emerges as luminous typography.

The experience is self-contained at `/cards/same-sky` and uses fixed sample personalization until a card-serving API exists. There is no storefront, preview banner, or visible instruction text.

## Creative identity

- **Feeling:** Connection, stillness, tenderness across distance
- **Character:** Spacious, atmospheric, contemplative
- **World:** Midnight indigo sky, subtle horizon glow, sparse warm ivory stars and a crescent moon
- **Key interaction:** Tap four bright stars in any order. The selected stars glow; an ink-thin line connects each new point. The sender's note emerges only after the constellation is complete
- **Signature detail:** A small moon can be activated to dim the constellation and begin again

Unlike A Little Sunshine's tactile envelope, this card contains **no paper, envelope, floral motif or physical letter panel**. The message belongs to the sky and appears directly in the ambient scene.

## Recipient journey

1. On arrival, four prominent bright stars sit within a field of smaller, noninteractive points. No UI text tells the recipient what to do; the stars have subtle affordances on hover/focus.
2. Each selected star acquires a warm glow and joins a thin constellation line. Recipients may choose the four stars in any order. Previously selected stars cannot be selected twice.
3. The final star completes the constellation. A message addressed to the recipient fades into a calm reading area, with the sender's signature. The message remains available for reading and scrolling.
4. The crescent moon becomes an optional physical reset control. Activating it returns to unlit stars and hides the message without leaving the route.

## Accessibility and motion

- Stars are native buttons with 48px touch targets and names describing their constellation role. Progress is available to assistive technology.
- The moon reset is keyboard accessible once the constellation is complete; visual instructions are not necessary.
- When the note is revealed, move keyboard focus to it. Reset returns focus to the first star.
- The complete sender message remains ordinary selectable DOM text; text containers scroll for long messages and never become accidental reset targets.
- `prefers-reduced-motion` removes glows, transitions and line-drawing animation without altering completion logic.
- Prioritize narrow phone layouts and preserve touch target separation.

## Acceptance criteria

- `/cards/same-sky` shows only a night-sky recipient experience without any shopper/creator controls.
- All four stars may be selected by touch, click, or keyboard in any order; duplicated selections do not advance progress.
- Constellation lines reflect selection order; completing four stars reveals a message.
- The moon resets the experience; the same sequence can be repeated.
- Long notes, keyboard navigation, and reduced-motion settings remain usable.
- The style is visually distinct from the Sunshine envelope card.

The card receives the shared `CardPersonalization` contract, enabling a later backend to load a private card instance without coupling the scene to the storefront.
