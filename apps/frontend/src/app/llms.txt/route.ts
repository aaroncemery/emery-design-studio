import { sanityFetch } from "@/lib/sanity/live";
import { LLMS_TXT_QUERY } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/site-url";
import type { LlmsTxtData } from "@/lib/sanity/types";

export const revalidate = false;

// A plain-text summary for AI agents/answer engines — assembled from Sanity
// at request time, same "fetch from Sanity, render as a format crawlers
// expect" shape as sitemap.ts. Add a new service in Studio and it shows up
// here automatically; nothing here needs a code change to stay current.
export async function GET() {
  const { data: fetchedData } = await sanityFetch({
    query: LLMS_TXT_QUERY,
    tags: ["siteSettings", "service", "project", "journalPost"],
  });
  const data = fetchedData as LlmsTxtData;

  const siteName = data?.siteSettings?.siteName || "Emery Design Studio";
  const description =
    data?.siteSettings?.siteDescription ||
    "A small interior design studio based in Kirkland, Washington, working with residential clients since 2014.";
  const contactEmail =
    data?.siteSettings?.contactEmail || "hello@emerydesign.studio";
  const contactRegion = data?.siteSettings?.contactRegion || "Kirkland, WA";

  const lines: string[] = [
    `# ${siteName}`,
    "",
    description,
    "",
    `Region: ${contactRegion}`,
    `Contact: ${contactEmail}`,
    `Website: ${SITE_URL}`,
    "",
  ];

  if (data?.services?.length) {
    lines.push("## Services", "");
    for (const service of data.services) {
      lines.push(
        `- ${service.title}${service.description ? `: ${service.description}` : ""}`,
      );
    }
    lines.push("");
  }

  if (data?.projects?.length) {
    lines.push("## Selected projects", "");
    for (const project of data.projects) {
      const meta = [project.category, project.location, project.year]
        .filter(Boolean)
        .join(" · ");
      const url = project.slug ? `${SITE_URL}/work/${project.slug}` : null;
      lines.push(
        `- ${project.title}${meta ? ` (${meta})` : ""}${url ? `: ${url}` : ""}`,
      );
    }
    lines.push("");
  }

  if (data?.journalPosts?.length) {
    lines.push("## Journal", "");
    for (const post of data.journalPosts) {
      const url = post.slug ? `${SITE_URL}/journal/${post.slug}` : null;
      lines.push(`- ${post.title}${url ? `: ${url}` : ""}`);
    }
    lines.push("");
  }

  lines.push(
    "## Pages",
    "",
    `- Home: ${SITE_URL}`,
    `- Work: ${SITE_URL}/work`,
    `- Studio: ${SITE_URL}/studio`,
    `- Services: ${SITE_URL}/services`,
    `- Journal: ${SITE_URL}/journal`,
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
