# Card components

Place each implemented e-card in its own folder, for example:

```text
src/components/cards/
  sunshine/
    SunshineCard.tsx
    SunshineCard.module.css
    SunshineCard.test.tsx
```

Each template takes typed customization data. It should own its animations and CSS. Do not add three identical wrappers with different colors: each concept requires a distinct approved interaction design.

City Postcards are a deliberate family exception: use the shared `postcard/CityPostcard.tsx` renderer, with destination metadata and two reviewed artwork assets rather than a new interaction per destination. See the [design specification](../../../docs/designs/city-postcards.md) and [destination publishing guide](../../../docs/CITY_POSTCARDS.md). The neutral fixture is available only in development/preview, and is not a catalog entry.


The five Signature birthday scenes reuse the small `birthday/BirthdayArtCard.tsx` interaction adapter while keeping each design's distinct, approved HTML/SVG artwork in `birthday/artwork/`. The reviewed SVG/HTML is trusted static code; sender text is HTML-escaped before rendering, and opening/closing is controlled by React without running scripts from the original prototypes. Sender preview and private recipients use the same component. Do not edit the five artwork strings as if they were user content.
