# CLAUDE.md

Entry point for working in this repo. Read this first. Frontend-specific rules live in [`apps/frontend/CLAUDE.md`](./apps/frontend/CLAUDE.md); Sanity/Studio-specific rules live in [`apps/studio/CLAUDE.md`](./apps/studio/CLAUDE.md) — open whichever matches your task.

## Project

Emery Design Studio's marketing site — a small residential interior design studio (Kirkland, WA). Next.js frontend + Sanity Studio, owned and operated directly by the studio's owner; there's no separate dev/marketing team behind it.

**Standing mandate that governs most technical decisions here**: everything that could plausibly change — copy, images, contact info, nav, page headers, service listings, SEO fields — should be editable from Sanity Studio, never a hardcoded string that requires a code change. When adding a new page or field, default to making it Sanity-editable even if the first real value is the only one that will ever exist. The explicit, repeated goal across this project has been to reach "content-only" operation: once a feature ships, further changes to it should never require coming back to code.

**A second standing principle**: never show fabricated specific-sounding content as a fallback — invented names, invented facts, invented testimonials. When real content doesn't exist yet, show an honest "coming soon"-style empty state instead of something that looks real but isn't.

## Stack

| Tool         | Version                                                                  | Notes                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js      | 16.2.12                                                                  | App Router. Turbopack is the default bundler for both `dev` **and** `build` in this version — Turbopack-named chunks in a production build are normal, not a sign of dev artifacts leaking in. |
| React        | 19.2.x                                                                   |                                                                                                                                                                                                |
| Sanity       | `sanity` (Studio) `6.18.0`, `next-sanity` (frontend integration) `^13.x` | Standalone Studio at `apps/studio`, not embedded in Next. Project ID `qehxawm7`, dataset `edc-prod`.                                                                                           |
| TypeScript   | 6.0.x                                                                    |                                                                                                                                                                                                |
| Tailwind CSS | ^4.x                                                                     |                                                                                                                                                                                                |
| Turborepo    | ^2.10.x                                                                  |                                                                                                                                                                                                |
| pnpm         | `11.3.0` (pinned via `packageManager`)                                   |                                                                                                                                                                                                |
| Node         | `lts/*` (`.nvmrc`), `engines` requires >=23                              |                                                                                                                                                                                                |

Monorepo: `apps/frontend` (the Next.js site), `apps/studio` (Sanity Studio). No `packages/` directory — nothing shared between the two apps at the code level; they only share the Sanity dataset.

## Working locally

- `pnpm dev` — runs both apps concurrently (`turbo run dev`): frontend on :3000, Studio on :3333 (Sanity's default, not overridden here).
- `pnpm build` / `pnpm check-types` / `pnpm lint` — run across both apps via Turborepo; each depends on `studio#typegen` first (see `apps/studio/CLAUDE.md`).
- `pnpm typegen` — regenerate Sanity types without a full build.
- `pnpm format` — Prettier across `.ts`/`.tsx`/`.md`.
- `pnpm s:lint` / `pnpm s:fix` — syncpack dependency-version consistency check (core framework packages — `typescript`, `react`, `next`, `sanity`, etc. — are pinned to exact versions across the monorepo, everything else uses `^`).

## Rules that apply on every task

- **This is not the Next.js (or Sanity) you remember.** Both are on versions newer than most training data. Before writing version-specific code (file conventions, API shapes), check `apps/frontend/node_modules/next/dist/docs/` for Next, or the Sanity MCP's `search_docs`/`read_docs`/`list_sanity_rules` for Sanity. See `apps/frontend/AGENTS.md` for the standing instruction — it applies to Studio work too, not just frontend.
- **TypeGen is the most-forgotten step.** After ANY schema change OR new/changed GROQ query, run `pnpm --filter studio typegen` (or `pnpm typegen` from root). Never hand-edit `apps/frontend/src/lib/sanity/sanity.types.ts` — it's generated output. Full detail in `apps/studio/CLAUDE.md`.
- **Schema changes need a Studio deploy.** `pnpm --filter studio deploy` — editors don't see a new field live until this runs, even once the code is merged and the frontend is deployed.
- **Commits are enforced by a hook** (`commitlint` via `.husky/commit-msg`): type must be one of `feat fix docs style refactor test chore revert` (no `perf`/`ci`/`build`), scope must be kebab-case, subject must be lower-case after the `type(scope):` prefix, and body lines can't exceed 100 characters.
- **Work from a branch, not directly on `main`** — not hook-enforced today, but treat it as the convention; open a PR for review.

## Don'ts

- Don't hand-edit `apps/frontend/src/lib/sanity/sanity.types.ts` — regenerate it instead.
- Don't set `overloadClientMethods: true` in `apps/studio/sanity.cli.ts`'s typegen config — see the comment there and `apps/studio/CLAUDE.md` for why it broke typegen when it was tried.
- Don't add a hardcoded content string to a frontend component when a Sanity field could hold it instead — see the standing mandate above.
- Don't fabricate specific-sounding fallback content (names, facts, testimonials) — use an honest empty state.
- Don't use the Sanity array `"tags"` input layout for a field editors will need to reorder — it has no drag handle and no per-item editing, only add/remove. Use the default list layout.
