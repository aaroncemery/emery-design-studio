import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Rule } from "@/components/primitives/rule";
import { Reveal } from "@/components/primitives/reveal";
import type { Service } from "@/lib/sanity/types";

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const displayNumber = service.number ? `/${service.number}` : null;

  return (
    <Reveal delay={index * 0.06}>
      <Link
        href="/services"
        className="group block"
        aria-label={service.title}
        data-cursor-lens="true"
      >
        <Rule />

        {/* Mobile layout: always-expanded, full-width */}
        <div className="flex flex-col gap-2 py-5 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <h3
              className="font-serif text-[#111111] leading-tight"
              style={{ fontSize: "clamp(22px, 6vw, 30px)" }}
            >
              {service.title}
            </h3>
            <span
              aria-hidden="true"
              className="text-[#9a968d] text-lg flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </div>
          {service.description && (
            <p className="font-sans text-[#6b6b66] text-[13px] leading-relaxed">
              {service.description}
            </p>
          )}
        </div>

        {/* Desktop layout: 5-column grid */}
        <div className="hidden md:grid grid-cols-[80px_1fr_2fr_1fr_auto] gap-x-8 py-7 items-center transition-colors duration-300 hover:bg-white px-4 -mx-4">
          {/* Number */}
          <span
            className="font-serif italic text-[#9a968d] group-hover:text-[#1b3a5b] transition-colors duration-300"
            style={{ fontSize: "clamp(32px, 3vw, 48px)" }}
            aria-hidden="true"
          >
            {displayNumber}
          </span>

          {/* Title */}
          <h3
            className="font-serif text-[#111111] leading-tight"
            style={{ fontSize: "clamp(22px, 2.4vw, 34px)" }}
          >
            {service.title}
          </h3>

          {/* Description */}
          {service.description && (
            <p className="font-sans text-[#6b6b66] text-[13px] leading-relaxed">
              {service.description}
            </p>
          )}

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="hidden lg:flex flex-col gap-1.5">
              {service.tags.map((tag) => (
                <MonoLabel key={tag} className="text-[#9a968d] text-[9px]">
                  —&nbsp;{tag}
                </MonoLabel>
              ))}
            </div>
          )}

          {/* Arrow */}
          <span
            aria-hidden="true"
            className="text-[#9a968d] text-lg transition-transform duration-300 group-hover:translate-x-2"
          >
            →
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

interface Props {
  services?: Service[];
  heading?: string;
  subheading?: string;
}

export function Services({ services, heading, subheading }: Props) {
  const hasServices = services && services.length > 0;

  return (
    <Section id="services" className="bg-[#f6f4ef]" paddingY="xl">
      <Reveal>
        <div className="mb-16">
          <MonoLabel className="text-[#1b3a5b] block mb-4">
            §&nbsp;04&nbsp;—&nbsp;Services
          </MonoLabel>
          <h2
            className="font-serif text-[#111111] leading-[0.92] tracking-tight max-w-xl"
            style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
          >
            {heading ?? (
              <>
                How we&rsquo;re <em>usually</em> asked to help.
              </>
            )}
          </h2>
          {subheading && (
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed mt-4 max-w-xl">
              {subheading}
            </p>
          )}
        </div>
      </Reveal>

      {hasServices ? (
        <div>
          {services.map((service, i) => (
            <ServiceRow key={service._id} service={service} index={i} />
          ))}
          <Rule />
        </div>
      ) : (
        <p className="font-sans text-[#9a968d] text-sm">
          Full service details coming soon.
        </p>
      )}
    </Section>
  );
}
