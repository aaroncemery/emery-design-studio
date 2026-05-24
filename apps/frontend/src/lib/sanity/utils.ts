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
