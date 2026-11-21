# Collection browsing

## Purpose

Help senders find a design without turning the gallery into a storefront. The primary collections are City Postcards, Birthday Cards and General Cards, in that order. Every template belongs to one collection; occasion tags and optional destination information are independent metadata. All existing template slugs remain stable.

## Experience

The homepage opens with All cards selected and displays non-empty collection sections with the existing design thumbnails. Selecting a collection narrows the gallery to that section. Filters use native buttons with pressed states and visible focus, and wrap on small screens. The sender's card picker uses the same filters and ordering. Filtering only changes which choices are shown; an explicitly selected design remains selected until the sender chooses another one. The editor always displays the selected design and preserves the draft, preview and private link on filter changes. Changing the actual design invokes the existing draft invalidation and fit-measurement flow.

No empty placeholders, extra recipient controls, commerce, database migrations, or changes to security and expiration.

## Implementation and verification

- Define typed collection membership and separate occasion tags in `src/types/card.ts`; centralize order, labels, grouping and filtering in `src/lib/cards/catalog.ts`.
- Reuse the filter UI on the gallery and sender editor. Keep existing artwork, public demo URLs and creation APIs unchanged.
- Test unique membership, intended order, empty-collection omission and occasion/destination separation; check all existing content policies and renderer tests.
- Review All cards and each individual filter at 320px, 390px and desktop widths. Check keyboard focus, preserved draft/selection/preview/link while filtering, and remeasurement when changing cards. Run lint, typecheck, tests and production build before merge.
