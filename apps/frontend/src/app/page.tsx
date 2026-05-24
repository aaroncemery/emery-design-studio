import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { StudioIntro } from "@/components/sections/studio-intro";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Inquiry } from "@/components/sections/inquiry";
import { sanityFetch } from "@/lib/sanity/client";
import { HOME_PAGE_QUERY } from "@/lib/sanity/queries";
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

export default async function Home() {
  const homePage = await sanityFetch<HomePage>({
    query: HOME_PAGE_QUERY,
    tags: ["homePage"],
  });

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
    (s) => s.displayAs === "projectGrid",
  );
  const servicesSection = collectionSections.find(
    (s) => s.displayAs === "serviceRows",
  );
  const testimonialsSection = collectionSections.find(
    (s) => s.displayAs === "testimonialRotator",
  );
  const pressSection = collectionSections.find(
    (s) => s.displayAs === "pressMentions",
  );

  return (
    <main id="main">
      <Hero data={heroData} />
      <FeaturedProjects
        projects={projectsSection?.items as Project[] | undefined}
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
