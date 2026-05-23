import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Rule } from "@/components/primitives/rule";
import { Reveal } from "@/components/primitives/reveal";

interface Service {
  number: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
}

const services: Service[] = [
  {
    number: "/01",
    title: "Full Renovation",
    description:
      "Ground-up and gut renovations for houses that need more than a refresh. We take on the structure, the light, the flow — everything from permits to the final objects.",
    tags: ["Planning", "Construction", "Oversight"],
    href: "/services",
  },
  {
    number: "/02",
    title: "Interior Architecture",
    description:
      "Joinery, plaster, stone, and steel. The fixed elements that give a room its character and age well with the people who live there.",
    tags: ["Millwork", "Materials", "Details"],
    href: "/services",
  },
  {
    number: "/03",
    title: "Styling & Furnishing",
    description:
      "Considered furnishing and placement. Everything from rugs and custom upholstery to the particular lamp on a particular side table.",
    tags: ["Furniture", "Objects", "Textiles"],
    href: "/services",
  },
  {
    number: "/04",
    title: "Consultation",
    description:
      "Half-day and full-day sessions for clients who need direction, not a contractor. We help you see what you have and decide what to do with it.",
    tags: ["Strategy", "Sourcing", "Review"],
    href: "/services",
  },
];

function ServiceRow({ service, index }: { service: Service; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <Link
        href={service.href}
        className="group block"
        aria-label={service.title}
      >
        <Rule />
        <div className="grid grid-cols-[80px_1fr_2fr_1fr_auto] gap-x-8 py-7 items-center transition-colors duration-300 hover:bg-white px-4 -mx-4">
          {/* Number */}
          <span
            className="font-serif italic text-[#9a968d] group-hover:text-[#1b3a5b] transition-colors duration-300"
            style={{ fontSize: "clamp(32px, 3vw, 48px)" }}
            aria-hidden="true"
          >
            {service.number}
          </span>

          {/* Title */}
          <h3
            className="font-serif text-[#111111] leading-tight"
            style={{ fontSize: "clamp(22px, 2.4vw, 34px)" }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p className="font-sans text-[#6b6b66] text-[13px] leading-relaxed hidden md:block">
            {service.description}
          </p>

          {/* Tags */}
          <div className="hidden lg:flex flex-col gap-1.5">
            {service.tags.map((tag) => (
              <MonoLabel key={tag} className="text-[#9a968d] text-[9px]">
                —&nbsp;{tag}
              </MonoLabel>
            ))}
          </div>

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

export function Services() {
  return (
    <Section id="services" className="bg-[#f6f4ef]" paddingY="xl">
      {/* Section header */}
      <Reveal>
        <div className="mb-16">
          <MonoLabel className="text-[#1b3a5b] block mb-4">
            §&nbsp;04&nbsp;—&nbsp;Services
          </MonoLabel>
          <h2
            className="font-serif text-[#111111] leading-[0.92] tracking-tight max-w-xl"
            style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
          >
            How we&rsquo;re <em>usually</em> asked to help.
          </h2>
        </div>
      </Reveal>

      {/* Service rows */}
      <div>
        {services.map((service, i) => (
          <ServiceRow key={service.number} service={service} index={i} />
        ))}
        <Rule />
      </div>
    </Section>
  );
}
