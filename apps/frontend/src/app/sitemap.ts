import type { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/live";
import {
  ALL_PROJECTS_QUERY,
  ALL_JOURNAL_POSTS_QUERY,
  ALL_LEGAL_PAGES_QUERY,
} from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/site-url";
import type {
  ALL_PROJECTS_QUERY_RESULT,
  ALL_JOURNAL_POSTS_QUERY_RESULT,
  ALL_LEGAL_PAGES_QUERY_RESULT,
} from "@/lib/sanity/sanity.types";

export const revalidate = false;

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
  { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/studio`, changeFrequency: "yearly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    { data: projectsData },
    { data: journalPostsData },
    { data: legalPagesData },
  ] = await Promise.all([
    sanityFetch({
      query: ALL_PROJECTS_QUERY,
      params: { category: null },
      tags: ["project"],
    }),
    sanityFetch({ query: ALL_JOURNAL_POSTS_QUERY, tags: ["journalPost"] }),
    sanityFetch({ query: ALL_LEGAL_PAGES_QUERY, tags: ["legalPage"] }),
  ]);
  const projects = projectsData as ALL_PROJECTS_QUERY_RESULT;
  const journalPosts = journalPostsData as ALL_JOURNAL_POSTS_QUERY_RESULT;
  const legalPages = legalPagesData as ALL_LEGAL_PAGES_QUERY_RESULT;

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const journalRoutes: MetadataRoute.Sitemap = (journalPosts ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/journal/${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const legalRoutes: MetadataRoute.Sitemap = (legalPages ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/legal/${p.slug}`,
      changeFrequency: "yearly",
      priority: 0.3,
    }));

  return [...STATIC_ROUTES, ...projectRoutes, ...journalRoutes, ...legalRoutes];
}
