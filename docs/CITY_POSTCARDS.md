# City Postcards: adding and publishing a destination

City Postcards is a collection of independent destinations sharing one tactile flip interaction. Destinations are **content**, not releases or upload batches. Each city owns its artwork, description, sample note and source/provenance review. The app's sender editor, catalog, text sizing and recipient routes are shared.

For artistic direction, consult [the collection design](designs/city-postcards.md) and [artwork playbook](designs/city-postcard-artwork-playbook.md).

## Destination contract

Each destination has:

- A stable public slug `city-postcard-<city-slug>`, using lowercase kebab-case. Never rename an existing slug without a compatibility strategy; saved and shared card links may depend on it.
- `public/cards/city-postcards/<city-slug>/front.webp` and `back.webp` with matching 3:4 portrait dimensions and a consistent visual language. Keep the back's middle writing area empty.
- A manifest entry in `src/lib/cards/postcards/destinations.ts` containing its public slug, art descriptions, optional country/region, scene caption, sample message and approved image paths. All manifests become normal catalog entries automatically.
- Pinned SHA-256 hashes for both images in `src/lib/cards/postcards/artwork-integrity.test.ts` so accidental replacement or missing assets fails CI.
- An image provenance and rights record for the destination, preferably `public/cards/city-postcards/<city-slug>/README.md`. This record describes sources, artist/model and permissions where actually known; it does not substitute for rights clearance.

Hong Kong and Taipei retain their existing destination-specific TypeScript files for compatibility with their previews and tests; both are registered in the same catalog alongside every other city. Future cities can be added directly to the manifest without creating destination-specific React components.

The preview `/cards/<slug>`, the sender editor `/create` and private recipient route `/c/[token]` all reuse the existing `CityPostcard` renderer and validated content policies.

## Publishing a new city

1. **Prepare and review artwork.** Select two complementary scenes, verify any source-photo rights and choose the visual treatment. Make front and back feel like two sides of one object. Avoid generated pseudo-text and misleading claims that stylized scenes are documentary photos.
2. **Optimize and locate files.** Export both faces as high-quality 3:4 WebP files. Put them directly under the city's asset directory. Current image pairs use 1086 × 1448 pixels, but exact dimensions are not part of the runtime contract; preserve aspect ratio and readable resolution.
3. **Add its manifest entry.** Set meaningful alt text, city/country metadata, description and a human-sounding demo note. Personal recipient and sender text must never be baked into the artwork.
4. **Pin both file hashes.** Use `shasum -a 256 <file>` on macOS/Linux or `Get-FileHash <file> -Algorithm SHA256` in PowerShell. Add the hashes to the integrity test. A mismatched hash requires investigating whether the asset or expectation differs; never silently bless unexpected bytes.
5. **Extend the database allowlist.** The `card_instances_template_slug_check` constraint explicitly lists publishable slugs. Prepare an **additive forward migration** that retains all existing slugs and adds the new ones. Review and apply it to the intended Supabase project before deploying application code that creates those cards. Do not edit applied migrations or weaken RLS, grants, token hashing, quotas or expiration.
6. **Verify release behavior.** Run `npm run check` and `npm run build` on the final commit. Review all new destinations at 320px, 390px, tablet and desktop, including front → flip → read → return, 600-character and multilingual messages, scrolling, keyboard use, text selection and reduced motion. Verify that an anonymous recipient can open a genuinely created private link after deployment.

An artwork-only local agent can upload approved images by extracting a directory-structured ZIP, staging only its `front.webp` and `back.webp` files, and pushing to an existing PR branch. The ZIP name, branch name and upload instructions belong to that **PR's description or handoff**, not to permanent catalog files. One pull request may add any number of unrelated destinations.

## Boundaries

City Postcards is not a dynamic CMS or runtime image-generation service. Never accept untrusted sender-provided image URLs as catalog entries. Do not log personal messages or secret access tokens. Existing private links and all non-postcard card designs must remain compatible.

Keep destination-specific creative decisions in the destination's provenance record, reusable integration guidance here, one-time schema changes in `supabase/migrations/`, and change-specific history in pull requests.
