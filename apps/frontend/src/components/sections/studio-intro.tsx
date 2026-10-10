import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Reveal } from "@/components/primitives/reveal";
import { StudioIntroContent } from "./studio-intro-content";
import type { StudioIntroSection } from "@/lib/sanity/types";

const FALLBACK_STATS = [
  { value: "12", label: "Years in practice" },
  { value: "48", label: "Homes completed" },
  { value: "6–8", label: "Projects per year" },
];

const FALLBACK_BODY = (
  <>
    <p>
      We work with a small number of clients at a time — never more than eight —
      so that every project receives the full weight of our attention. Our
      process is deliberate, unhurried, and collaborative.
    </p>
    <p>
      Founded in 2014 by Aaron Emery, the studio has spent a decade refining a
      single idea: that the best interiors are the ones that take time to
      understand, not just to build.
    </p>
  </>
);

interface Props {
  data?: StudioIntroSection;
}

export function StudioIntro({ data }: Props) {
  const heading =
    data?.heading ??
    "A small atelier on the water in Kirkland, working slowly and close to the hand.";

  return (
    <Section id="studio" className="bg-[#ece8df]" paddingY="xl">
      <StudioIntroContent
        data={data}
        fallbackBody={FALLBACK_BODY}
        fallbackStats={FALLBACK_STATS}
        bodyDelay={0.14}
        statsDelay={0.2}
        header={
          <>
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
                {heading.includes("/") ? (
                  <>
                    {heading.split("/")[0].trim()}&nbsp;/
                    <br />
                    <em>{heading.split("/").slice(1).join("/").trim()}</em>
                  </>
                ) : (
                  <em>{heading}</em>
                )}
              </h2>
            </Reveal>
          </>
        }
        footer={
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
        }
      />
    </Section>
  );
}
