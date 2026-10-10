import Image from "next/image";
import { stegaClean } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { MonoLabel } from "@/components/primitives/mono-label";
import {
  Placeholder,
  type PlaceholderVariant,
} from "@/components/primitives/placeholder";
import { Reveal } from "@/components/primitives/reveal";
import type { SanityImage, StudioIntroSection } from "@/lib/sanity/types";

interface StudioIntroContentData {
  body?: StudioIntroSection["body"];
  stats?: Array<{ label: string | null; value: string | null }> | null;
  imageLayout?: string | null;
  images?: SanityImage[] | null;
}

interface Props {
  data?: StudioIntroContentData;
  fallbackBody?: React.ReactNode;
  fallbackStats?: Array<{ label: string; value: string }>;
  /** Rendered at the top of the copy column, above the body text — e.g. an eyebrow + heading. */
  header?: React.ReactNode;
  /** Rendered at the bottom of the copy column, after the stats — e.g. a link. */
  footer?: React.ReactNode;
  bodyDelay?: number;
  statsDelay?: number;
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
          blurDataURL={image.asset.metadata?.lqip ?? undefined}
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

// Shared body/stats/image-panel rendering for the studio-intro field shape —
// reused by the home page teaser (StudioIntro) and the full /studio page, so
// both consume one implementation of the imageLayout switch.
export function StudioIntroContent({
  data,
  fallbackBody,
  fallbackStats,
  header,
  footer,
  bodyDelay = 0,
  statsDelay = 0,
}: Props) {
  const stats = data?.stats ?? fallbackStats ?? [];
  const layout = stegaClean(data?.imageLayout) ?? "mainWithInset";
  const mainImage = data?.images?.[0];
  const insetImage = data?.images?.[1];

  const imagePanel = (
    <Reveal>
      {layout === "mainWithInset" && (
        <div className="relative lg:pb-8">
          <ImageBlock
            image={mainImage}
            placeholder="plaster"
            aspectRatio={0.9}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="hidden lg:block absolute -bottom-8 -right-6 w-[45%] border-4 border-[#ece8df]"
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
        <div className="relative lg:pb-16">
          <div className="w-full lg:w-[68%]">
            <ImageBlock
              image={mainImage}
              placeholder="plaster"
              aspectRatio={0.85}
              sizes="(max-width: 1024px) 100vw, 34vw"
            />
          </div>
          <div className="hidden lg:block lg:absolute lg:-bottom-12 lg:-right-8 lg:w-[52%] lg:border-4 lg:border-[#ece8df]">
            <ImageBlock
              image={insetImage}
              placeholder="wood"
              aspectRatio={0.85}
              sizes="(max-width: 1024px) 100vw, 26vw"
            />
          </div>
        </div>
      )}

      {layout === "singleFull" && (
        <ImageBlock
          image={mainImage}
          placeholder="plaster"
          aspectRatio={0.9}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}
    </Reveal>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[120px] items-start">
      {imagePanel}

      <div className="pt-0 lg:pt-12">
        {header}
        <Reveal delay={bodyDelay}>
          <div className="space-y-4 mb-10 font-sans text-[#6b6b66] text-sm leading-relaxed">
            {data?.body ? <PortableText value={data.body} /> : fallbackBody}
          </div>
        </Reveal>

        {stats.length > 0 && (
          <Reveal delay={statsDelay}>
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-[rgba(17,17,17,0.12)]">
              {stats.map((stat) => (
                <div key={`${stat.label}-${stat.value}`}>
                  <span
                    className="font-serif italic text-[#1b3a5b] leading-none block"
                    style={{ fontSize: "clamp(40px, 4vw, 56px)" }}
                  >
                    {stat.value}
                  </span>
                  <MonoLabel className="text-[#9a968d] mt-2 block text-[11px] md:text-[9px] leading-snug">
                    {stat.label}
                  </MonoLabel>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {footer}
      </div>
    </div>
  );
}
