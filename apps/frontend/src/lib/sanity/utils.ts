import { stegaClean } from "next-sanity";
import type { NavItem } from "./types";

export function resolveNavHref(item: NavItem): string {
  if (item.linkType === "page" && item.page) {
    if (item.page._type === "legalPage") return `/legal/${item.page.slug}`;
    return `/${item.page.slug}`;
  }
  return item.url ?? "#";
}

export function resolveNavLabel(item: NavItem): string {
  return item.label ?? item.page?.title ?? item.url ?? "";
}

/**
 * Returns the trimmed text, or undefined when the field is empty or
 * whitespace-only. Strips stega markers first so Presentation's draft-mode
 * encoding can't make an empty string look non-empty.
 */
export function cleanText(value?: string | null): string | undefined {
  const text = stegaClean(value)?.trim();
  return text ? value!.trim() : undefined;
}

/**
 * Drops empty / whitespace-only text blocks from Portable Text so editors'
 * stray blank lines don't render as empty paragraphs.
 */
export function stripEmptyBlocks<T extends { _type: string }>(
  blocks?: T[] | null,
): T[] {
  return (blocks ?? []).filter((block) => {
    if (block._type !== "block") return true;
    const children = (block as { children?: Array<{ text?: string }> })
      .children;
    return children?.some((child) => child.text?.trim()) ?? false;
  });
}
