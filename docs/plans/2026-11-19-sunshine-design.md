# A Little Sunshine — approved concept

**Date:** 2026-11-19  
**Status:** Direction approved in conversation; implementation begins in PR #2.

## Purpose and feeling

A tiny encouraging note should feel like opening real stationery that someone made just for you. Recipient should feel *remembered, warmed, and quietly delighted*.

## Design direction (from CARD_DESIGN_QUALITY.md)

- **Feeling:** Gently encouraged; an ordinary day gets a little brighter.
- **Character:** Tactile, tender, lightly playful.
- **World:** Cream paper, folded peach envelope, pressed botanical shapes, afternoon sunlight.
- **Moment:** Tap the wax-like seal to open the envelope; a paper note rises and flowers unfurl once. The message then becomes a calm readable surface.
- **Signature:** One small botanical sprig and a round stamped seal. No random sparkles, floating blobs, or decorative UI effects.

## Recipients

The route `/cards/little-sunshine` shows a **demo**, with sample names and a message. An envelope is initially closed; a real button lets a recipient open it. On reveal, the letter appears with the personalized note. A replay button restores the initial state.

## Senders

The route `/create/little-sunshine` offers a mobile-first **mock customization** interface:
- Recipient name, sender name, note (up to 600 characters).
- Live preview using the same card component as the recipient route.
- A reset-to-example action.
- No submit/order/email action; browser state only. There is deliberately **no shareable link** yet.

## Composition

- Outer background: light paper/cream; editorial but restrained UI, readable dark ink.
- Card scene: warm paper with one central envelope. One restrained botanical motif appears in the scene and on the revealed note.
- Typography: legible UI sans + a tasteful serif for the letter title. Do not fake handwriting for the entire message.
- Desktop studio: 2 columns, form first, preview second. Mobile: form first, preview below in the same reading order; preview itself remains tappable and scroll-free.
- The card opens from anticipation → user action → one reveal → calm reading state. No perpetual motion, no sound.

## Accessibility and behavior

- Actual `button` elements for open/replay, keyboard-activatable with visible focus.
- After reveal, the message is real DOM text; never bake the personalized message into an image.
- `prefers-reduced-motion` eliminates transition/animation delay but preserves state changes and all content.
- Short and long messages wrap and remain readable without breaking the layout.
- Inputs have visible labels and length limits; strings are rendered by React as text.
- No private data in URLs, logs, analytics, or persistence.

## Acceptance

1. Gallery offers a working Sunshine preview and a customize link.
2. Recipient route starts closed and reveals the supplied demo note on interaction.
3. Editor modifies names/message live and uses the same component, with reset/replay.
4. Other two concept routes remain unchanged.
5. Tests cover normalization, empty defaults, length limits and line breaks.
6. `npm run check` and `npm run build` pass; preview deployment can be opened for visual inspection.
