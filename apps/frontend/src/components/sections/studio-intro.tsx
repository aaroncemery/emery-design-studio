import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import {
  Placeholder,
  type PlaceholderVariant,
} from "@/components/primitives/placeholder";
import { Reveal } from "@/components/primitives/reveal";
import type { SanityImage, StudioIntroSection } from "@/lib/sanity/types";

const FALLBACK_STATS = [
  { value: "12", label: "Years in practice" },
  { value: "48", label: "Homes completed" },
  { value: "6–8", label: "Projects per year" },
];

interface Props {
  data?: StudioIntroSection;
}

function ImageBlock({
  image,
  placeholder,
  aspectRatio,
  sizes,
}: {
  image?: SanityImage;
  placeholder: PlaceholderVariant;
  aspectRatio: number;
  sizes: string;
}) {
  if (image?.asset?.url) {
    return (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
        <Image
          src={image.asset.url}
          alt=""
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={image.asset.metadata.lqip}
          sizes={sizes}
        />
      </div>
    );
  }
  return (
    <Placeholder
      variant={placeholder}
      aspectRatio={aspectRatio}
      className="w-full"
    />
  );
}

export function StudioIntro({ data }: Props) {
  const heading =
    data?.heading ??
    "A small atelier on the water in Kirkland, working slowly and close to the hand.";
  const stats = data?.stats ?? FALLBACK_STATS;
  const layout = data?.imageLayout ?? "mainWithInset";
  const mainImage = data?.images?.[0];
  const insetImage = data?.images?.[1];

  const imagePanel = (
    <Reveal>
      {layout === "mainWithInset" && (
        <div className="relative">
          <ImageBlock
            image={mainImage}
            placeholder="plaster"
            aspectRatio={0.9}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="absolute -bottom-8 -right-6 w-[45%] border-4 border-[#ece8df]"
            aria-hidden="true"
          >
            <ImageBlock
              image={insetImage}
              placeholder="wood"
              aspectRatio={1.0}
              sizes="25vw"
            />
          </div>
        </div>
      )}

      {layout === "sideBySide" && (
        <div className="grid grid-cols-2 gap-3">
          <ImageBlock
            image={mainImage}
            placeholder="plaster"
            aspectRatio={0.75}
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <ImageBlock
            image={insetImage}
            placeholder="wood"
            aspectRatio={0.75}
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}

      {layout === "singleFull" && (
        <ImageBlock
          image={mainImage}
          placeholder="plaster"
          aspectRatio={1.2}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}
    </Reveal>
  );

  return (
    <Section id="studio" className="bg-[#ece8df]" paddingY="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[120px] items-start">
        {/* Left: images */}
        {imagePanel}

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

          <Reveal delay={0.14}>
            <div className="space-y-4 mb-10 font-sans text-[#6b6b66] text-sm leading-relaxed">
              {data?.body ? (
                <PortableText value={data.body} />
              ) : (
                <>
                  <p>
                    We work with a small number of clients at a time — never
                    more than eight — so that every project receives the full
                    weight of our attention. Our process is deliberate,
                    unhurried, and collaborative.
                  </p>
                  <p>
                    Founded in 2014 by Aaron Emery, the studio has spent a
                    decade refining a single idea: that the best interiors are
                    the ones that take time to understand, not just to build.
                  </p>
                </>
              )}
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
