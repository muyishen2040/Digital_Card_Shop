# Development instructions for coding agents

Read `docs/PRODUCT_BRIEF.md`, `docs/ARCHITECTURE.md`, and `docs/ROADMAP.md` before substantial changes.

## Use obra/superpowers

This project deliberately uses https://github.com/obra/superpowers as its development methodology.

- When Superpowers is installed in your coding harness, consult and follow its relevant skills. Do not imitate or claim a plugin skill is loaded when it is not.
- For a new user-facing feature, first use `brainstorming`. Present a design and get user approval before writing implementation code.
- Use `using-git-worktrees` for isolated branches, `writing-plans` for an approved implementation plan, `test-driven-development` to build in small verified steps, `requesting-code-review`, and `finishing-a-development-branch`.
- Save approved designs and implementation plans under `docs/plans/`.
- If Superpowers is unavailable in the current agent environment, say so and preserve the same design → plan → test → review intent rather than pretending that skills executed.
- Simple fixes and repository chores should stay appropriately small.

## Project boundaries

Phase 1 is **visual prototyping only**. Do not silently introduce accounts, persistence, paid checkout, database credentials, email delivery, WooCommerce, Klaviyo, or hard-coded inventory limits.

Concepts that should remain separate:
1. **Card template:** Reusable interactive UI and customizable fields.
2. **Card instance (later):** Personalized content, secret link, and expiration.
3. **Order (later):** Storefront transaction and fulfillment.

Card designs should be independently editable. Avoid shared global selectors that cause designs to override each other; prefer locally scoped CSS/modules and well-defined props.

## Coding conventions

- TypeScript strict mode. Minimize dependencies and abstractions until needed.
- Keep routes in `src/app`, UI in `src/components`, catalog metadata and pure functions in `src/lib`.
- Write a failing behavior test before implementing new logic when practical. Do not make tests assert only that a component exists.
- Before claiming completion: run `npm run check` and `npm run build`, and report any commands that could not be run.
- Favor mobile-first, accessible designs; respect reduced-motion preferences.
- Do not log personal messages, names, recipient addresses, or photos.
- Public-facing docs, commit messages, PRs, and issues should contain only context useful to their actual readers—no private agent-conversation details or hidden reasoning.
- Never commit secrets or real users' data.

## Card design quality (required for visual features)

Before designing or reviewing any interactive e-card, read [docs/CARD_DESIGN_QUALITY.md](docs/CARD_DESIGN_QUALITY.md), our concise card-specific adaptation of [unslop](https://github.com/heydamir/unslop). Distinguish the quiet editor/storefront UI from the expressive recipient-facing card.

For each design: define feeling, character, world, reveal moment, and signature detail; get direction approved through Superpowers brainstorming; then validate the rendered experience before claiming visual quality. Check mobile, long personalized messages, keyboard access, and reduced motion. Do not treat the guide as an absolute ban on expressive card artwork.

## Design direction

Explore three distinct experiences, not merely color variants:
- A Little Sunshine: opening an envelope / blooming elements
- Under the Same Sky: interactive star reveal
- Make a Wish: birthday cake and candle

These are *concepts*, not approved implementation specs. Agree on interaction, layout, accessibility, and customization behavior before building them.
