@AGENTS.md

## Architectural thoughtfulness

This studio does architecture and interior design — the site should hold itself to the same standard: well-structured underneath, not just polished on the surface. Nobody sees the DOM, but sloppy structure produces the same fragility a badly-framed room does, and it's felt even when it isn't seen.

When making layout/structural decisions:

- Prefer native CSS layout primitives (flex, grid) over `absolute` positioning plus manually matched offsets. Absolute positioning takes elements out of any shared alignment context, so unrelated pieces end up needing hand-tuned pixel nudges just to line up — flex/grid let the browser compute that relationship structurally instead.
- If a manual offset (`-mt-*`, an arbitrary `top-[Npx]`, etc.) is the only way to fix an alignment issue, treat that as a signal the underlying structure is wrong, not just a bug to patch. Look for the layout primitive that removes the need for the offset (e.g. `items-baseline` on a shared grid/flex row aligning text baselines directly) before reaching for a magic number.
- It's fine, and often correct, to slightly adjust a visual detail to fit cleaner structure rather than forcing pixel-perfect reproduction onto a fragile DOM shape.
- This is a general standard for structural choices across the codebase, not a one-off rule for any single component — favor the structural fix over the compensating hack even when the hack ships faster.
