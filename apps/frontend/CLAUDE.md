@AGENTS.md

See the root [`CLAUDE.md`](../../CLAUDE.md) first — this file is frontend-specific additions on top of those rules.

## Architectural thoughtfulness

This studio does architecture and interior design — the site should hold itself to the same standard: well-structured underneath, not just polished on the surface. Nobody sees the DOM, but sloppy structure produces the same fragility a badly-framed room does, and it's felt even when it isn't seen.

When making layout/structural decisions:

- Prefer native CSS layout primitives (flex, grid) over `absolute` positioning plus manually matched offsets. Absolute positioning takes elements out of any shared alignment context, so unrelated pieces end up needing hand-tuned pixel nudges just to line up — flex/grid let the browser compute that relationship structurally instead.
- If a manual offset (`-mt-*`, an arbitrary `top-[Npx]`, etc.) is the only way to fix an alignment issue, treat that as a signal the underlying structure is wrong, not just a bug to patch. Look for the layout primitive that removes the need for the offset (e.g. `items-baseline` on a shared grid/flex row aligning text baselines directly) before reaching for a magic number.
- It's fine, and often correct, to slightly adjust a visual detail to fit cleaner structure rather than forcing pixel-perfect reproduction onto a fragile DOM shape.
- This is a general standard for structural choices across the codebase, not a one-off rule for any single component — favor the structural fix over the compensating hack even when the hack ships faster.

## Fetching Sanity data

Two different fetch paths exist — use the right one for the context:

- **`sanityFetch`** (from `@/lib/sanity/live`) — use in server components and route handlers (anything that runs per-request). Participates in next-sanity's live/tag-based revalidation. Always pass `tags`.
- **plain `client.fetch`** (from `@/lib/sanity/client`) — use in `generateStaticParams` (build-time, no request context to attach live revalidation to). See `work/[slug]/page.tsx` or `journal/[slug]/page.tsx` for the pattern.

**`sanityFetch`'s `data` is not automatically typed to match your query.** next-sanity doesn't infer the result type from the query string here (TypeGen's `overloadClientMethods` is deliberately off — see `apps/studio/CLAUDE.md`), so every call site casts explicitly:

```ts
const { data } = await sanityFetch({ query: SOME_QUERY, tags: ["tag"] });
const typed = data as SomeQueryResult; // or a hand-derived type from lib/sanity/types.ts
```

Skipping the cast doesn't error at the fetch call — it fails later, confusingly, wherever you first access a field (`Property 'x' does not exist on type '{}'`). If you add a new query, add the cast at the same time.

## Metadata & SEO

- `buildMetadata()` (`lib/sanity/build-metadata.ts`) requires a `path` argument — every route passes its own (`"/"`, `"/work"`, `` `/work/${slug}` ``, etc.). This is what makes canonical URLs default sensibly when a page hasn't set `seo.canonicalUrl` explicitly in Sanity.
- Root `generateMetadata()` sets `metadataBase` (from `lib/site-url.ts`) — without it, relative OG/canonical URLs silently resolve against `localhost` once deployed.
- Dynamic OG images: there are two ways to wire up `next/og`'s `ImageResponse`, and they don't compose —
  - The special per-segment `opengraph-image.tsx` file convention runs automatically for that route and can't easily be made conditional on whether Sanity already provided an image.
  - A plain custom Route Handler (this repo uses `app/og/route.tsx`, parameterized by a `?title=` query param) referenced explicitly from `metadata.openGraph.images` — use this whenever the image needs to be conditional or parameterized, which is the normal case here (fallback only when `seo.ogImage` is unset in Sanity).
- The CSP header in `next.config.ts` only sets `frame-ancestors` (controls who can iframe this site — needed for Sanity Studio's Presentation tool). It does not restrict what scripts this site itself loads, so adding a third-party script (analytics, etc.) doesn't require a CSP change.

## Env vars

Any `process.env.*` read inside a `build` or `check-types` task must be added to that task's `env` array in the root `turbo.json`, or Turborepo's cache won't invalidate when the value changes between runs.
