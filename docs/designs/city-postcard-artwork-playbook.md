# City Postcards — two-photo artwork generation playbook

## Goal

Given two suitable photos from the same city, produce one coherent front/back artwork pair with repeatable 3:4 composition, consistent material and artistic quality. The art assets are generated during design work, not at runtime for every sender. The same renderer adds typography and personalization and handles the flip.

## 1. Prepare the inputs

Choose Photo A, an iconic hero scene with a clear composition, and Photo B, a complementary scene with a different view, landmark or object. Favor photographs with enough original resolution, clean subject silhouettes and rights for reproduction and derivative work. Do not assume every image found online may be reused.

Record a small asset brief before generating:

| Field | What to specify |
| --- | --- |
| City / country or region | [CITY] / [COUNTRY_OR_REGION] |
| Photo A | [HERO_SCENE]: an iconic city view, with the actual source image attached |
| Photo B | [SECOND_SCENE]: a distinct landmark, street scene, viewpoint or culturally relevant object, with its source image attached |
| Main recognizable features | Subject silhouettes, architectural proportions, key objects, spatial relationships and atmosphere from each source |
| Palette | [PALETTE]: up to four dominant colors drawn from the photos, including natural paper |
| Front title | Greetings from [CITY] |
| Front scene caption | [SHORT_ACCURATE_SCENE_CAPTION] (optional) |
| Reverse text safe zone | 10–90% horizontal; 12–68% vertical |
| Source provenance | Original file or permitted source URL, creator, license or permission, date accessed where relevant |

Complete this brief for each destination, in its provenance record or its publication PR. Document actual references and verify their rights; the template itself does not approve any image. Verify real landmarks and avoid combining unrelated landmarks into a misleading photograph.

Select a destination-specific signature motif, such as a locally recognizable botanical, architectural or cultural detail, only if it adds meaningful identity. If an approved pair already exists, include it as a **style reference** for later cities, not as a third content photo to mix into the new scene.

## 2. Generate front artwork

Use the following prompt with Photo A attached. Fill the bracketed variables. Ask for a single independent artwork, not a collage, mockup of a phone, or multiple faces in one image. If the provider supports exact aspect ratio, select 3:4. When a separate style reference is used, explicitly keep its depicted city out of the new artwork.

### Reusable front prompt

~~~text
Create ONE premium editorial travel-postcard front for [CITY], using the supplied PHOTO A ([HERO_SCENE]) as the primary photographic reference.

OUTPUT
Strict 3:4 portrait artwork, edge to edge. A complete card face, not a mockup,
not a collage, not a split image of front and back. High-resolution output.

COMPOSITION
Upper approximately 50%: authentic photographic hero scene. Preserve the
recognizable subject, architecture, proportions, perspective, spatial
relationships, atmosphere, natural lighting and photographic texture. Apply
only restrained editorial color grading. Extend only natural surrounding
sky, water or ground when needed; do not stretch or invent landmarks.
Transition organically from the photograph into warm natural paper.

Middle approximately 53–63%: clean, calm space for destination typography
that will be added later in HTML. Maintain sufficient contrast and whitespace.

Lower approximately 66–82%: extract the most recognizable elements of
PHOTO A and reinterpret them as a compact handmade illustration.
Keep the essential silhouette and details needed for immediate recognition.
Use slightly imperfect drawn edges, controlled flat acrylic/gouache-like
color shapes, visible brush texture, and delicate paper grain. A restrained
wash may softly connect the photo to the paper. Do not use a second large
photograph. The illustration should be substantially smaller than the hero
scene, surrounded by negative space. Leave a small calm lower area for an
optional fixed greeting.

MATERIAL AND STYLE
Natural warm ivory art-book paper, finely restrained perimeter rule, delicate
editorial composition, coherent [PALETTE] illustration palette (at most four
main colors, including paper). Authentic photography contrasted with a small
artistic handmade scene. Quiet, poetic, refined, tactile, nostalgic.
Optional small unlettered city-specific stamp motif only if it fits.
If using an approved style reference, reproduce the visual grammar, not its city.

NO TEXT
Do not render any words, typography, letter-like marks, title, date, postal
denomination, branding, sender name or message. All text is applied afterward.

AVOID
Generic commercial greeting cards, clutter, arbitrary decorations, fake
landmarks, low-quality vector sketches, oversimplified icons, crayon,
heavy oil paint, glossy 3D, smooth digital cartoon illustration, artificial
retouching, giant blank borders, and distracting effects.
~~~

If image generation cannot preserve the photograph sufficiently, compose with the actual licensed Photo A as the hero layer and generate only the integrated paper/illustration region using the same layout. Review the seam and preserve original photo geometry. Do not falsely describe a transformed scene as the original photograph.

## 3. Generate reverse artwork

Use the approved front as a material/style reference and Photo B as the distinct illustration content reference. The image generator must create the entire reverse as one continuous art-directed surface. Do not reuse a crop of the front's lower illustration. Generate text-free art, not a finished example letter.

### Reusable reverse prompt

~~~text
Create ONE matching premium editorial postcard BACK for [CITY].
The approved front is a style reference only. Use PHOTO B ([SECOND_SCENE])
as the illustration subject. Make the reverse recognizably different from the
front's imagery while retaining the same paper, palette and craftsmanship.

OUTPUT
Strict 3:4 portrait artwork, full canvas, high resolution. Same visual paper
stock as the front. One complete cohesive illustrated stationery surface.

COMPOSITION
Use subtle warm cream textured paper with a refined thin perimeter rule.
At the top, if appropriate, add a restrained translucent atmospheric wash
or a tiny [SIGNATURE_MOTIF] integrated into the material, leaving the top
of the writing area clear. Do not add a title or postal address box.

Reserve an uninterrupted, low-contrast writing area spanning about
10–90% of the width and 12–68% of the height. It is intended for a real
recipient salutation, message and signature overlaid later. Do not draw
writing lines, watermarks or decorative objects into this area.

Place the illustration derived from PHOTO B in the bottom quarter,
roughly 73–96% of the height. The artwork should be modest in scale,
with beautiful hand-painted detail, recognizable city-specific silhouettes,
organic fading at the edges, fine paper grain and a sense of place.
Integrate it naturally with the full paper background, not as a rectangular
cropped photograph or a pasted sticker. The art should not creep upward
into the writing-safe area.

STYLE
Quiet poetic handmade editorial stationery, with the same restrained
[PALETTE] as the front, slightly irregular linework, controlled color
shapes and soft brush textures. Refined, nostalgic, understated and
materially convincing. Preserve the defining features of PHOTO B.
Illustration, not an imitation of a second large photographic panel.

ABSOLUTELY NO TEXT
Do not include any titles, city labels, words, letters, numbers, message,
names, brand, placeholder handwriting, faux stamps or pseudo-typography.
Leave the writing area fully blank for accessible HTML text.

AVOID
Duplicating the front illustration, pasted or cropped art panels, heavy
ornament, generic vector city silhouettes, oversized artwork, shiny 3D,
commercial cartoon imagery, low-quality textures and fake calligraphy.
~~~

The reverse's smaller artwork and blank area are non-negotiable for text readability. If a candidate looks excellent but contains text, regenerate or edit the background to remove all text before using it in production. Do not overlay new text on top of baked-in placeholder text.

## 4. Assemble the postcard

Use the shared layout and flip interaction from the [design specification](city-postcards.md). Apply destination metadata and all personal lettering as real HTML, with the same approved typeface roles and sizes for every city. The recipient note is read-only; the sender editor supplies customization and the preview measures actual text fit.

The card should look like two sides of the same stationery object at identical dimensions. The front title is fixed destination metadata, not another mandatory field in the sender editor. Keep optional collection marks/short greetings quiet. Do not add visible headings to the reverse just to fill space.

### Asset review before integration

- View source A against the front photo; check subject fidelity, aspect ratio and no fake/garbled landmark signage or details.
- View source B against the reverse illustration; check visual identity and that it is not the front image repeated. Check visual continuity of paper, frame, palette and illustration style across both faces.
- Inspect 100% zoom for generation artifacts and text remnants. Reject unreadable or fake typography, watermarks, and poor-detail outputs.
- Overlay representative text in the real renderer. Test the writing area at 320px, 390px and desktop, with short and long messages, not merely an empty back image.
- Export two optimized 3:4 WebP assets, retaining a high-resolution source outside the runtime bundle where appropriate. Aim initially for roughly 1200×1600 px and no more than 400–700 KB per face when quality permits; check actual encoding and rendering before reducing quality. Budget targets are guidance, never an excuse for blurry artwork.
- Use meaningful asset names and keep a short provenance and generation note per destination (reference sources, licensing, palette, approved artwork filenames and safe-zone deviations if any). Only commit files with rights suitable for repository and product distribution; no private photographs, personalized messages, keys or tokens.

## 5. Repeat

A new city should require: two suitable source photos, a filled asset brief, two generated and reviewed art assets, catalog metadata and existing validation registration. If a new destination requires rewriting the component or bespoke animation, determine whether the visual spec or implementation has drifted before introducing a variant.

The same process applies to every city, whether one or several destinations are added in a PR. Review artwork fidelity, rights and real rendering separately for each destination. The number of cities in one delivery is an implementation detail, not a permanent part of the catalog.
