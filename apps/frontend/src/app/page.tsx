import { SiteNav } from "@/components/nav/site-nav";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { StudioIntro } from "@/components/sections/studio-intro";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Inquiry } from "@/components/sections/inquiry";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <FeaturedProjects />
        <StudioIntro />
        <Services />
        <Testimonials />
        <Inquiry />
      </main>
      <SiteFooter />
    </>
  );
}
