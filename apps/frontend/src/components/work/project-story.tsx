import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { sanityImageAspect } from "@/lib/sanity/image";
import { FIG, figSizes, figWidths } from "@/lib/work/layout";
import { BesideText } from "./beside-text";
import { COLUMN, FRAME, bodyText } from "./frame";
import { FULL_WIDTH_SIZES, ProjectFigure } from "./project-figure";
import type { ProjectBodyBlock } from "@/lib/sanity/types";

export { FRAME, COLUMN } from "./frame";

type Block<T extends ProjectBodyBlock["_type"]> = Extract<
  ProjectBodyBlock,
  { _type: T }
>;

/**
 * An image in the reading column. A portrait would be ~1.5 screens tall at
 * column width, so it's sized by area on the column's left edge with its
 * caption in the empty space beside it; a landscape fills the column.
 */
export function ColumnImage({
  image,
}: {
  image: ComponentProps<typeof ProjectFigure>["image"];
}) {
  const ratio = sanityImageAspect(image) ?? 4 / 3;
  const portrait = ratio < 1;
  const width = portrait
    ? figWidths(ratio, FIG.soloArea, FIG.soloMaxW)
    : undefined;
  return (
    <div data-block="side" className={FRAME}>
      <ProjectFigure
        image={image}
        className={COLUMN}
        width={width}
        sideCaption={portrait}
        sizes={
          width
            ? figSizes(width)
            : "(min-width: 1024px) 50vw, calc(100vw - 3rem)"
        }
      />
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <div data-block="text" className={FRAME}>
        <p className={cn(bodyText, COLUMN)}>{children}</p>
      </div>
    ),
    lead: ({ children }) => (
      <div data-block="text" className={FRAME}>
        <p
          className={cn(
            COLUMN,
            "text-pretty font-serif text-[clamp(22px,2.2vw,30px)] font-light leading-[1.35] text-[#2a2a2a]",
          )}
        >
          {children}
        </p>
      </div>
    ),
    h2: ({ children }) => (
      <div data-block="heading" className={FRAME}>
        <h2
          className={cn(
            COLUMN,
            "font-serif text-[clamp(26px,2.4vw,34px)] font-light leading-[1.1] text-[#111111]",
          )}
        >
          {children}
        </h2>
      </div>
    ),
  },
  types: {
    storyImage: ({ value }: { value: Block<"storyImage"> }) => {
      if (value.layout !== "column") {
        return (
          <div data-block="big" className={FRAME}>
            <ProjectFigure
              image={value.image}
              className="lg:col-span-12"
              sizes={FULL_WIDTH_SIZES}
            />
          </div>
        );
      }
      return <ColumnImage image={value.image} />;
    },
    storyInset: ({ value }: { value: Block<"storyInset"> }) => (
      <BesideText
        image={value.image}
        text={value.text}
        side={value.side === "left" ? "left" : "right"}
      />
    ),
    storyPair: ({ value }: { value: Block<"storyPair"> }) => (
      <div data-block="big" className={FRAME}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-12">
          {value.images?.map((image) => (
            <ProjectFigure
              key={image.asset?._id ?? image.alt}
              image={image}
              ratio={4 / 5}
              sizes="(min-width: 640px) 50vw, calc(100vw - 3rem)"
            />
          ))}
        </div>
      </div>
    ),
    pullQuote: ({ value }: { value: Block<"pullQuote"> }) => (
      <div data-block="quote" className={FRAME}>
        <blockquote className="m-0 text-balance text-center font-serif text-[clamp(28px,3vw,46px)] font-light italic leading-[1.15] tracking-[-0.01em] text-[#111111] lg:col-span-8 lg:col-start-3">
          {value.text}
        </blockquote>
      </div>
    ),
    // Legacy plain image from before the story types existed.
    image: ({ value }: { value: Block<"image"> }) =>
      value.asset?.url ? (
        <ColumnImage
          image={{
            asset: value.asset,
            hotspot: value.hotspot ?? null,
            crop: value.crop ?? null,
            alt: "",
            caption: null,
            source: null,
          }}
        />
      ) : null,
  },
};

export function ProjectStory({ body }: { body: ProjectBodyBlock[] | null }) {
  if (!body || body.length === 0) return null;
  return (
    <section className="bg-[#f6f4ef] py-12 md:py-20">
      <PortableText value={body} components={components} />
    </section>
  );
}
