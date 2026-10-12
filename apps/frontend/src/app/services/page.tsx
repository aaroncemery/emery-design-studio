import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicesFolio } from "@/components/sections/services-folio";
import { sanityFetch } from "@/lib/sanity/live";
import {
  ALL_SERVICES_QUERY,
  SERVICES_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/sanity/build-metadata";
import { serviceJsonLd } from "@/lib/structured-data";
import type {
  Service,
  ServicesPage as ServicesPageData,
  SiteSettings,
} from "@/lib/sanity/types";

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: pageData }, { data: siteSettingsData }] = await Promise.all([
    sanityFetch({ query: SERVICES_PAGE_QUERY, tags: ["servicesPage"] }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
  ]);
  const page = pageData as ServicesPageData | null;
  const siteSettings = siteSettingsData as SiteSettings | null;

  return buildMetadata({
    pageSeo: page?.seo,
    siteSettings,
    fallbackTitle: "Services",
    fallbackDescription:
      "Interior design services offered by Emery Design Studio — interior architecture, styling & furnishing, and consultation.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const [
    { data: servicesData },
    { data: pageData },
    { data: siteSettingsData },
  ] = await Promise.all([
    sanityFetch({ query: ALL_SERVICES_QUERY, tags: ["service"] }),
    sanityFetch({ query: SERVICES_PAGE_QUERY, tags: ["servicesPage"] }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
  ]);
  const services = servicesData as Service[];
  const page = pageData as ServicesPageData | null;
  const siteSettings = siteSettingsData as SiteSettings | null;
  const header = page?.header;

  // Split on "/" — editor convention: "Heading / italic second line"
  let headingLine1 = "How we're";
  let headingLine2 = "usually asked to help.";
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

  const hasServices = services && services.length > 0;

  return (
    <main id="main">
      {hasServices &&
        services.map((service) => (
          <JsonLd
            key={service._id}
            data={serviceJsonLd(service, siteSettings?.siteName)}
          />
        ))}

      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <div className="max-w-3xl mb-20 lg:mb-28">
          <MonoLabel className="text-[#1b3a5b] block mb-6">
            {header?.eyebrow ?? "Services — How We Work"}
          </MonoLabel>
          <h1
            className="font-serif text-[#111111] leading-[0.92] tracking-tight max-w-2xl"
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

          {hasServices && (
            <ol className="lg:hidden max-w-[440px] mt-9">
              {services.map((service) => (
                <li key={service._id}>
                  <Link
                    href={`#${service.slug}`}
                    className="grid grid-cols-[32px_1fr_auto] items-center gap-x-3 py-3 min-h-12 border-t border-[rgba(17,17,17,0.12)] group"
                  >
                    <MonoLabel className="text-[#1b3a5b]">
                      {service.number}
                    </MonoLabel>
                    <MonoLabel className="text-[#111111]">
                      {service.title}
                    </MonoLabel>
                    <span
                      aria-hidden="true"
                      className="text-[#9a968d] text-sm transition-transform duration-300 group-hover:translate-y-0.5"
                    >
                      ↓
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>

        {hasServices ? (
          <ServicesFolio services={services} />
        ) : (
          <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm">
            Full service details coming soon.
          </p>
        )}
      </Section>

      <Section className="bg-[#ece8df]" paddingY="lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2
            className="font-serif text-[#111111] leading-[0.95] tracking-tight max-w-xl"
            style={{ fontSize: "clamp(28px, 3.4vw, 48px)" }}
          >
            Not sure which fits? <em>Start a conversation.</em>
          </h2>
          <CTA href="/#contact" variant="accent">
            Begin an inquiry
          </CTA>
        </div>
      </Section>
    </main>
  );
}
