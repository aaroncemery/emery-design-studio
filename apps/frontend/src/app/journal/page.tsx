import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { sanityFetch } from "@/lib/sanity/client";
import {
  ALL_JOURNAL_POSTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/sanity/build-metadata";
import type { JournalPost, SiteSettings } from "@/lib/sanity/types";

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await sanityFetch<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  return buildMetadata({
    siteSettings,
    fallbackTitle: "Journal",
    fallbackDescription:
      "Writing and notes from Emery Design Studio on interiors, materials, and process.",
  });
}

export default async function JournalPage() {
  const posts = await sanityFetch<JournalPost[]>({
    query: ALL_JOURNAL_POSTS_QUERY,
    tags: ["journalPost"],
  });

  return (
    <main id="main">
      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <MonoLabel className="text-[#1b3a5b] block mb-6">
          Journal&nbsp;—&nbsp;Notes&nbsp;on&nbsp;Practice
        </MonoLabel>
        <h1
          className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-16 max-w-2xl"
          style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
        >
          Slow <em>writing</em>
          <br />
          from the studio.
        </h1>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-4xl">
            {posts.map((post) => (
              <article key={post._id}>
                {post.coverImage?.asset?.url && (
                  <Link href={`/journal/${post.slug}`}>
                    <div
                      className="relative overflow-hidden mb-5"
                      style={{ aspectRatio: 1.5 }}
                    >
                      <Image
                        src={post.coverImage.asset.url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.04]"
                        placeholder="blur"
                        blurDataURL={post.coverImage.asset.metadata.lqip}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </Link>
                )}
                <MonoLabel className="text-[#9a968d] block mb-2 text-[9px]">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : null}
                </MonoLabel>
                <h2 className="font-serif text-[#111111] text-[22px] leading-tight mb-2">
                  <Link
                    href={`/journal/${post.slug}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.author && (
                  <MonoLabel className="text-[#9a968d] text-[9px]">
                    {post.author}
                  </MonoLabel>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div>
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
              Essays and notes on materials, process, and the spaces we build.
              Coming soon.
            </p>
            <Link
              href="/"
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
            >
              ← Back home
            </Link>
          </div>
        )}
      </Section>
    </main>
  );
}
