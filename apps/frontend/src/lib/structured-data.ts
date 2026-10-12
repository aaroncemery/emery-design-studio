import type {
  JournalPost,
  Project,
  Service,
  SiteSettings,
} from "@/lib/sanity/types";
import { SITE_URL } from "@/lib/site-url";

export function organizationJsonLd(siteSettings?: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: siteSettings?.siteName || "Emery Design Studio",
    url: SITE_URL,
    email: siteSettings?.contactEmail || "hello@emerydesign.studio",
    description: siteSettings?.siteDescription ?? undefined,
    areaServed: siteSettings?.contactRegion || "Kirkland, WA",
    image: siteSettings?.logo?.asset?.url ?? undefined,
  };
}

export function serviceJsonLd(service: Service, providerName?: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description ?? undefined,
    provider: {
      "@type": "LocalBusiness",
      name: providerName || "Emery Design Studio",
    },
  };
}

export function creativeWorkJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt ?? undefined,
    url: project.slug ? `${SITE_URL}/work/${project.slug}` : undefined,
    image: project.coverImage?.asset?.url ?? undefined,
    locationCreated: project.location ?? undefined,
    dateCreated: project.year ? String(project.year) : undefined,
  };
}

export function articleJsonLd(post: JournalPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    url: post.slug ? `${SITE_URL}/journal/${post.slug}` : undefined,
    image: post.coverImage?.asset?.url ?? undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    datePublished: post.publishedAt ?? undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
