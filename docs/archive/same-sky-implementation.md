# Under the Same Sky — implementation plan

## Scope

Build a standalone **fold-open celestial greeting card** on `/cards/same-sky`. Its recipient-facing interface uses existing `CardPersonalization` props and public sample data; persistence, checkout and delivery remain out of scope.

## Modules

1. `src/lib/cards/fold.ts`: pure transition state helpers. Tests verify blocked double activation, reversible paper turns, transition completion, and reduced motion.
2. `src/lib/cards/sky-demo.ts`: fixed demo personalization.
3. `src/components/cards/sky/SkyCard.tsx`: client component with a cover button, a separate corner close button, a readable message pane, and focus handling.
4. `src/components/cards/sky/SkyCard.module.css`: a full-bleed night environment and 3D cover flip around the physical spine, with a responsive mobile mode that retains a full-width message rather than compressing two columns.
5. `src/components/cards/sky/SkyCard.test.tsx`: verifies native button names, readable sender content, and the absence of the old constellation-selection controls.
6. `src/app/cards/[slug]/page.tsx` and launcher continue to render the card at the existing `same-sky` slug. The birthday and sunshine implementations remain independent.

Delete obsolete constellation-selection logic and tests.

## Verification

- GitHub Actions runs `npm run check` and `npm run build`.
- Confirm `/` and `/cards/same-sky` on the Vercel preview.
- Review closed → hover/focus → click/tap/keyboard open → full message → fold back via cover and corner → closed again.
- Test 320px phone, 1440px desktop, long names and 600-character messages, keyboard focus and reduced-motion preferences.
- A ready preview and passing tests do not substitute for judging the actual 3D page-turn animation in a browser.
