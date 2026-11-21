# Taipei postcard artwork

## Art direction

Taipei 101 at sunset on the front, with a complementary painted interpretation of Dadaocheng historic shopfronts on the reverse. Warm ivory paper, terracotta ink, sunset gold and muted mountain green connect the two faces. The front includes fixed destination lettering; the reverse remains text-free for the shared DOM salutation, note and signature.

## Sources and rights

- Front: generated artwork based on a supplied reference photograph of Taipei's skyline at sunset. Original photographer, source URL and reproduction/derivative-work permission are **not yet documented**. Confirm these before publication.
- Reverse: generated interpretation of Dadaocheng architecture; not a documentary photograph or verified reproduction of a particular source photograph. No reference-photo license is asserted.
- The generated designs require a visual review for recognizable details, clean text and a quiet writing-safe zone. Do not treat visual approval as source-photo rights clearance.

## Required approved assets

Both committed files are 1086 × 1448 px (3:4), WebP quality 92. Their Git blob hashes match the prepared asset package.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `front.webp` | 457522 | `fec7dda470f11a47112c9ec909664948123745b9a4836125bf4a99e08924291e` |
| `back.webp` | 347744 | `2706d1e830fb56e3b63c7e9e2aacc7d404421c51c8c47bdf97fb9a389ffb8778` |

The checksums are enforced in the artwork regression test. The catalog uses `city-postcard-taipei` with the shared renderer, collection filters, message-size choices and public creation policies.

## Publication gate

The forward [template allowlist migration](../../../../supabase/migrations/20261121235346_allow_taipei_postcard.sql) is applied and verified on the dedicated database. All five template slugs and all three text sizes are permitted; RLS and restricted grants remain intact. Do not merge before photo rights documentation, visual review and CI are complete. Use the preview-only route `/preview/city-postcard/taipei`, with `?note=long` and `?note=unicode` for stress tests. Also review the catalog demo, homepage and sender editor.
