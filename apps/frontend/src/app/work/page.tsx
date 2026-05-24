import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { sanityFetch } from "@/lib/sanity/client";
import { ALL_PROJECTS_QUERY } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Work — Emery Design Studio",
  description:
    "Selected residential interior projects by Emery Design Studio, Kirkland WA.",
};

export default async function WorkPage() {
  const projects = await sanityFetch<Project[]>({
    query: ALL_PROJECTS_QUERY,
    tags: ["project"],
  });

  return (
    <main id="main">
      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <MonoLabel className="text-[#1b3a5b] block mb-6">
          Work&nbsp;—&nbsp;Project&nbsp;Archive
        </MonoLabel>
        <h1
          className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-16 max-w-2xl"
          style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
        >
          The full
          <br />
          <em>archive.</em>
        </h1>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {projects.map((project) => (
              <article key={project._id} className="group">
                <Link href={`/work/${project.slug}`} aria-label={project.title}>
                  <div
                    className="relative overflow-hidden mb-5"
                    style={{ aspectRatio: 0.75 }}
                  >
                    {project.coverImage?.asset?.url ? (
                      <Image
                        src={project.coverImage.asset.url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={project.coverImage.asset.metadata.lqip}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e4e0d7]" />
                    )}
                  </div>
                </Link>
                <h2 className="font-serif italic text-[#111111] text-[22px] leading-tight mb-1.5">
                  <Link
                    href={`/work/${project.slug}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {project.title}
                  </Link>
                </h2>
                <MonoLabel className="text-[#9a968d] text-[9px]">
                  {[project.category, project.location, project.year]
                    .filter(Boolean)
                    .join(" · ")}
                </MonoLabel>
                {project.excerpt && (
                  <p className="font-sans text-[#6b6b66] text-[13px] leading-relaxed mt-3">
                    {project.excerpt}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div>
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
              Projects coming soon. In the meantime,{" "}
              <Link
                href="/#projects"
                className="text-[#1b3a5b] hover:opacity-70 transition-opacity"
              >
                see selected work
              </Link>{" "}
              on the homepage.
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
