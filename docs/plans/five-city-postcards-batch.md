# Five-city postcard expansion

## Purpose and product behavior

Publish Kyoto, Seoul, Paris, San Francisco and Singapore in the existing City Postcards collection. Each destination uses the shared flip renderer, a destination-specific sample note and two 3:4 portrait WebP images. The front includes fixed destination lettering; the reverse contains no baked-in personal message. Personal text remains HTML in the existing recipient experience.

This batch is source-controlled metadata, not a dynamic content management system or an image-generation service. It introduces no changes to the sender creation workflow, existing slugs, recipient access, quotas, security or expiry behavior.

## Architecture and files

- `src/lib/cards/postcards/batch-01.ts`: one typed set of five destination descriptions. Builds collection entries, trusted artwork URLs, image descriptions and demo content.
- `src/lib/cards/catalog.ts`: registers the batch alongside the existing five designs. The homepage and sender editor discover these entries through their existing collection filters.
- `src/lib/cards/content-policy.ts`: derives editorial per-design recommendations from the registered catalog. Every design retains the common 40-character name and 600-character message limits, with a postcard suggestion of about 180 characters.
- `src/lib/cards/postcards/batch-01.artwork.test.ts`: requires the exact ten files from the separately distributed image ZIP. The test intentionally fails if any asset is missing or differs.
- `supabase/migrations/20261122192815_allow_five_city_postcards.sql`: forward-only extension of the approved ten-slug database allowlist. Apply and verify it before publishing the app build.

## Asset upload

Use `city-postcards-batch-01.zip` with the existing branch `feat/five-city-postcards`. Extract into the repository root; the archive already contains `public/cards/city-postcards/<destination>/front.webp` and `back.webp`. Stage and commit **only** those ten files. Do not overwrite Hong Kong or Taipei or change application code. SHA-256 checksums are bundled in `SHA256SUMS.txt` and embedded in the artwork tests.

The 10 images were generated as stylized city scenes. They should **not** be described as real documentary photographs or verified reproductions. Before public distribution, review landmark credibility and any relevant third-party architectural, branding or image-reference rights. No outside licensed source photographs are bundled with this batch; do not invent source attribution.

## Verification and publication gates

1. Upload and commit all ten WebP files on the same branch. Check file dimensions (1086 × 1448), file headers and checksums.
2. Run `npm run check` and `npm run build` on the final commit; only consider CI green for that commit.
3. Review the homepage, collection filters and `/create` with all ten designs; verify public demo routes `/cards/city-postcard-<destination>`.
4. Test front → flip → reading → return at 320px, 390px, tablet and desktop, with long, multilingual and 600-character notes, text selection and reduced motion.
5. Apply the reviewed migration once, checking the final allowlist, RLS, service role permissions, and no new public grants. This PR does **not** apply a production database change.
6. After deployment, verify a private created link and anonymous recipient viewing. Maintain the existing expiration and abuse controls.

The draft PR is intentionally not ready to merge without artwork, visual review and the database deployment gate.
