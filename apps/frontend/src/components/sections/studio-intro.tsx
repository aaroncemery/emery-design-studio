import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Reveal } from "@/components/primitives/reveal";
import { StudioIntroContent } from "./studio-intro-content";
import { cleanText } from "@/lib/sanity/utils";
import type { StudioIntroSection } from "@/lib/sanity/types";

// Editor convention: "First line / italic second line". Only break the line
// when both halves have content.
function HeadingLines({ text }: { text: string }) {
  const [first, ...rest] = text.split("/");
  const second = rest.join("/").trim();
  if (!second) return <em>{first.trim()}</em>;
  if (!first.trim()) return <em>{second}</em>;
  return (
    <>
      {first.trim()}&nbsp;/
      <br />
      <em>{second}</em>
    </>
  );
}

interface Props {
  data?: StudioIntroSection;
}

export function StudioIntro({ data }: Props) {
  const heading = cleanText(data?.heading);

  return (
    <Section id="studio" className="bg-[#ece8df]" paddingY="xl">
      <StudioIntroContent
        data={data}
        bodyDelay={0.14}
        statsDelay={0.2}
        header={
          <>
            <Reveal>
              <MonoLabel className="text-[#1b3a5b] block mb-5">
                §&nbsp;03&nbsp;—&nbsp;The&nbsp;Studio
              </MonoLabel>
            </Reveal>

            {heading && (
              <Reveal delay={0.08}>
                <h2
                  className="font-serif text-[#111111] leading-[0.94] tracking-tight mb-8"
                  style={{ fontSize: "clamp(34px, 3.8vw, 56px)" }}
                >
                  <HeadingLines text={heading} />
                </h2>
              </Reveal>
            )}
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
