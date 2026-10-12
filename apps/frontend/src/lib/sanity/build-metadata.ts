import type { Metadata } from "next";
import type { Seo, SiteSettings } from "./types";

const FALLBACK_SITE_NAME = "Emery Design Studio";

export function buildMetadata({
  pageSeo,
  siteSettings,
  fallbackTitle,
  fallbackDescription,
  path,
}: {
  pageSeo?: Seo | null;
  siteSettings?: SiteSettings | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  // The route this metadata is for (e.g. "/", "/work/woodinville") — used
  // to build a default canonical URL and the dynamic OG image fallback.
  // Relative URLs below resolve against the metadataBase set in layout.tsx.
  path: string;
}): Metadata {
  const siteName = siteSettings?.siteName ?? FALLBACK_SITE_NAME;
  const pageTitle = pageSeo?.title ?? fallbackTitle;
  const title = pageTitle ? `${pageTitle} — ${siteName}` : siteName;

  const description =
    pageSeo?.description ??
    fallbackDescription ??
    siteSettings?.siteDescription;

  // A manually-uploaded Sanity image always wins. Otherwise fall back to a
  // dynamically generated image instead of leaving the share preview blank.
  const ogImageUrl =
    pageSeo?.ogImage?.asset?.url ??
    siteSettings?.defaultOgImage?.asset?.url ??
    `/og?title=${encodeURIComponent(pageTitle ?? siteName)}`;

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: pageSeo?.canonicalUrl ?? path },
    openGraph: {
      title,
      description: description ?? undefined,
      images: [{ url: ogImageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  };

  if (pageSeo?.noIndex || pageSeo?.noFollow) {
    metadata.robots = {
      index: !pageSeo.noIndex,
      follow: !pageSeo.noFollow,
    };
  }

  if (pageSeo?.keywords?.length) {
    metadata.keywords = pageSeo.keywords;
  }

  return metadata;
}
