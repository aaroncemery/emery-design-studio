import type { Metadata } from "next";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Rule } from "@/components/primitives/rule";
import { sanityFetch } from "@/lib/sanity/live";
import { ALL_SERVICES_QUERY } from "@/lib/sanity/queries";
import type { Service } from "@/lib/sanity/types";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Services — Emery Design Studio",
  description:
    "Interior design services offered by Emery Design Studio — full renovation, interior architecture, styling, and consultation.",
};

export default async function ServicesPage() {
  const { data } = await sanityFetch({
    query: ALL_SERVICES_QUERY,
    tags: ["service"],
  });
  const services = data as Service[];

  return (
    <main id="main">
      <Section className="bg-[#f6f4ef]" paddingY="xl">
        <MonoLabel className="text-[#1b3a5b] block mb-6">
          Services&nbsp;—&nbsp;How&nbsp;We&nbsp;Work
        </MonoLabel>
        <h1
          className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-16 max-w-2xl"
          style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
        >
          How we&rsquo;re <em>usually</em>
          <br />
          asked to help.
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
