# Make a Wish — recipient experience design

## Purpose

Make a birthday greeting feel like a small celebration the recipient starts themselves. A handcrafted, colorful cake sits in a graphic paper-cut world. Tapping the candle extinguishes its flame; a short burst of paper confetti accompanies a playful birthday message. Tapping the wick again relights the candle and resets the scene.

The demo experience lives at `/cards/make-a-wish`. Personalized private cards use the same component at `/c/[token]`. The recipient view is not a shop, editor, checkout, or email preview.

## Creative identity

- **Feeling:** Birthday excitement, affection, playful delight
- **Character:** Graphic, charming, optimistic, tactile in a different way from stationery
- **World:** Sunflower-yellow backdrop, coral-and-lavender layered cake, irregular cut-paper shapes, a restrained burst of colored paper
- **Key interaction:** Touch the candle flame to blow it out; the flame becomes a little smoke curl and a personalized celebration poster appears
- **Signature detail:** The candle remains in the scene, turning into a natural way to reset: touch the unlit wick to relight it

The palette, illustrated cake and cheerful typography are deliberately different from Under the Same Sky's folded indigo night-sky card and A Little Sunshine's quiet folded envelope. The recipient never opens a paper envelope.

## Recipient journey

1. The first frame contains a decorated cake with a lit central candle. The candle is the obvious native control; no visible instructions or UI text are displayed.
2. On touch, click, Enter, or Space, the flame goes out. A small smoke curl rises while a limited set of paper shapes burst outward once. The sender's note appears as a typographic celebration poster above the cake, rather than an elegant letter.
3. The note is selectable, scrollable DOM text: recipient salutation, sender's message, sender signature. The candle is still visible and its control now describes relighting the wick.
4. Activating the candle again hides the poster and confetti and relights the flame. Repeatable, with no generic replay button.

## Typography and art

- Display: Fraunces, with rounded, spirited lettering in deep plum.
- Body: DM Sans for a clear, approachable message.
- Colors: Warm lemon and ochre, soft coral frosting, pale lilac poster, plum ink. Decorative confetti is a finite burst, not perpetual animation.
- The main paper-cut illustration is an original inline SVG. All recipient text is live DOM text, not text baked into art.

## Accessibility, robustness and responsive behavior

- The candle has a generous touch target and dynamically labeled button state. Hover is optional; tap/click/keyboard always work.
- The note gets focus after reveal; focus returns to the candle after relighting.
- While the poster is visible, its independent scroll area handles long messages. Tapping or scrolling text must not relight the candle.
- Motion is brief, stops on a calm readable state, and is removed for `prefers-reduced-motion`.
- Small mobile viewports keep the candle button and message visible, preserving readable spacing and contrast.

## Acceptance criteria

- The birthday card occupies the full recipient viewport without site navigation or instruction copy.
- Touch/click/keyboard input toggles a physically meaningful candle action.
- One finite paper-confetti reveal occurs when the candle is blown out; no endless animation.
- The recipient sees a message in a style distinctly different from the envelope and constellation experiences.
- Relighting returns the cake to its original appearance; the experience is repeatable.
- Mobile, reduced-motion, keyboard access, and 600-character messages remain usable.

The sender flow creates expiring private instances that provide the component's typed `CardPersonalization` data. Private-link validation and storage remain independent of the visual interaction.
