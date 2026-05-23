import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Placeholder } from "@/components/primitives/placeholder";
import { Reveal } from "@/components/primitives/reveal";

const stats = [
  { value: "12", label: "Years in practice" },
  { value: "48", label: "Homes completed" },
  { value: "6–8", label: "Projects per year" },
];

export function StudioIntro() {
  return (
    <Section id="studio" className="bg-[#ece8df]" paddingY="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[120px] items-start">
        {/* Left: stacked images */}
        <Reveal>
          <div className="relative">
            {/* Main image */}
            <Placeholder
              variant="plaster"
              aspectRatio={0.9}
              className="w-full"
            />
            {/* Inset offset card */}
            <div
              className="absolute -bottom-8 -right-6 w-[45%] border-4 border-[#ece8df]"
              aria-hidden="true"
            >
              <Placeholder
                variant="wood"
                aspectRatio={1.0}
                className="w-full"
              />
            </div>
          </div>
        </Reveal>

        {/* Right: copy + stats */}
        <div className="pt-0 lg:pt-12">
          <Reveal>
            <MonoLabel className="text-[#1b3a5b] block mb-5">
              §&nbsp;03&nbsp;—&nbsp;The&nbsp;Studio
            </MonoLabel>
          </Reveal>

          <Reveal delay={0.08}>
            <h2
              className="font-serif text-[#111111] leading-[0.94] tracking-tight mb-8"
              style={{ fontSize: "clamp(34px, 3.8vw, 56px)" }}
            >
              A small atelier on the water in <em>Kirkland</em>, working slowly
              and close to the hand.
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="space-y-4 mb-10">
              <p className="font-sans text-[#6b6b66] text-sm leading-relaxed">
                We work with a small number of clients at a time — never more
                than eight — so that every project receives the full weight of
                our attention. Our process is deliberate, unhurried, and
                collaborative.
              </p>
              <p className="font-sans text-[#6b6b66] text-sm leading-relaxed">
                Founded in 2014 by Aaron Emery, the studio has spent a decade
                refining a single idea: that the best interiors are the ones
                that take time to understand, not just to build.
              </p>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[rgba(17,17,17,0.12)]">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span
                    className="font-serif italic text-[#1b3a5b] leading-none block"
                    style={{ fontSize: "clamp(40px, 4vw, 56px)" }}
                  >
                    {stat.value}
                  </span>
                  <MonoLabel className="text-[#9a968d] mt-2 block text-[9px] leading-snug">
                    {stat.label}
                  </MonoLabel>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-10">
              <Link
                href="/studio"
                className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
              >
                About the studio
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
