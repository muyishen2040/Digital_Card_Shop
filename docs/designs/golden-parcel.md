# Golden Parcel — birthday recipient experience

## Direction

- **Feeling:** A personal surprise
- **Character:** Tactile, intimate, celebratory
- **World:** Wrapped paper, soft satin and a card tucked inside a gift
- **Reveal moment:** Unfastening the ribbon moves the wrapping and reveals the message
- **Signature detail:** The ribbon is also the natural way to wrap the parcel back
- **Typography:** Instrument Serif and DM Sans, with readable system fallbacks

## Recipient journey

The recipient sees the single illustrated object immediately, without storefront controls or instructional copy. The object is a native, keyboard-operable button. Activating it triggers one finite reveal of a personalized recipient name, sender note and signature, all rendered as selectable HTML. The same object serves as the reversible close/replay control. Closing restores focus to the object; opening focuses the note. Motion respects reduced-motion preferences.

Sender preview, public demo at `/cards/golden-parcel`, and expiring private recipients all share the exact card component, with no separate reading-mode button.

## Acceptance

- Recognizable and usable on 320px, 390px, tablet and desktop screens.
- No decorative artwork covers the note; long 600-character messages and 40-character names remain scrollable and selectable.
- Text size preferences are respected without reducing legibility or breaking layout.
- No sender-provided HTML, links or images are interpreted as markup; messages are escaped.
- No continuous animation, instructional chrome, checkout, or external script.
- Each design retains its distinct physical object and interaction, unlike the other birthday cards.

The source artwork is in `src/components/cards/birthday/artwork/golden-parcel.ts`, driven by the shared `BirthdayArtCard` adapter. The `birthdayArtSlugs` catalog and the database template allowlist must both include this slug before private creation can succeed.
