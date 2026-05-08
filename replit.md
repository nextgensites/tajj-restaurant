# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Live Site Verification — Tajj Restaurant (2026-05-08)

**Live URL:** https://nextgensites.github.io/tajj-restaurant/

### Reservation error fix
- `artifacts/taj-restaurant/src/components/ReserveTable.tsx` line 222: `const isGitHubPages = import.meta.env.VITE_GITHUB_PAGES === "true";`
- When true, the `createBooking` API call is skipped entirely (lines 232–252), so the form submission proceeds to the confirmation step without hitting the backend — no more error on GitHub Pages.

### WhatsApp confirmation redirect
- On form submit, `window.open(buildWhatsAppUrl(bookingSummary), "_blank")` fires automatically (line 280).
- Confirmation screen ("done" step) shows a green "Send via WhatsApp" button (lines 669–678) linking to `https://wa.me/918880918007` with pre-filled booking details.

### Screenshot
Homepage screenshot captured at `attached_assets/screenshots/nextgensites_github_io_tajj-restaurant.png`. Site loads correctly with "RESERVE TABLE" and "FOOD BOOKING" CTAs visible in the header and as floating action buttons.

### GitHub Actions deploy
Deploy workflow configured at `.github/workflows/deploy.yml` in the `nextgensites/tajj-restaurant` repo. The live build uses `artifacts/taj-restaurant/vite.github.config.ts` as the Vite config, which hard-codes `import.meta.env.VITE_GITHUB_PAGES = "true"` via the `define` block (line 12) — it is not a runtime env var but a compile-time replacement baked into the bundle at build time.

Latest successful deploy run confirmed via GitHub Actions API:
- **Run #40** — "Deploy Taj Restaurant to GitHub Pages" — status: `completed` / conclusion: `success`
- Completed: 2026-05-08T00:51:30Z
- URL: https://github.com/nextgensites/tajj-restaurant/actions/runs/25530324124
