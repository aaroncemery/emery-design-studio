import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { client, sanityFetch } from "@/lib/sanity/client";
import {
  LEGAL_PAGE_BY_SLUG_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/sanity/build-metadata";
import type { LegalPage, SiteSettings } from "@/lib/sanity/types";

export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "legalPage" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return slugs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [page, siteSettings] = await Promise.all([
    sanityFetch<LegalPage>({
      query: LEGAL_PAGE_BY_SLUG_QUERY,
      params: { slug },
      tags: [`legalPage:${slug}`],
    }),
    sanityFetch<SiteSettings | null>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
  ]);

  if (!page) return {};

  return buildMetadata({
    pageSeo: page.seo,
    siteSettings,
    fallbackTitle: page.title,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await sanityFetch<LegalPage>({
    query: LEGAL_PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`legalPage:${slug}`],
  });

  if (!page) notFound();

  return (
    <main id="main">
      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <div className="max-w-2xl">
          <MonoLabel className="text-[#1b3a5b] block mb-6">Legal</MonoLabel>
          <h1
            className="font-serif text-[#111111] leading-[0.94] tracking-tight mb-12"
            style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
          >
            {page.title}
          </h1>

          {page.body && (
            <div className="font-sans text-[#4a4a44] text-base leading-relaxed space-y-5">
              <PortableText value={page.body} />
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-[rgba(17,17,17,0.1)]">
            <Link
              href="/"
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
            >
              ← Back home
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
