/**
 * Sizing rules for the project page blocks (see docs/work-page-blocks-handoff.md).
 * Images are sized by *area* so a portrait and a landscape carry the same
 * visual weight, and no image grows taller than 82vh.
 */
export const FIG = {
  marginArea: 110_000, // small image beside long text
  spreadArea: 300_000, // large image beside short text
  soloArea: 200_000, // lone portrait in the column
  mobileArea: 160_000, // any image once the layout stacks
  spreadMaxW: 480,
  soloMaxW: 400,
  mobileMaxW: 640,
  /** Approx. width of the margin beside the reading column at desktop. */
  marginEdge: 294,
  maxVh: 0.82,
} as const;

/** Rendered width (px) giving roughly equal visual weight across ratios. */
export function figWidth(
  ratio: number,
  area: number,
  maxW: number,
  viewportH = 900,
): number {
  return Math.round(
    Math.min(Math.sqrt(area * ratio), maxW, viewportH * FIG.maxVh * ratio),
  );
}

export interface FigWidth {
  desktop: number;
  mobile: number;
}

/** Desktop width from `area`/`maxW`; mobile width is the same for every block. */
export function figWidths(ratio: number, area: number, maxW: number): FigWidth {
  return {
    desktop: figWidth(ratio, area, maxW),
    mobile: figWidth(ratio, FIG.mobileArea, FIG.mobileMaxW),
  };
}

/** `sizes` matching a `FigWidth` (lg breakpoint = 1024px). */
export function figSizes(w: FigWidth): string {
  return `(min-width: 1024px) ${w.desktop}px, min(${w.mobile}px, calc(100vw - 3rem))`;
}

/**
 * Beside-text blocks: a long passage with a small image becomes a "margin"
 * note (image hangs into the margin); short text next to a larger image becomes
 * a "spread" (text bottom-aligned with the caption). `textH * 2` is the dial.
 */
export function sideMode(
  text: string | null | undefined,
  hasLabel: boolean,
  ratio: number,
): "margin" | "spread" {
  const mw = figWidth(ratio, FIG.marginArea, FIG.marginEdge - 48);
  const textH = Math.ceil((text?.length ?? 0) / 62) * 29 + (hasLabel ? 30 : 0);
  return mw / ratio > textH * 2 ? "spread" : "margin";
}
