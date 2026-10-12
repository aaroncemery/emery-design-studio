See the root [`CLAUDE.md`](../../CLAUDE.md) first — this file is Sanity/Studio-specific additions on top of those rules.

## TypeGen

After ANY schema change (new field, new type, new document) or any new/changed GROQ query in `apps/frontend/src/lib/sanity/queries.ts`, run:

```
pnpm --filter studio typegen
```

This regenerates both `apps/studio/schema.json` (gitignored) and `apps/frontend/src/lib/sanity/sanity.types.ts` (committed). It's also wired as a dependency of the `build` and `check-types` Turbo tasks, so CI won't drift silently — but run it manually while iterating so your editor's TypeScript isn't stale.

- **Never hand-edit `sanity.types.ts`.** It's fully generated; resolve conflicts or staleness by re-running typegen, not by patching it.
- **Every GROQ query must be wrapped in `defineQuery(...)`** from `next-sanity` (see `queries.ts`). A plain template string won't be picked up by the typegen extractor — the query will run fine at runtime but silently have no generated result type.
- **`overloadClientMethods: false` in `sanity.cli.ts` is deliberate, not an oversight.** Setting it to `true` generates an unresolvable `declare module "@sanity/client"` augmentation, because `apps/frontend` doesn't depend on `@sanity/client` directly — it fetches through a custom `sanityFetch` wrapper (`next-sanity/live`'s `defineLive`). The comment in `sanity.cli.ts` explains this; don't "fix" it back. The consequence is that frontend call sites import result types explicitly and cast (`data as SomeQueryResult`) — see `apps/frontend/CLAUDE.md`.

## Schema conventions

- **Field grouping**: use `GROUP`/`GROUPS` from `apps/studio/src/utils/constants.ts` on every document type's fields (`content`, `seo`, `details`, `media`, `microcopy`, etc.) rather than leaving fields ungrouped. This is what organizes the Studio editing UI into tabs instead of one long flat field list. Look at `documents/project.ts` or `documents/journalPost.ts` for the pattern.
- **Singleton documents** (site settings, navigation, footer, the four page-header singletons, home page) are pinned in the structure tool in `sanity.config.ts` via a fixed `documentId()` (e.g. `"singleton-homePage"`) — they are not repeatable document types with a generic list view. Adding a new singleton means registering it in `sanity.config.ts`'s structure (and `mainDocuments`/`locations` for Presentation), not just in `schemaTypes/index.ts`.
- **Reusable object types** (`objects/` — `pageHeader`, `seo`, `socialLink`, `heroCorner`) get referenced by field `type`, the same as any primitive. Prefer adding a new shared object type over duplicating a field shape across multiple documents.
- **Array-of-string fields the editor will reorder or edit individually** should use the default list layout, not `options: { layout: "tags" }` — tags has no drag handle and no per-item edit, only add/remove by retyping the whole thing.
- **Native field types over `string` where they fit**: `email` and `url` types give free format validation; reach for them before a plain `string` with a description telling editors to type a valid email/URL.
- **Page architecture**: a generic flexible page-builder (`documents/page.ts`, reusing the same `sections[]` array as the home page) exists but is deliberately unused by any frontend route. For a page whose shape is genuinely fixed (Studio, Services, Work archive, Journal archive), prefer a small dedicated singleton schema over building it with the generic page-builder — reserve page-builder flexibility for pages that actually change shape over time (currently only the home page).

## Deploying

A schema or Studio-config change isn't live for editors until deployed:

```
pnpm --filter studio deploy
```

This pushes to `https://emery-design.sanity.studio` (hostname pinned in `sanity.cli.ts`). Merging the code and deploying the frontend does **not** deploy Studio — they're separate steps.

## Content philosophy

See the root `CLAUDE.md`'s standing mandate: default to making new content Sanity-editable, and never fabricate specific-sounding fallback content. The practical implications for schema design:

- If you're adding a field just so a frontend fallback string can instead be a real value, add it to the schema rather than leaving the hardcoded string in place "for now."
- An empty/unset state in the frontend should read as an honest placeholder ("Projects coming soon"), never as fabricated real-looking content.
