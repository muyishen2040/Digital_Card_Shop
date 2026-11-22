# Sender-controlled card text size

## Behavior

The sender can choose Small (60%), Medium (80%), or Large (100%) next to the existing viewport controls. Medium is the initial choice for new editor drafts. Large retains the original typography for previous private cards, sample demos, and older clients that omit the field. Scale only each design's salutation, message and signature; preserve the full artwork, interactive controls, card dimensions, existing responsive breakpoints, and 40/600-character limits. Small is optional and may be difficult to read on smaller phones.

## Implementation

- Store a validated `textSize` preference in the draft and private card instance; the database permits only the three named choices. Use a backward-compatible default of `large` so previous deployments and old cards retain the original size.
- Include the preference in the same-origin preview message and creation request; recalculate real text fit and clear stale scroll confirmations when it changes.
- Each card uses the same size-to-scale mapping and a scoped CSS custom property on the reading region. Apply it to existing responsive font rules, including mobile expanded reading; do not use a transform that would confuse scroll measurement.
- Keep public creation safeguards, private token access and expiry unchanged.

## Release verification

Apply the forward additive migration before deploying the application. Verify column/default/check and RLS/grants. Run lint, typecheck, tests and build. In the Vercel preview, select all sizes across all four card designs at 320px, 390px and desktop/tablet sizes; verify fit feedback, scroll behavior, same card state during size changes, keyboard operation and readable text. After deployment, create a card at each size and open the private link independently; verify old links retain Large. Do not log messages or bearer links.
