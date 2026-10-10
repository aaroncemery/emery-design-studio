import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { sanityFetch } from "@/lib/sanity/live";
import { STUDIO_PAGE_QUERY } from "@/lib/sanity/queries";
import { StudioIntroContent } from "@/components/sections/studio-intro-content";
import type { StudioPage as StudioPageData } from "@/lib/sanity/types";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Studio — Emery Design Studio",
  description:
    "About Emery Design Studio — a small interior design atelier in Kirkland, WA.",
};

export default async function StudioPage() {
  const { data } = await sanityFetch({
    query: STUDIO_PAGE_QUERY,
    tags: ["studioPage"],
  });
  const page = data as StudioPageData | null;
  const header = page?.header;
  const intro = page?.intro;

  // Split on "/" — editor convention: "Heading / italic second line"
  let headingLine1 = "A small atelier";
  let headingLine2 = "on the water.";
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

  return (
    <main id="main">
      <Section
        className="bg-[#ece8df] min-h-[70vh] flex flex-col justify-center"
        paddingY="xl"
      >
        <MonoLabel className="text-[#1b3a5b] block mb-6">
          {header?.eyebrow ?? "Studio — About"}
        </MonoLabel>
        <h1
          className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-8 max-w-2xl"
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

        {intro ? (
          <StudioIntroContent data={intro} />
        ) : (
          <>
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
              Studio content coming soon. In the meantime,{" "}
              <Link
                href="/#studio"
                className="text-[#1b3a5b] hover:opacity-70 transition-opacity"
              >
                read more
              </Link>{" "}
              on the homepage.
            </p>
            <Link
              href="/"
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
            >
              ← Back home
            </Link>
          </>
        )}
      </Section>
    </main>
  );
}
