import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { cn } from "@/lib/utils";
import { ProjectFigure } from "./project-figure";
import type { ProjectBodyBlock } from "@/lib/sanity/types";

/** Shared page frame: 12-col grid inside the site's max width. */
export const FRAME =
  "mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-x-6 px-6 md:px-10 lg:grid-cols-12 lg:px-14";
/** The reading column, offset from the left like the design. */
export const COLUMN = "lg:col-span-6 lg:col-start-4";

type Block<T extends ProjectBodyBlock["_type"]> = Extract<
  ProjectBodyBlock,
  { _type: T }
>;

const bodyText =
  "text-pretty font-serif text-[17px] font-normal leading-[1.7] text-[#2a2a2a]";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <div className={cn(FRAME, "py-3")}>
        <p className={cn(bodyText, COLUMN)}>{children}</p>
      </div>
    ),
    lead: ({ children }) => (
      <div className={cn(FRAME, "py-3")}>
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
      <div className={cn(FRAME, "pb-2 pt-10")}>
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
    storyImage: ({ value }: { value: Block<"storyImage"> }) =>
      value.layout === "column" ? (
        <div className={cn(FRAME, "py-8")}>
          <ProjectFigure
            image={value.image}
            className={COLUMN}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      ) : (
        <div className={cn(FRAME, "py-10 md:py-14")}>
          <ProjectFigure
            image={value.image}
            className="lg:col-span-12"
            sizes="100vw"
          />
        </div>
      ),
    storyInset: ({ value }: { value: Block<"storyInset"> }) => {
      const left = value.side === "left";
      return (
        <div className={cn(FRAME, "items-start gap-y-6 py-8 md:py-12")}>
          <p
            className={cn(
              bodyText,
              "lg:col-span-5 lg:col-start-4 lg:row-start-1",
            )}
          >
            {value.text}
          </p>
          <ProjectFigure
            image={value.image}
            className={cn(
              "max-w-[360px] lg:row-start-1 lg:max-w-none",
              left
                ? "lg:col-span-2 lg:col-start-1"
                : "lg:col-span-3 lg:col-start-10",
            )}
            sizes="(min-width: 1024px) 25vw, 70vw"
          />
        </div>
      );
    },
    storyPair: ({ value }: { value: Block<"storyPair"> }) => (
      <div className={cn(FRAME, "py-10 md:py-14")}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-12">
          {value.images?.map((image) => (
            <ProjectFigure
              key={image.asset?._id ?? image.alt}
              image={image}
              ratio={4 / 5}
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
      </div>
    ),
    pullQuote: ({ value }: { value: Block<"pullQuote"> }) => (
      <div className={cn(FRAME, "py-14 md:py-20")}>
        <blockquote className="m-0 text-balance text-center font-serif text-[clamp(28px,3vw,46px)] font-light italic leading-[1.15] tracking-[-0.01em] text-[#111111] lg:col-span-8 lg:col-start-3">
          {value.text}
        </blockquote>
      </div>
    ),
    // Legacy plain image from before the story types existed.
    image: ({ value }: { value: Block<"image"> }) =>
      value.asset?.url ? (
        <div className={cn(FRAME, "py-8")}>
          <ProjectFigure
            image={{
              asset: value.asset,
              hotspot: null,
              crop: null,
              alt: "",
              caption: null,
              source: null,
            }}
            className={COLUMN}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
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
