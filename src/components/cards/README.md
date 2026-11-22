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

City Postcards are a deliberate family exception: use the shared `postcard/CityPostcard.tsx` renderer, with destination metadata and two reviewed artwork assets rather than a new interaction per destination. See the [design specification](../../../docs/plans/city-postcard-design.md) and [destination publishing guide](../../../docs/CITY_POSTCARDS.md). The neutral fixture is available only in development/preview, and is not a catalog entry.
