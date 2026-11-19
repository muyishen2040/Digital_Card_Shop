# Digital Card Shop

A mobile-first, interactive digital greeting-card experiment.

**Status:** Phase 1 scaffold. The gallery lists three creative directions, but interactive card designs, checkout, delivery, and persistence have **not** been implemented yet.

## Product idea

Send someone a tiny, personalized experience—not just an image. Eventually, buyers will choose a card template, personalize it with a message and optional photo, select a delivery time, and send a private link to a temporary (1–3 day) interactive page.

**Current goal:** Validate the design and recipient experience with a few working prototypes before building the shop.

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

**Dependency lockfile:** This initial GitHub-only scaffold does not yet include a generated `package-lock.json`. Generate it with `npm install` and commit it before relying on reproducible CI or production deployments.

## Agent workflow: obra/superpowers

Use [Superpowers](https://github.com/obra/superpowers) in your coding agent. Install it **in each agent environment**, not by copying the framework into this repository:

- **Claude Code:** `/plugin install superpowers@claude-plugins-official`
- **Codex CLI:** `/plugins` → search for Superpowers → Install Plugin
- **Codex App:** Plugins → Coding → Superpowers
- **Cursor Agent:** `/add-plugin superpowers`

Then start with: "Read AGENTS.md and docs/PRODUCT_BRIEF.md. Use Superpowers brainstorming to design the first interactive e-card before writing feature code."

The workflow is: brainstorm → approve design → create isolated worktree → write implementation plan → test-driven implementation → review → PR.

See [AGENTS.md](AGENTS.md) for repository-specific guardrails and [docs/ROADMAP.md](docs/ROADMAP.md) for scope.

## Project structure

- `src/app/` — Routes and gallery
- `src/lib/cards/` — Catalog metadata and pure helpers
- `src/types/` — Reusable card interfaces
- `src/components/cards/` — Independent interactive implementations (added next)
- `docs/` — Product context, architecture, plans, and decisions

## Vercel

Once the scaffold PR is merged, import this repository into a **new** Vercel project. Framework preset: Next.js. Root Directory: repository root. Pushes to `main` can deploy to production; PRs generate previews.

No database, external API credentials, checkout, or email provider is required for Phase 1.

## Privacy and safety

Do not put personal messages, addresses, or image uploads in public URL parameters, the Git repository, client-side logs, analytics events, or example data. Recipient email does not imply marketing consent. Public sending and file uploads will require spam controls and retention limits before launch.
