# Hong Kong — artwork assets

Destination-specific assets for the shared City Postcard renderer. The front is an approved completed editorial artwork with fixed destination lettering. The reverse is a matching generated stationery illustration without personalized text. The shared renderer suppresses its front title overlay when the supplied front already contains fixed lettering; the reverse message remains real DOM text.

## Required asset files

Both images must be 1086 × 1448 pixels (3:4 portrait), optimized WebP:

| File | Role | SHA-256 of prepared asset |
| --- | --- | --- |
| `front.webp` | Victoria Harbour at night; fixed lettering and painted skyline | `6110863e7d6fb22d8c478841725a438c94c39c04529697a2359aef2e6d8f28c1` |
| `back.webp` | Blank warm-paper reverse with bauhinia and a painted ferry/pier scene | `9ac0b9113e473fc45e647b88fca64bb844692fbbc3b99070e1b5bcd24b04f2aa` |

The committed files match the prepared asset checksums. Keep full-resolution sources outside the runtime bundle. The front includes a decorative historical-style date/postmark; it is fixed artwork, not a delivery date. Confirm rights to reproduce and adapt the underlying reference photograph and artwork before committing assets to a public repository. The source-photo creator, license or permission has not yet been documented; do not infer permission from availability.

## Review

Use the preview-only route `/preview/city-postcard/hong-kong` (including `?note=long` and `?note=unicode`) after the two files are present. Check no duplicate front titles, no baked text on the reverse, message/illustration separation, full-face turn-back, 320px/390px layouts and scrollability.

The catalog, renderer, sender editor and server content policy use the stable slug `city-postcard-hong-kong`. Before merging, apply and verify the forward database allowlist migration so the release does not expose a template that storage rejects. The preview-only QA route is distinct from the catalog demo `/cards/city-postcard-hong-kong`.
