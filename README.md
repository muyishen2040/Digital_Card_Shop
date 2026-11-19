# Digital Card Shop

A mobile-first, interactive digital greeting-card experiment.

**Status:** Recipient-experience prototype. The homepage launches a working interactive A Little Sunshine demo and two unimplemented card concepts. Checkout, delivery, and persistence are not implemented.

## Product idea

Send someone a tiny, personalized experience—not just an image. Eventually, buyers will choose a card template, personalize it with a message and optional photo, select a delivery time, and send a private link to a temporary (1–3 day) interactive page.

**Current goal:** Prioritize the **recipient's experience**. A card route is its own immersive scene. Use a minimal card launcher to switch between concepts, not a mock shop or sender-customization interface.

## Technology

- Next.js App Router + React + TypeScript
- Plain CSS for the foundation; each future card can own its CSS and animation logic
- Vercel for deployment (Hobby for eligible personal, noncommercial prototyping)
- Vitest, TypeScript, and ESLint for local feedback
- Later, only if needed: Supabase, Resend, WooCommerce, and Klaviyo

## Quick start

Requirements: Node.js 22 or newer and npm.

1. Clone: `git clone https://github.com/muyishen2040/Digital_Card_Shop.git`
2. Enter the project: `cd Digital_Card_Shop`
3. Install dependencies: `npm install`
4. Run the app: `npm run dev`
5. Open http://localhost:3000

Run `npm run check` to execute lint, type checking, and unit tests; `npm run build` to verify the production build.

**Dependency lockfile:** The repository does not yet contain `package-lock.json`. Run `npm install` with the project’s intended Node/npm versions and commit the generated lockfile before relying on reproducible production installs; switch CI to `npm ci` once the lockfile is present.

## Agent workflow: obra/superpowers

Use [Superpowers](https://github.com/obra/superpowers) in your coding agent. Install it **in each agent environment**, not by copying the framework into this repository:

- **Claude Code:** `/plugin install superpowers@claude-plugins-official`
- **Codex CLI:** `/plugins` → search for Superpowers → Install Plugin
- **Codex App:** Plugins → Coding → Superpowers
- **Cursor Agent:** `/add-plugin superpowers`

Then start with: "Read AGENTS.md and docs/PRODUCT_BRIEF.md. Use Superpowers brainstorming to develop an independently testable recipient-card experience before implementing it."

The workflow is: brainstorm → approve design → create isolated worktree → write implementation plan → test-driven implementation → review → PR.

See [AGENTS.md](AGENTS.md) for repository-specific guardrails and [docs/ROADMAP.md](docs/ROADMAP.md) for scope.

For visual work, also use the compact [e-card anti-slop design guide](docs/CARD_DESIGN_QUALITY.md) (adapted from heydamir/unslop). It keeps the app shell restrained while allowing expressive, purposeful card art and animations.

## Project structure

- `src/app/` — Minimal launcher and recipient card routes
- `src/lib/cards/` — Catalog metadata and pure helpers
- `src/types/` — Reusable card interfaces
- `src/components/cards/` — Independent interactive card implementations
- `docs/` — Product context, architecture, feature designs, plans, and [writing standards](docs/COMMUNICATION_STANDARDS.md)

## Vercel

This repo is linked to the separate [digital-card-shop Vercel project](https://vercel.com/muyishen4020-2251/digital-card-shop). Pushes to `main` deploy to production; PRs generate previews.

No database, external API credentials, checkout, or email provider is required for Phase 1.

## Privacy and safety

Do not put personal messages, addresses, or image uploads in public URL parameters, the Git repository, client-side logs, analytics events, or example data. Recipient email does not imply marketing consent. Public sending and file uploads will require spam controls and retention limits before launch.

## Recipient-first design rule

The scene itself is the interface on `/cards/[slug]`. The envelope, star, or candle should invite a tap or click directly, without visible instructions. Keep replay subtle but accessible. Do not show development labels, purchase actions, or marketing copy around a received card. See [CARD_DESIGN_QUALITY.md](docs/CARD_DESIGN_QUALITY.md).

## Project communication

Designs, implementation plans, PRs, issues, commit messages, and code comments must stand on their own for readers without access to development chats. See [docs/COMMUNICATION_STANDARDS.md](docs/COMMUNICATION_STANDARDS.md). Use descriptive filenames for living design specifications; reserve dates for records where chronology is meaningful.
