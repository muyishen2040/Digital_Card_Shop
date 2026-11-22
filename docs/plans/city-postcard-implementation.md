# City Postcard — shared renderer implementation

**Historical implementation plan.** The shared renderer is implemented. The original rollout sequence below is preserved for reference; use the [City Postcards publishing guide](../CITY_POSTCARDS.md) to add destinations.

## Scope

Implement the collection's shared renderer against the approved [design specification](city-postcard-design.md) and [artwork playbook](city-postcard-artwork-playbook.md). This foundation deliberately does not add a destination, catalog entry, sender template, database allowlist entry, gallery group or public creation capability.

## Component contract

- The client component in `src/components/cards/postcard/CityPostcard.tsx` accepts a trusted, typed destination-artwork configuration and the existing `CardPersonalization` content contract.
- The two assets are pre-optimized, 3:4 public design files. Typography (destination title, optional caption, personal greeting, message and signature) is rendered as escaped DOM text, never flattened into artwork.
- Scope layout and motion to the component's CSS module. Use the shared fold-state helper to prevent overlapping turns, settle interrupted transitions, and support reduced motion.
- Both faces retain their layout when inert. The reading region can be measured by the sender preview without opening the card. The note scrolls independently, including the signature, while the full-face return button is separate from the text. An ordinary tap inside the note also returns to the front; selection, dragging and scrolling are excluded.
- Use Next.js font loading for Pinyon Script, with the existing serif font roles and local fallbacks. Review actual typography with the first destination's art before publication.

## Verification

Use `npm run check` and `npm run build`. Component tests cover destination-independent artwork, controls, the closed reading surface, HTML escaping, multiline Unicode and max-length content. The existing fold-state tests exercise stable and transitional states, repeated input and reduced motion.

The neutral SVG fixtures are test geometry, **not** a design offered to senders. Open the following routes in local development or a Vercel preview (production returns not found). The route is not in the gallery and accepts only predefined sample notes, not arbitrary personalized text.

| Route | Scenario |
| --- | --- |
| `/preview/city-postcard` | Short note and standard interaction |
| `/preview/city-postcard?note=long` | 600 code points, 40-character names, wrapping and internal scroll |
| `/preview/city-postcard?note=unicode` | Multilingual text, line breaks and font fallback |

Manual acceptance before merging:

1. Inspect both faces at 320 × 690, 390 × 844, tablet and desktop. The entire card should remain visible on normal viewports; zoom and short viewports permit page scrolling without clipping.
2. Tap, click, press Enter and Space. Confirm a single flip, readable final face and turn-back from the illustration, blank paper and an ordinary tap on the note. Repeat rapidly and verify focus restoration; hidden controls must not be keyboard targets.
3. Use the long note route. Scroll to the signature, select text, and confirm neither action flips the card. The note region must not spill into the artwork. Use the Unicode route to check glyph fallback.
4. Emulate reduced motion and verify an immediate, complete reveal. Inspect both browser console and actual focus.
5. Confirm the three existing cards and existing private-link behavior are unchanged. No new destination should appear in the catalog. Check that the fixture route is unavailable in production.

## Follow-up destination integration

The first actual destination PR will supply reviewed source provenance, paired text-free artwork, metadata, catalog and renderer registration, sample note, content policy, and the necessary forward database migration/allowlist parity. Exercise the full sender-preview-to-private-recipient flow in that PR. A second destination should reuse this renderer without new interaction code.
