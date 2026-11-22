# Development instructions for coding agents

Read `docs/PRODUCT_BRIEF.md`, `docs/ARCHITECTURE.md`, and `docs/ROADMAP.md` before substantial changes. Treat `README.md`, `docs/ARCHITECTURE.md`, `docs/CITY_POSTCARDS.md` and `db/README.md` as current references; `docs/plans/` includes historical implementation documents that may intentionally retain superseded assumptions.

## Use obra/superpowers

This project deliberately uses https://github.com/obra/superpowers as its development methodology.

- When Superpowers is installed in your coding harness, consult and follow its relevant skills. Do not imitate or claim a plugin skill is loaded when it is not.
- For a new user-facing feature, first use `brainstorming`. Present a design and get user approval before writing implementation code.
- Use `using-git-worktrees` for isolated branches, `writing-plans` for an approved implementation plan, `test-driven-development` to build in small verified steps, `requesting-code-review`, and `finishing-a-development-branch`.
- Save approved designs and implementation plans under `docs/plans/`.
- If Superpowers is unavailable in the current agent environment, say so and preserve the same design → plan → test → review intent rather than pretending that skills executed.
- Simple fixes and repository chores should stay appropriately small.

## Project boundaries

The app has a live, free sender → private link → recipient flow with abuse controls. The next product focus is **collection expansion, starting with City Postcards**. Keep the homepage a lightweight collection gallery, not a storefront. Preserve existing storage, security and expiration behavior. Do not introduce accounts, paid checkout, new credential requirements, email delivery, WooCommerce, Klaviyo or hard-coded inventory limits without an approved design.

Concepts that should remain separate:
1. **Card template:** Reusable interactive UI and customizable fields.
2. **Card instance:** Personalized content, secret link, and expiration.
3. **Order (later):** Storefront transaction and fulfillment.

Card designs should be independently editable. Avoid shared global selectors that cause designs to override each other; prefer locally scoped CSS/modules and well-defined props.

## Coding conventions

- TypeScript strict mode. Minimize dependencies and abstractions until needed.
- Keep routes in `src/app`, UI in `src/components`, catalog metadata and pure functions in `src/lib`.
- Write a failing behavior test before implementing new logic when practical. Do not make tests assert only that a component exists.
- Before claiming completion: run `npm run check` and `npm run build`, and report any commands that could not be run.
- Favor mobile-first, accessible designs; respect reduced-motion preferences.
- Do not log personal messages, names, recipient addresses, or photos.
- Follow [docs/COMMUNICATION_STANDARDS.md](docs/COMMUNICATION_STANDARDS.md) for all docs, comments, PRs, issue updates and commit messages. They must stand alone for a reviewer who has not read the agent conversation.
- Never commit secrets or real users' data.

## Audience-aware communication (required)

Before publishing a document, code comment, ticket, or PR, identify the audience and the decision or behavior they need to understand. Provide necessary product/technical context **inside the artifact** or via stable repository links; do not refer to chats, assistant instructions, hidden deliberation, or unnamed prior discussions.

- Describe the **current design and rationale**, not the sequence of conversational revisions. Explain trade-offs only when they matter to maintainers.
- Avoid statements such as "as discussed," "per your feedback," "we changed this," "the latest version," or "previously requested" unless the artifact itself identifies and explains a relevant historical event.
- PR descriptions should say what/why, important behavior, verification with evidence, and scope limits. Comments explain non-obvious engineering intent; do not narrate edits.
- Dates should be used for meaningful time-sensitive milestones, migrations, or historical records—not automatically in titles or living design documents.
- Self-review as if a new engineer will read this in six months without chat access.

## Card design quality (required for visual features)

Before designing or reviewing any interactive e-card, read [docs/CARD_DESIGN_QUALITY.md](docs/CARD_DESIGN_QUALITY.md), our concise card-specific adaptation of [unslop](https://github.com/heydamir/unslop). Distinguish the quiet launcher UI from the expressive recipient-facing card. Remove banners, guidance, status badges, and detached action buttons from recipient routes; the art object itself should be the accessible control. Keep replay discreet.

For each design: define feeling, character, world, reveal moment, and signature detail; get direction approved through Superpowers brainstorming; then validate the rendered experience before claiming visual quality. Check mobile, long personalized messages, keyboard access, and reduced motion. Do not treat the guide as an absolute ban on expressive card artwork.

## Design direction

Organize new designs by the collections in [the product brief](docs/PRODUCT_BRIEF.md). Preserve A Little Sunshine (envelope), Under the Same Sky (fold-open card), and Make a Wish (candle). City Postcards intentionally share a consistent flip mechanic and art direction; non-postcard concepts should have a distinctive interaction beyond color changes. Agree on interaction, layout, accessibility and customization behavior before building each new family.
