# Sender editor and controlled creation pilot

**Status: Historical pilot design (implemented and superseded for public creation).** The current sender editor supports all registered cards, public Turnstile-verified creation and optional legacy creator-code testing. See [Architecture](../ARCHITECTURE.md) and [Public creation design](public-card-creation-design.md). The original pilot's three-card assumptions and authorization plan below are retained for history.

## Product flow
At `/create`, senders choose one of the three existing designs, enter recipient/sender names and a personal message, choose a 24/48/72-hour lifetime, and interact with the real card in a preview. The preview runs in a same-origin iframe at 320, 390 or 768 px; the content is sent by postMessage, not via the URL. The recipient's card and existing animations remain unchanged.

The maximum message length is 600 Unicode code points, and each name is limited to 40; suggestions of roughly 240/140/100 characters are editorial only. After the real fonts and layout settle, the iframe checks the actual scrolling area. Overflow is a warning, not a prohibition; the sender must deliberately acknowledge a scrolling note.

## Security boundary
`POST /api/cards` is intentionally **not available to anonymous users**. This early pilot requires an independent high-entropy `CARD_CREATOR_ACCESS_CODE` Vercel server-only environment variable (at least 24 characters). The form sends it via the Authorization header over HTTPS; it is not stored in localStorage, URL, database, logs, source, or browser cookies. The server checks exact origin, the creator code, JSON body bounds and `validateCardDraft` before invoking the existing privileged Supabase repository. Without configured authorization, the endpoint returns 503 and makes no database writes.

The code must be independent of `SUPABASE_SECRET_KEY`. **Do not use a placeholder or short human-readable password**. Generate a fresh cryptographically random 32-byte credential, store it as sensitive in Vercel Preview/Production, and supply it to the authorized pilot sender through a secure channel. A committed or public creator code compromises card creation.

This is a temporary internal access boundary, **not a public store solution**. Before launch, replace it with verified purchaser/account authorization, a shared rate limiter, per-creator quotas, anti-abuse controls, retention/cleanup, and operational monitoring. The recipient URL remains a bearer secret for read access only.

## QA
- Check CI: lint, TypeScript, unit tests and build.
- Visit `/create`, try all three templates; preview the entire reveal and read state.
- Check mobile and desktop, Chinese paragraphs, emojis, names near 40 characters, and deliberate overflow.
- Confirm missing or wrong creator code cannot write, and the service-role key remains backend-only.
- After adding the real creator code and redeploying, create a temporary card, open its private URL in a fresh session and verify expiration/revocation. Remove all test cards.
- The sending/email, commerce and user-account paths are out of scope.

## Compact-layout preview and two-leaf card behavior

The preview container **must never crop the left side** when a selected 320/390/768px viewport is wider than its available panel. A `ResizeObserver` measures the panel and uses a CSS transform to fit the entire iframe on screen. An explicit wrapper reserves the scaled size. The iframe's intrinsic CSS viewport remains exactly the selected 320/390/768 pixels, so media queries, font metrics and message overflow checks remain faithful to the actual device size.

Under the Same Sky previously folded the left leaf off the viewport on narrow phones, showing only the right half. On <=700px screens, the opened card now presents both leaves within the screen. Since a two-page spread makes the message region narrower, recipients can use **Read note** to expand the right page at full phone width, then **Full card** to return to the whole spread. This behavior applies to actual recipient cards as well as previews. Verify tap, keyboard, reduced-motion transitions and message scrolling at 320px and 390px.
