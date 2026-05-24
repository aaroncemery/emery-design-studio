import type { Metadata } from "next";
import type { Seo, SiteSettings } from "./types";

const FALLBACK_SITE_NAME = "Emery Design Studio";

export function buildMetadata({
  pageSeo,
  siteSettings,
  fallbackTitle,
  fallbackDescription,
}: {
  pageSeo?: Seo | null;
  siteSettings?: SiteSettings | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
}): Metadata {
  const siteName = siteSettings?.siteName ?? FALLBACK_SITE_NAME;
  const pageTitle = pageSeo?.title ?? fallbackTitle;
  const title = pageTitle ? `${pageTitle} — ${siteName}` : siteName;

  const description =
    pageSeo?.description ??
    fallbackDescription ??
    siteSettings?.siteDescription;

  const ogImageUrl =
    pageSeo?.ogImage?.asset?.url ?? siteSettings?.defaultOgImage?.asset?.url;

  const metadata: Metadata = { title, description };

  if (ogImageUrl) {
    metadata.openGraph = {
      title,
      description: description ?? undefined,
      images: [{ url: ogImageUrl }],
    };
    metadata.twitter = {
      card: "summary_large_image",
      images: [ogImageUrl],
    };
  }

  if (pageSeo?.noIndex || pageSeo?.noFollow) {
    metadata.robots = {
      index: !pageSeo.noIndex,
      follow: !pageSeo.noFollow,
    };
  }

  if (pageSeo?.canonicalUrl) {
    metadata.alternates = { canonical: pageSeo.canonicalUrl };
  }

  if (pageSeo?.keywords?.length) {
    metadata.keywords = pageSeo.keywords;
  }

  return metadata;
}
