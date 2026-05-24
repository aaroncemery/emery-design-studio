import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { SiteNav } from "@/components/nav/site-nav";
import { SiteFooter } from "@/components/sections/site-footer";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { client, sanityFetch } from "@/lib/sanity/client";
import { PROJECT_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";

export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return slugs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<Project>({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    tags: [`project:${slug}`],
  });

  if (!project) return {};

  return {
    title: `${project.title} — Emery Design Studio`,
    description: project.excerpt,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await sanityFetch<Project>({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    tags: [`project:${slug}`],
  });

  if (!project) notFound();

  return (
    <>
      <SiteNav />
      <main id="main">
        {/* Hero */}
        {project.coverImage?.asset?.url && (
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "70vh", minHeight: "480px" }}
          >
            <Image
              src={project.coverImage.asset.url}
              alt={project.title}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={project.coverImage.asset.metadata.lqip}
              sizes="100vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            />
            <div className="absolute bottom-10 left-0 right-0 px-8 lg:px-16">
              <MonoLabel className="text-white/50 block mb-3">
                {[project.category, project.location, project.year]
                  .filter(Boolean)
                  .join(" · ")}
              </MonoLabel>
              <h1
                className="font-serif text-white leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(40px, 5vw, 80px)" }}
              >
                <em>{project.title}</em>
              </h1>
            </div>
          </div>
        )}

        <Section className="bg-[#f6f4ef]" paddingY="xl">
          {/* Title (when no cover image) */}
          {!project.coverImage?.asset?.url && (
            <div className="mb-16">
              <MonoLabel className="text-[#1b3a5b] block mb-4">
                {[project.category, project.location, project.year]
                  .filter(Boolean)
                  .join(" · ")}
              </MonoLabel>
              <h1
                className="font-serif text-[#111111] leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(40px, 5vw, 80px)" }}
              >
                <em>{project.title}</em>
              </h1>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 lg:gap-24">
            {/* Body */}
            {project.body && (
              <div className="font-sans text-[#4a4a44] text-base leading-relaxed space-y-5">
                <PortableText value={project.body} />
              </div>
            )}

            {/* Meta sidebar */}
            <aside className="space-y-8">
              {project.excerpt && (
                <div>
                  <MonoLabel className="text-[#9a968d] block mb-3">
                    About
                  </MonoLabel>
                  <p className="font-sans text-[#6b6b66] text-sm leading-relaxed">
                    {project.excerpt}
                  </p>
                </div>
              )}
              <div className="space-y-4">
                {project.category && (
                  <div>
                    <MonoLabel className="text-[#9a968d] block mb-1">
                      Scope
                    </MonoLabel>
                    <p className="font-sans text-[#111111] text-sm">
                      {project.category}
                    </p>
                  </div>
                )}
                {project.location && (
                  <div>
                    <MonoLabel className="text-[#9a968d] block mb-1">
                      Location
                    </MonoLabel>
                    <p className="font-sans text-[#111111] text-sm">
                      {project.location}
                    </p>
                  </div>
                )}
                {project.year && (
                  <div>
                    <MonoLabel className="text-[#9a968d] block mb-1">
                      Year
                    </MonoLabel>
                    <p className="font-sans text-[#111111] text-sm">
                      {project.year}
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.gallery.map((img) => (
                <div
                  key={img.asset._id}
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: img.asset.metadata.dimensions.aspectRatio,
                  }}
                >
                  <Image
                    src={img.asset.url}
                    alt=""
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={img.asset.metadata.lqip}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-[rgba(17,17,17,0.1)]">
            <Link
              href="/work"
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
            >
              ← All projects
            </Link>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
