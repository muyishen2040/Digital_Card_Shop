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

This folder intentionally contains no feature code until the design is approved with the Superpowers brainstorming workflow.
