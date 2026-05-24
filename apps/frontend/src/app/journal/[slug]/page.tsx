import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { client, sanityFetch } from "@/lib/sanity/client";
import { JOURNAL_POST_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import type { JournalPost } from "@/lib/sanity/types";

export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "journalPost" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return slugs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<JournalPost>({
    query: JOURNAL_POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [`journalPost:${slug}`],
  });

  if (!post) return {};

  return {
    title: `${post.title} — Emery Design Studio`,
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<JournalPost>({
    query: JOURNAL_POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [`journalPost:${slug}`],
  });

  if (!post) notFound();

  return (
    <main id="main">
      {post.coverImage?.asset?.url && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "55vh", minHeight: "360px" }}
        >
          <Image
            src={post.coverImage.asset.url}
            alt={post.title}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={post.coverImage.asset.metadata.lqip}
            sizes="100vw"
          />
        </div>
      )}

      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <div className="max-w-2xl">
          <MonoLabel className="text-[#9a968d] block mb-4 text-[9px]">
            {[
              post.author,
              post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </MonoLabel>

          <h1
            className="font-serif text-[#111111] leading-[0.94] tracking-tight mb-12"
            style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
          >
            {post.title}
          </h1>

          {post.body && (
            <div className="font-sans text-[#4a4a44] text-base leading-relaxed space-y-5 prose-headings:font-serif prose-headings:text-[#111111]">
              <PortableText value={post.body} />
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-[rgba(17,17,17,0.1)]">
            <Link
              href="/journal"
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
            >
              ← All journal entries
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
