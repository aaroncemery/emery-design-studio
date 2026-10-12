import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { sanityFetch } from "@/lib/sanity/live";
import {
  ALL_PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
  WORK_PAGE_QUERY,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/sanity/build-metadata";
import type {
  Project,
  SiteSettings,
  WorkPage as WorkPageData,
} from "@/lib/sanity/types";

// `export const revalidate = false` isn't set here (intentionally, not an
// oversight) — reading `searchParams` below already forces this page into
// per-request dynamic rendering, which makes a static `revalidate` value a
// no-op. See apps/frontend/CLAUDE.md for the sanityFetch/live-revalidation
// pattern this otherwise follows.

const WORK_CATEGORY_TABS = [
  { label: "Interior Architecture", value: "Interior Architecture" },
  { label: "Styling & Furnishing", value: "Styling & Furnishing" },
  { label: "Consultation", value: "Consultation" },
  // "Full Renovation" is intentionally omitted — it's a dormant service
  // category for now (see apps/studio/src/utils/constants.ts PROJECT_CATEGORIES
  // for the full schema enum, which this list mirrors a subset of).
];

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });
  const siteSettings = data as SiteSettings | null;

  return buildMetadata({
    siteSettings,
    fallbackTitle: "Work",
    fallbackDescription:
      "Selected residential interior projects by Emery Design Studio, Kirkland WA.",
    path: "/work",
  });
}

interface WorkPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { category } = await searchParams;
  const activeCategory =
    category && WORK_CATEGORY_TABS.some((tab) => tab.value === category)
      ? category
      : undefined;

  const [{ data: projectsData }, { data: pageData }] = await Promise.all([
    sanityFetch({
      query: ALL_PROJECTS_QUERY,
      params: { category: activeCategory ?? null },
      tags: ["project"],
    }),
    sanityFetch({ query: WORK_PAGE_QUERY, tags: ["workPage"] }),
  ]);
  const projects = projectsData as Project[];
  const page = pageData as WorkPageData | null;
  const header = page?.header;

  // Split on "/" — editor convention: "Heading / italic second line"
  let headingLine1 = "The full";
  let headingLine2 = "archive.";
  if (header?.heading) {
    const idx = header.heading.indexOf("/");
    if (idx !== -1) {
      headingLine1 = header.heading.slice(0, idx).trim();
      headingLine2 = header.heading.slice(idx + 1).trim();
    } else {
      headingLine1 = header.heading;
      headingLine2 = "";
    }
  }

  const emptyStateText = page?.emptyStateText ?? "Projects coming soon.";

  return (
    <main id="main">
      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <MonoLabel className="text-[#1b3a5b] block mb-6">
          {header?.eyebrow ?? "Work — Project Archive"}
        </MonoLabel>
        <h1
          className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-10 max-w-2xl"
          style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
        >
          {headingLine1}
          {headingLine2 && (
            <>
              <br />
              <em>{headingLine2}</em>
            </>
          )}
        </h1>

        <nav
          aria-label="Filter by category"
          className="flex flex-wrap gap-3 mb-16"
        >
          <Link
            href="/work"
            className={`font-mono text-[10px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors duration-300 ${
              !activeCategory
                ? "border-[#1b3a5b] bg-[#1b3a5b] text-white"
                : "border-[rgba(17,17,17,0.28)] text-[#6b6b66] hover:border-[rgba(17,17,17,0.5)] hover:text-[#111111]"
            }`}
            aria-current={!activeCategory ? "page" : undefined}
          >
            All
          </Link>
          {WORK_CATEGORY_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={`/work?category=${encodeURIComponent(tab.value)}`}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors duration-300 ${
                activeCategory === tab.value
                  ? "border-[#1b3a5b] bg-[#1b3a5b] text-white"
                  : "border-[rgba(17,17,17,0.28)] text-[#6b6b66] hover:border-[rgba(17,17,17,0.5)] hover:text-[#111111]"
              }`}
              aria-current={activeCategory === tab.value ? "page" : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {projects.map((project) => (
              <article key={project._id} className="group">
                <TrackedLink
                  href={`/work/${project.slug}`}
                  aria-label={project.title}
                  eventName="project_card_click"
                  eventParams={{ project: project.slug ?? undefined }}
                >
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
                        blurDataURL={
                          project.coverImage.asset.metadata?.lqip ?? undefined
                        }
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e4e0d7]" />
                    )}
                  </div>
                </TrackedLink>
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
        ) : activeCategory ? (
          <div>
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
              No {activeCategory} projects yet — check back soon, or{" "}
              <Link
                href="/work"
                className="text-[#1b3a5b] hover:opacity-70 transition-opacity"
              >
                see all work
              </Link>
              .
            </p>
            <Link
              href="/work"
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
            >
              ← Clear filter
            </Link>
          </div>
        ) : (
          <div>
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
              {emptyStateText} In the meantime,{" "}
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
