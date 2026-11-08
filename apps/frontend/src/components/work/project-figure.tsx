import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import { SanityPicture } from "@/components/primitives/sanity-picture";
import { sanityImageAspect, type SanityImageInput } from "@/lib/sanity/image";

/** `sizes` for an image that spans the page's content width (see FRAME). */
export const FULL_WIDTH_SIZES =
  "(min-width: 1480px) 1368px, (min-width: 1024px) calc(100vw - 7rem), (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)";

interface ProjectFigureProps {
  image: SanityImageInput & {
    alt: string;
    caption?: string | null;
    source?: string | null;
  };
  /** Width / height. Defaults to the image's own (post-crop) aspect ratio. */
  ratio?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  hideCaption?: boolean;
}

/** An editor-supplied image with its caption and optional source line. */
export function ProjectFigure({
  image,
  ratio,
  sizes,
  className,
  priority,
  hideCaption,
}: ProjectFigureProps) {
  if (!image.asset?.url) return null;
  const aspect = ratio ?? sanityImageAspect(image) ?? 4 / 3;
  const hasCaption = !hideCaption && (image.caption || image.source);

  return (
    <figure className={cn("m-0", className)}>
      <div
        className="relative w-full overflow-hidden bg-[#ece8df]"
        style={{ aspectRatio: aspect }}
      >
        <SanityPicture
          image={image}
          alt={image.alt}
          sizes={sizes}
          priority={priority}
        />
      </div>
      {hasCaption && (
        <figcaption className="mt-3.5 flex flex-col gap-1.5 font-sans text-[13px] leading-[1.55] text-[#6b6b66]">
          {image.caption && <span>{image.caption}</span>}
          {image.source && (
            <MonoLabel className="text-[9px] text-[#9a968d]">
              {image.source}
            </MonoLabel>
          )}
        </figcaption>
      )}
    </figure>
  );
}
