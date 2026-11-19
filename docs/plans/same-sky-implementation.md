# Under the Same Sky — implementation plan

## Scope

Implement an independent recipient-facing constellation card and expose it through the existing launcher. Use the shared typed `CardPersonalization` contract. This work does not create persistent card instances, delivery, email, a mock sender editor, or checkout.

## Modules

1. `src/lib/cards/constellation.ts`: pure selection helper that adds valid star indices in input order, rejects duplicates/out-of-range indices, and reports completion. Write unit tests for order, immutability, repeated actions and four-star completion.
2. `src/lib/cards/sky-demo.ts`: fixed, public personalization for the prototype.
3. `src/components/cards/sky/SkyCard.tsx`: client-side star selection and optional moon reset; keyboard-focus management, progress announcements, and accessible labels.
4. `src/components/cards/sky/SkyCard.module.css`: full-bleed midnight blue artwork, a deliberately sparse constellation, a moon, restrained typography and a message that fades into view. Isolate styles from other cards and disable nonessential motion for reduced-motion users.
5. `src/app/cards/[slug]/page.tsx`: select the sky component for the matching slug while preserving other card routes.
6. `src/app/page.tsx`: mark the new card as interactive in the launcher.
7. `src/app/layout.tsx`: register sky-specific font variables without altering Sunshine typography.

## Verification

- Run `npm run check` and `npm run build` using the GitHub CI workflow.
- Verify launcher and sky route on the Vercel PR preview.
- In a real browser, test selection in multiple orders, duplicate taps, all four stars, the moon reset, a long letter, keyboard-only controls, a 320px phone and reduced-motion preferences.
- Do not mistake deployment readiness for visual animation review; request feedback before merging.

## Architecture

This card is a reusable scene. An authenticated creation API and private expiring link system can later supply its personalization props without any changes to the recipient interactions.
