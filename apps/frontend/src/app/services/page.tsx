import type { Metadata } from "next";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Rule } from "@/components/primitives/rule";
import { sanityFetch } from "@/lib/sanity/live";
import { ALL_SERVICES_QUERY, SERVICES_PAGE_QUERY } from "@/lib/sanity/queries";
import type {
  Service,
  ServicesPage as ServicesPageData,
} from "@/lib/sanity/types";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Services — Emery Design Studio",
  description:
    "Interior design services offered by Emery Design Studio — full renovation, interior architecture, styling, and consultation.",
};

export default async function ServicesPage() {
  const [{ data: servicesData }, { data: pageData }] = await Promise.all([
    sanityFetch({ query: ALL_SERVICES_QUERY, tags: ["service"] }),
    sanityFetch({ query: SERVICES_PAGE_QUERY, tags: ["servicesPage"] }),
  ]);
  const services = servicesData as Service[];
  const page = pageData as ServicesPageData | null;
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

  return (
    <main id="main">
      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <MonoLabel className="text-[#1b3a5b] block mb-6">
          {header?.eyebrow ?? "Services — How We Work"}
        </MonoLabel>
        <h1
          className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-16 max-w-2xl"
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

        {services && services.length > 0 ? (
          <div>
            {services.map((service, i) => (
              <div key={service._id}>
                <Rule />
                <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_2fr_1fr] gap-x-8 py-10 items-start">
                  {service.number && (
                    <span
                      className="font-serif italic text-[#9a968d]"
                      style={{ fontSize: "clamp(32px, 3vw, 48px)" }}
                      aria-hidden="true"
                    >
                      /{service.number}
                    </span>
                  )}
                  <h2
                    className="font-serif text-[#111111] leading-tight"
                    style={{ fontSize: "clamp(22px, 2.4vw, 34px)" }}
                  >
                    {service.title}
                  </h2>
                  {service.description && (
                    <p className="font-sans text-[#6b6b66] text-[14px] leading-relaxed mt-2 md:mt-0">
                      {service.description}
                    </p>
                  )}
                  {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-2 md:mt-0">
                      {service.tags.map((tag) => (
                        <MonoLabel
                          key={tag}
                          className="text-[#9a968d] text-[9px]"
                        >
                          —&nbsp;{tag}
                        </MonoLabel>
                      ))}
                    </div>
                  )}
                </div>
                {i === services.length - 1 && <Rule />}
              </div>
            ))}
          </div>
        ) : (
          <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm">
            Full service details coming soon.
          </p>
        )}
      </Section>
    </main>
  );
}
