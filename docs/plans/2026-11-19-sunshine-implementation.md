# A Little Sunshine — implementation plan

**Date:** 2026-11-19  
**Scope:** Visual prototype only; no persistence or backend. Follow `AGENTS.md` and `docs/CARD_DESIGN_QUALITY.md`.

## 1. Pure personalization contract

Files: `src/lib/cards/personalization.ts`, `src/lib/cards/personalization.test.ts`.

- Define demo personalization, max name/message lengths, and `toPreviewContent`.
- Normalize whitespace in names, trim messages while retaining line breaks, and use readable fallback strings for empty fields.
- **Verification:** Unit tests first, then `npm run test`.

## 2. Recipient-facing interactive card

Files: `src/components/cards/sunshine/SunshineCard.tsx`, `src/components/cards/sunshine/SunshineCard.module.css`.

- Build an accessible button-driven closed/open state. Render the note only when opened.
- Create paper/envelope geometry, a botanical SVG sprig, one intentional transition into the reveal.
- Provide replay. Respect reduced motion and narrow screens.
- **Verification:** Run typecheck and build; inspect closed, opened and replayed states visually.

## 3. Mock sender studio

Files: `src/components/editor/SunshineStudio.tsx`, `src/components/editor/SunshineStudio.module.css`, `src/app/create/little-sunshine/page.tsx`.

- Live controlled inputs with max lengths and sample reset.
- Reuse `SunshineCard` for preview; label as *local preview, not sent*.
- **Verification:** Change each field, open/replay, test empty and 600-character messages on mobile.

## 4. Wire public routes

Files: `src/app/cards/[slug]/page.tsx`, `src/app/page.tsx`.

- For `little-sunshine` show interactive recipient demo; maintain placeholders for other concepts.
- Add a path from the gallery to the mock studio.
- **Verification:** URLs load for all 3 concepts.

## 5. Review and ship through PR

- `npm run check` and `npm run build`.
- CI checks and Vercel preview deployment.
- Review mobile contrast, keyboard/reduced motion, and visual restraint against `docs/CARD_DESIGN_QUALITY.md`.
- **Do not merge automatically.** Request user feedback on preview.
