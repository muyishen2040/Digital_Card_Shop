# Private recipient links — design and implementation

## Goal

A card is a recipient-only experience, not an order page. Each recipient's private link must load the selected interactive template with the stored message, without revealing it to strangers, search engines, or people who only know the demo URL. The link must expire on the server.

The private route is `/c/[token]`. All three recipient templates remain independent and unmodified. This feature does **not** provide a public sender form, creation endpoint, scheduling, delivery, or checkout.

## Request path

1. A request to `/c/[token]` is handled by a force-dynamic Next.js App Router page.
2. Invalid token shape or an unconfigured server immediately yields the same unavailable page used for missing and expired links. No database lookup for malformed tokens.
3. For a valid token, the server hashes it, queries the **private** Supabase table for that hash, and checks `available_at <= now < expires_at`. The raw bearer token is never stored.
4. Missing, expired, unavailable, revoked and unknown-template cards all render a generic 404 page with no recipient name or message. Database outages are operational errors rather than an invalid-link diagnosis.
5. For an active instance, render the existing card component with the stored names and message. No demo content, shop controls, or recipient-editing UI is added.

## Privacy and caching

- Use `dynamic = "force-dynamic"`, `revalidate = 0` and an uncached Supabase `fetch`. Do not use Next.js static generation for token routes.
- Set `Referrer-Policy: no-referrer`, `Cache-Control: private, no-store, max-age=0, must-revalidate`, `X-Robots-Tag: noindex, nofollow, noarchive`, and `X-Content-Type-Options: nosniff` specifically for `/c/:token`. Route metadata also requests noindex.
- Avoid third-party tracking or external images in private card routes. Browser navigation can expose the token to browser history and server access logs; treat the URL itself as sensitive.
- No user-submitted text or raw token should be written to application logs, metrics, URL query strings, or static snapshots. Use aggregate operational counters if necessary.
- Do not let browsers or intermediaries cache cards beyond expiration. Open tabs cannot be recalled after delivery, but every new server request must recheck expiration.
- The card's reading area remains scrollable at larger zoom levels; personalized text is never ellipsized.

## Content length policy

**Store up to 600 Unicode code points for any template, with names up to 40 code points each**. The per-template recommendations (240 Sunshine, 140 Sky, 100 Wish) are editorial guidance only. They are not DB constraints and do not silently truncate longer messages.

The future sender preview should report when the actual rendered message overflows the intended reading area and recommend editing. A sender may choose a longer scrollable message; overflow is not automatically a hard rejection.

## Verification

- Unit test that all three existing components render with supplied private message content and reject an unknown template slug.
- Verify content validation, 600-character bounds, Unicode, 24/48/72-hour access windows and exclusive expiration.
- CI: `npm run check` and `npm run build`.
- Vercel preview: a malformed token displays an unavailable page without exposing private text; existing demo routes are unchanged.
- Live integration **requires an isolated Digital Card Shop Supabase project** with reviewed SQL, grants, RLS and a server-only secret key. Run security advisors and live valid/expired-token tests before considering the feature production-ready.

## Security/operational boundaries

Only internal trusted code can create card instances. There is no public creation endpoint, no anonymous writes, and no public service key. Abuse prevention for recipient-link brute-force traffic, signed webhook creation, deletion/retention automation, observability and delivery are next-stage work. High-entropy tokens prevent enumeration but do not replace rate limiting when production traffic begins.

The dedicated Digital Card Shop Supabase project `zrgnwwrfrchhgmznbblb` has the private schema installed via migration `20261120050919_create_private_card_instances`. Its security checks passed and the expected informational no-public-RLS-policy notice remains. Configure the server-only secret key and perform end-to-end recipient-link tests before public launch. Until backend configuration is in place, the private route fails closed with the same generic unavailable screen.
