# E-card design quality — anti-slop guide

> **Quiet interface, expressive card.** Make the recipient feel something specific—not merely see an attractive UI.

A compact, card-specific adaptation of [unslop](https://github.com/heydamir/unslop). Use it **alongside** the [Superpowers](https://github.com/obra/superpowers) brainstorm → approved design → build → review workflow. This is a design checklist, **not** a replacement for either upstream skill.

## Recipient-first experience: interaction without explanation

- **The card is the whole screen.** A received card needs no demo banner, preview disclaimer, shop navigation, instructional text, or CTA footer. Let the visual and the sender's words speak.
- **Make the object the control.** Tap the envelope, a star, or the candle itself. Use a native button with an accessible name, not a detached "Open envelope" button.
- **Hover invites; touch acts.** Subtle hover/focus feedback may hint at an interaction, but opening must work by click, touch, keyboard, and reduced-motion settings without hover.
- **Stage one uninterrupted reveal.** Let the object visibly cause the transition to the message. Avoid abrupt modal jumps and multiple unrelated entrance effects. The final reading state stays put.
- **Hide the guidance, not accessibility.** Prefer a meaningful physical affordance (such as a folded paper corner that closes the letter) over generic replay icons when it fits the card's world. Screen-reader labels and focus states must remain available without visually competing with the message. Do not make long, scrollable message surfaces accidental close targets.
- **Launcher is not a shop.** During prototyping, one lightweight index can open different card routes. Do not invest in mock checkout, customization, merchandising, or instruction-heavy preview panels.
- **Review the actual interaction.** Inspect closed → hover/focus → click/tap → reveal → reading → replay on mobile and desktop, including reduced motion and long messages.

## Before designing: define five things

Write one line for each in the design spec:

1. **Feeling** — What should the recipient feel? (comforted, remembered, delighted, grateful)
2. **Character** — 2–3 precise adjectives (e.g., *tender, tactile, mischievous*; not *modern, clean, premium*)
3. **World** — One coherent material or scene (folded stationery, ink on paper, moonlit sky, birthday candle)
4. **Moment** — The **one main interaction/reveal** that makes this card worth opening
5. **Signature** — One distinctive detail tied to the theme (a folded corner, handwritten star trail, candle smoke)

If you cannot describe the card's identity without naming colors, the concept needs work.

## Craft rules

- **Separate the frame from the artwork.** Keep launcher, buttons, navigation and labels restrained: consistent spacing, clear hierarchy, a quiet palette and one accent. Inside the actual card, illustration, expressive type, gradients, glowing stars, confetti or sound *may* be appropriate when they serve the story.
- **One hero, not decorative noise.** Center each design on one recognizable object/scene. Remove random floating blobs, generic sparkles, stock-looking 3D, glass panels, gratuitous borders, and effects added just to fill space. A star can glow because it is a star; a button does not need to glow.
- **Make it materially convincing.** Folded paper should have plausible edges and depth; candlelight should feel warm; night sky should have deliberate composition. Match typography, illustration style, color, lighting, and details to the *same world*.
- **Typography carries emotion and readability.** Use 1–2 complementary font families; reserve decorative/handwritten lettering for short featured phrases. Keep personalized messages comfortably readable, with clear contrast and enough room for unexpectedly long text. Avoid huge bold headings, generic inspirational filler, decorative all-caps labels, and gradients on text.
- **Respect visual rhythm.** Use a small spacing scale (4/8/12/16/24/32px as useful), intentional alignment, and whitespace around the message. Not every element needs a rounded card or shadow. Let one part of the scene dominate.
- **Specific words over AI copy.** A message should sound human. Keep UI actions short (*Open card*, *Read your note*, *Replay*) and avoid hype (*magical, supercharge, unlock*). Genuine greeting-card sentiment, poetry, and exclamation points are fine **when they fit the sender's message**.
- **Different designs need different mechanics.** Changing only a background color or font does not make a new e-card. Vary scene, interaction, reveal, material, and emotional pacing.

## Motion is the gift, not wallpaper

Build an intentional arc: **anticipation → recipient action → reveal → calm reading state**.

- Each animation should respond to an action or reveal meaning. No perpetual bouncing, pulsing buttons, scroll parallax, or endless confetti.
- Give the recipient control: an obvious tap/click target, a way to replay, and no animation blocking the message indefinitely.
- Keep interface feedback fast (~120–200 ms); allow the *main reveal* to breathe when appropriate. Avoid multiple competing entrances or camera-like movement.
- Support touch, keyboard and visible focus. Respect `prefers-reduced-motion` with a complete non-animated reveal. Keep interaction smooth on a typical phone.
- Never depend on animation, sound, hover, or color alone to convey the message.

## Applied to our first three concepts

| Concept | Art direction | Signature interaction | What to avoid |
| --- | --- | --- | --- |
| **A Little Sunshine** | Warm folded paper, sunlight, botanical detail | Envelope opens; a small bloom frames the note | Random hearts and flowers everywhere |
| **Under the Same Sky** | Midnight-blue folded card, celestial cover, moonlit interior | The cover folds outward to reveal the message, then folds back | Hidden star-selection puzzles and unreadably narrow mobile spreads |
| **Make a Wish** | Tactile little cake, soft candlelight, playful paper accents | Blow/tap to extinguish candle; one celebratory reveal | Endless confetti and cartoonish overload |

The table illustrates distinct design directions. Each implemented card must satisfy its own experience specification; see [A Little Sunshine design](plans/sunshine-experience-design.md).

## Review a rendered card (mobile first)

1. **Recognizable:** Can you describe why this design exists in one sentence? Does it look different from the other two?
2. **Focus:** Is the recipient drawn to one meaningful action, then the message? Remove anything that competes.
3. **Consistency:** Do type, material, spacing, lighting, illustration and motion belong to one world?
4. **Authenticity:** Does it feel crafted rather than like generic AI art, emoji-heavy UI, or a template with swapped colors?
5. **Legibility:** Test a short and a long personalized message, narrow mobile screen, keyboard focus and text contrast.
6. **Motion:** Does each effect support the story, stop at the right moment, and work with reduced motion?
7. **Reality:** Actually run it; inspect screenshots or browser recordings of **before open / during reveal / after open** on phone and desktop. Fix observed problems, not imagined ones.

**Editing order:** Audit the visible problems → agree on art direction → fix composition/spacing → copy → typography/color → illustration/material → motion → re-render and review. If a design already works, polish only the weak parts.

---

**Attribution:** Adapted from *unslop* by **Damir Sokolovsky** ([@heydamir](https://github.com/heydamir)), [source repository](https://github.com/heydamir/unslop), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This condensed e-card-specific guide is our adaptation, not an official upstream skill.

## Personalization text fit

Character count is not geometric fit: name length, language, line breaks, viewport size and loaded fonts all affect whether a note can be read without scrolling. Every card's reading area exposes `data-card-text-region` so the sender preview can call `measureCardTextFit` after fonts are ready and whenever content/layout changes. The preview should warn when a note overflows a narrow mobile layout and allow the sender to shorten it or knowingly keep a scrollable note, instead of clipping text or silently shrinking fonts.

The per-design recommendations (Sunshine ~240, Sky ~140, Wish ~100 message characters) are **editorial hints**, not hard limits. The shared storage cap is 600 characters for every design. Keep internal scrolling available in recipient cards for browser zoom, accessibility font scaling, unexpected layout conditions and existing content. Do not cut off or ellipsize someone’s message.
