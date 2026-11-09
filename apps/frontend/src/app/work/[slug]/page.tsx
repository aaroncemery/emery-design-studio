import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectMasthead } from "@/components/work/project-masthead";
import { ProjectStory } from "@/components/work/project-story";
import {
  MakingOfSection,
  hasMakingOfContent,
} from "@/components/work/making-of";
import { ContactSheet } from "@/components/work/contact-sheet";
import { collectProjectImages } from "@/components/work/collect-images";
import {
  InquiryBar,
  NextProject,
  ProjectCredits,
} from "@/components/work/project-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECT_NAV_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/sanity/build-metadata";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site-url";
import type { Project, ProjectNavItem, SiteSettings } from "@/lib/sanity/types";

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
  const [{ data: projectData }, { data: siteSettingsData }] = await Promise.all(
    [
      sanityFetch({
        query: PROJECT_BY_SLUG_QUERY,
        params: { slug },
        tags: [`project:${slug}`],
      }),
      sanityFetch({
        query: SITE_SETTINGS_QUERY,
        tags: ["siteSettings"],
      }),
    ],
  );
  const project = projectData as Project | null;
  const siteSettings = siteSettingsData as SiteSettings | null;

  if (!project) return {};

  return buildMetadata({
    pageSeo: project.seo,
    siteSettings,
    fallbackTitle: project.title,
    fallbackDescription: project.excerpt ?? undefined,
    path: `/work/${slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ data }, { data: navData }, { data: siteSettingsData }] =
    await Promise.all([
      sanityFetch({
        query: PROJECT_BY_SLUG_QUERY,
        params: { slug },
        tags: [`project:${slug}`],
      }),
      sanityFetch({ query: PROJECT_NAV_QUERY, tags: ["project"] }),
      sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
    ]);
  const project = data as Project | null;
  const allProjects = (navData ?? []) as ProjectNavItem[];
  const siteSettings = siteSettingsData as SiteSettings | null;

  if (!project) notFound();

  const makingOf = hasMakingOfContent(project.makingOf)
    ? project.makingOf
    : null;

  // Next project: the following one in /work order, wrapping to the first.
  // Hidden when this is the only project.
  const index = allProjects.findIndex((p) => p.slug === project.slug);
  const next =
    allProjects.length > 1 && index >= 0
      ? allProjects[(index + 1) % allProjects.length]
      : null;

  return (
    <main id="main">
      <JsonLd data={creativeWorkJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Work", url: `${SITE_URL}/work` },
          { name: project.title, url: `${SITE_URL}/work/${project.slug}` },
        ])}
      />
      <ProjectMasthead project={project} hasMakingOf={!!makingOf} />
      <ProjectStory body={project.body} />
      {makingOf && <MakingOfSection makingOf={makingOf} />}
      <ContactSheet images={collectProjectImages(project)} />
      <ProjectCredits
        project={project}
        studioName={siteSettings?.siteName ?? null}
      />
      {next && <NextProject next={next} />}
      <InquiryBar />
    </main>
  );
}
