# City Postcards — collection design specification

## Purpose

City Postcards is a family of collectible, mobile-first cards that let a sender share a memory of a place with someone they care about. Use one repeatable visual grammar and one tactile postcard flip across destinations. Each city should feel recognizable and individually art-directed, not like a generic template with a name swapped.

The [artwork generation playbook](city-postcard-artwork-playbook.md) describes one repeatable two-source-photo process. Each destination requires its own artwork, source-rights and rendering review regardless of whether multiple destinations share one pull request. See the [publishing guide](../CITY_POSTCARDS.md).

## Design identity

- **Feeling:** Remembrance, quiet delight, the warmth of wishing someone were there.
- **Character:** Editorial, poetic, tactile.
- **World:** Authentic travel photography, finely textured natural paper, handmade colored illustration and understated ink lettering.
- **Moment:** A single tap turns the physical-feeling postcard over to reveal a personal note.
- **Signature:** A recognizable city motif on each side; front and reverse tell complementary stories, not the same scene twice.

Shared mechanics within this intentional collection are an exception to the non-postcard rule that new concepts need different interactions. The postcard itself is the interaction; do not add destination-specific games, drag-to-reveal mechanics, confetti or other unrelated animation.

## Input contract: two photographs, two coordinated designs

| Input | Purpose |
| --- | --- |
| Photo A — hero scene | Authentic, recognizable large front photograph. Its key shapes and atmosphere inspire a much smaller front illustration. |
| Photo B — complementary scene | Reference for the handmade illustration integrated into the reverse. Choose a distinct view, landmark, street scene or object from the same city. |

Use two photos with permission suitable for the intended distribution, credible place identity and enough resolution for a portrait composition. A photograph of a skyline plus a different waterfront viewpoint or street-level scene is a good pair. Do not substitute an unrelated city or simply duplicate the illustrated skyline on both sides.

## Front and reverse composition

Both sides are independent **3:4 portrait artworks**, with a shared aspect ratio, paper stock, frame treatment, ink palette and visual style. Preserve the entire card at all viewport sizes. The art may be rich; UI outside it remains quiet.

Coordinates below describe approximate percentages of the portrait canvas, measured down from the top. Preserve the reading-safe areas even when individual compositions vary. The approved rendering, not a rigid percent ratio, determines final fit.

| Region | Front | Reverse |
| --- | --- | --- |
| Top | Photo A dominates approximately the first 48–53%; allow slight natural sky, water or environmental extension and an organic photo-to-paper transition. Small collection lettering and a tasteful postal motif are optional. | Warm cream textured paper, subtle atmospheric color and fine perimeter frame; optional small city-specific motif, no city heading. |
| Middle | Restrained editorial destination title around 53–63%, e.g. Greetings from / [CITY], and optional short accurate scene caption. | One full-width quiet writing area. Keep artwork, heavy paper texture and decoration away from text. Reserve roughly 12–68% height, inset 10–13% from the sides. |
| Bottom | Small handmade interpretation of Photo A around 66–82%, with controlled negative space. Optional fixed short greeting or tiny brand signature; no personalized content. | Smaller, distinct art scene derived from Photo B in the lower quarter (roughly 73–96%), organically integrated into the paper. No pasted rectangular image, detached thumbnail, floating icon or duplicate front illustration. |

The reference pattern is a premium independent art publication cover, not a commercial greeting-card advertisement. A real photographic upper half and a smaller handmade image are the distinguishing contrast on the front. Do not stretch a photo to fit. Reframe or extend only surrounding sky, water or nonessential environment. Keep landmarks and architectural proportions recognizable.

The reverse is deliberately **a complete newly art-directed background**, rather than a CSS paper panel with a cropped image appended at the bottom. Let pigment, clouds and paper grain blend naturally across the scene. Keep illustrated details low enough that even long notes never cover the art.

### Color, material and typography

- Use a compact four-color illustration palette sampled from the source photos; natural paper counts as a base. Photography may retain its fuller natural palette.
- Use delicate, slightly imperfect contours, flat acrylic/gouache-like color shapes, restrained watercolor-like washes where they help integrate the existing artwork, fine handmade brush detail and organic edges. Preserve recognition. Avoid cheap vector line drawings, cartoony characters, heavy digital gradients, glossy 3D, crayon texture and busy ornament.
- Favor warm ivory paper, dark ink lettering and photo-derived accent colors. Each destination may adapt its palette without altering the text layout or typography roles; preserve sufficient contrast.
- Use expressive calligraphic lettering for the recipient greeting and signature. A candidate for the fine handwritten reference is Pinyon Script; assess its actual appearance and legibility before approving it. Use a companion literary serif such as the existing Cormorant Garamond for readable body text, italic where appropriate. Do not pretend generated raster lettering identifies an exact typeface.
- Self-host approved licensed fonts using the existing Next.js font-loading approach in `src/app/layout.tsx`; use suitable serif/script fallbacks, including support for CJK and other scripts. Do not fetch fonts from third parties at recipient runtime.
- Keep main message text around 15–17 CSS px at normal phone reading scale; start the salutation around 25–32 px and signature around 22–26 px, rather than oversized display headings. Verify with actual fonts and 320px screens. Never shrink the text automatically to fit long content. Use scrolling.
- Borders, rules and motifs are part of the artwork, not independent UI boxes. No top-right address square, right-hand To column, redundant destination heading on the reverse, or extra explanatory copy.

## Personalization and text layout

Generated production background assets must contain no personal text: names, note and signature are DOM text from the existing `CardPersonalization` contract. Prefer text-free front and back assets, with the destination title, optional fixed front greeting and collection lettering overlaid as real text. Artwork may include a decorative, nondated stamp illustration; actual sender-specific dates must not be invented or baked into it.

The reverse reads as a personal letter: salutation, main message, signature. No split address column or large unused right side. Align content naturally within the reserved area. Put decoration above or below, never between every text element. For short notes distribute whitespace comfortably; the signature follows the note, not a detached empty address field.

The sender modifies content in the existing editor; the recipient sees read-only selectable text. Local design prototypes may provide editable overlays for testing. Personalized text is escaped by React, not inserted as HTML. Preserve newlines and Unicode, and avoid storing it in artwork files, public URLs or logs.

All postcards retain the shared limits of 40 characters per name and 600 characters per message. Start with an editorial recommendation of about 180 characters, then validate against the rendered text region; it is guidance, not a publication limit. Ensure `data-card-text-region` marks the actual scrollable reading surface used by the sender preview. A long note scrolls internally above the artwork, and its signature stays reachable. Do not clip, truncate or place content behind the image.

## Interaction and accessibility

1. Arrive with the front visible, centered on a restrained full-viewport atmosphere. The complete artwork is the opening control.
2. A native button with a descriptive accessible name responds to click, touch, Enter and Space. Use a subtle lift on pointer hover only, then a ~650–800 ms horizontal 3D rotation with perspective, hidden backfaces and no mirrored text.
3. The reverse settles in place with the message readable, focus moved into the note. The hidden face must not be interactive or read by assistive technology.
4. A simple tap or click anywhere on the reverse returns to the front, including the illustration, paper margins and note. A full-face native button provides the accessible return control behind the reading area; ordinary pointer taps inside the note also turn the card. Text selection, dragging and scrolling must never accidentally turn the card. Restore focus to the front control after closing.
5. Prevent overlapping transitions and provide a completion fallback; reduced motion reveals the other side immediately. The message never automatically disappears.

The prototype has no navigation, banner, detached action buttons or visible instructions. Avoid the temptation to expand the interaction solely because a city has a different landmark.

## Reusable implementation

One `CityPostcard` component under `src/components/cards/postcard/` owns the layout, typography, animation and accessibility. Each destination supplies artwork URLs, scene description and title metadata. A single specification for front/back safe zones applies to every asset pair. Only add layout variants if rendered evidence demonstrates a real need.

Suggested destination fields: stable slug such as `city-postcard-<city-slug>`, display title, collection identifier, optional occasion tags, city and country/region, optional scene caption, front/background asset paths, back/background asset paths, accessible artwork descriptions, palette or restrained accent token. Use the simplest typed configuration that works for two actual destinations; avoid a new database or CMS solely for catalog metadata.

Integration points to review:
- `src/types/card.ts` and `src/lib/cards/catalog.ts`: typed collection and destination metadata while retaining existing slugs and category/occasion information.
- `src/components/cards/RecipientCard.tsx`: dispatch postcard destinations to the same reusable renderer; demo route and sender preview should reuse it rather than duplicating behavior.
- `src/app/cards/[slug]/page.tsx`, gallery and sender editor: discovery, sample note and actual creation selection.
- `src/lib/cards/content-policy.ts`: explicit supported design validation and guidance; never allow arbitrary template slugs.
- `supabase/migrations/`: the existing template-slug CHECK explicitly allows reviewed templates. Extend it with a forward migration (do not edit applied migrations) before enabling creation of new city templates, preserving all existing slugs, constraints and grants. Keep allowlisting explicit until scale justifies another reviewed design.
- Preserve current Turnstile, quota, private-link, expiry and retention behavior. No new credential or delivery service is required.

Store public design assets in a predictable directory, e.g. `public/cards/city-postcards/<city-slug>/front.webp` and `back.webp`. Production assets are immutable when changed incompatibly; avoid breaking existing private cards. No personal photos or messages in these assets.

## Acceptance gates

- Review both faces side by side for consistent craft, legibility, authentic recognizable details, distinct city imagery, and absence of generated gibberish.
- At 320px, 390px, tablet and desktop, the entire front and reverse are visible, with no horizontal overflow, cropping or message/art collisions.
- Test short and 600-character multi-line notes, 40-character names, CJK content, keyboard navigation, text selection, scrolling, rapid taps, reduced motion and replay.
- Verify existing cards, private links and quota/expiry behavior remain compatible; use real sender preview to verify text fit.
- Run lint, type check, unit tests and production build, plus review rendered screenshots/recordings. An actual created private card opens without login.
- Add a second approved destination without new interaction code to prove the pattern.

Follow [the card design quality guide](../CARD_DESIGN_QUALITY.md) and [artwork playbook](city-postcard-artwork-playbook.md). This design specification does not itself authorize publication of any new destination.
