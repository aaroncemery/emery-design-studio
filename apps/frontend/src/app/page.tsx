import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { StudioIntro } from "@/components/sections/studio-intro";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Inquiry } from "@/components/sections/inquiry";
import { sanityFetch } from "@/lib/sanity/live";
import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/sanity/build-metadata";
import type { SiteSettings } from "@/lib/sanity/types";
import type {
  HomePage,
  HeroSection,
  StudioIntroSection,
  CollectionSection,
  InquirySection,
  Project,
  Service,
  Testimonial,
  PressItem,
} from "@/lib/sanity/types";

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: homePageData }, { data: siteSettingsData }] =
    await Promise.all([
      sanityFetch({ query: HOME_PAGE_QUERY, tags: ["homePage"] }),
      sanityFetch({
        query: SITE_SETTINGS_QUERY,
        tags: ["siteSettings"],
      }),
    ]);
  const homePage = homePageData as HomePage | null;
  const siteSettings = siteSettingsData as SiteSettings | null;

  return buildMetadata({
    pageSeo: homePage?.seo,
    siteSettings,
    fallbackDescription:
      "Considered residential interiors from a small, slow studio on Lake Washington.",
  });
}

export default async function Home() {
  const { data } = await sanityFetch({
    query: HOME_PAGE_QUERY,
    tags: ["homePage"],
  });
  const homePage = data as HomePage | null;

  const sections = homePage?.sections ?? [];

  const heroData = sections.find(
    (s): s is HeroSection => s._type === "heroSection",
  );
  const studioIntroData = sections.find(
    (s): s is StudioIntroSection => s._type === "studioIntroSection",
  );
  const inquiryData = sections.find(
    (s): s is InquirySection => s._type === "inquirySection",
  );

  const collectionSections = sections.filter(
    (s): s is CollectionSection => s._type === "collectionSection",
  );

  const projectsSection = collectionSections.find(
    (s) => stegaClean(s.displayAs) === "projectGrid",
  );
  const servicesSection = collectionSections.find(
    (s) => stegaClean(s.displayAs) === "serviceRows",
  );
  const testimonialsSection = collectionSections.find(
    (s) => stegaClean(s.displayAs) === "testimonialRotator",
  );
  const pressSection = collectionSections.find(
    (s) => stegaClean(s.displayAs) === "pressMentions",
  );

  return (
    <main id="main">
      <Hero data={heroData} />
      <FeaturedProjects
        projects={projectsSection?.items as Project[] | undefined}
        heading={projectsSection?.heading}
        subheading={projectsSection?.subheading}
      />
      <StudioIntro data={studioIntroData} />
      <Services services={servicesSection?.items as Service[] | undefined} />
      <Testimonials
        testimonials={testimonialsSection?.items as Testimonial[] | undefined}
        pressItems={pressSection?.items as PressItem[] | undefined}
      />
      <Inquiry data={inquiryData} />
    </main>
  );
}
