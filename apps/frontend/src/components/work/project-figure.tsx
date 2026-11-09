import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import { SanityPicture } from "@/components/primitives/sanity-picture";
import { sanityImageAspect, type SanityImageInput } from "@/lib/sanity/image";
import type { FigWidth } from "@/lib/work/layout";

/** `sizes` for an image that spans the page's content width (see FRAME). */
export const FULL_WIDTH_SIZES =
  "(min-width: 1480px) 1368px, (min-width: 1024px) calc(100vw - 7rem), (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)";

/** Width from `--wm` (stacked) / `--wd` (lg+), never taller than 82vh. */
const WIDTH_CLASS =
  "w-[min(var(--wm),100%)] lg:w-[min(var(--wd),calc(82vh*var(--r)),100%)]";

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
  /** Area-based width. Without it the figure fills its container. */
  width?: FigWidth;
  /** Lone portrait: caption sits beside the image at lg+ instead of below. */
  sideCaption?: boolean;
  /** Cap the image box at 82vh (crops with object-fit: cover). Default true. */
  capHeight?: boolean;
}

/** An editor-supplied image with its caption and optional source line. */
export function ProjectFigure({
  image,
  ratio,
  sizes,
  className,
  priority,
  hideCaption,
  width,
  sideCaption,
  capHeight = true,
}: ProjectFigureProps) {
  if (!image.asset?.url) return null;
  const aspect = ratio ?? sanityImageAspect(image) ?? 4 / 3;
  const hasCaption = !hideCaption && (image.caption || image.source);
  const vars = width
    ? ({
        "--wd": `${width.desktop}px`,
        "--wm": `${width.mobile}px`,
        "--r": aspect,
      } as React.CSSProperties)
    : undefined;

  return (
    <figure
      className={cn(
        "m-0",
        sideCaption &&
          "flex flex-col gap-3.5 lg:flex-row lg:items-end lg:gap-8",
        width && !sideCaption && WIDTH_CLASS,
        className,
      )}
      style={vars}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden bg-[#ece8df]",
          capHeight && "max-h-[82vh]",
          width && sideCaption && WIDTH_CLASS,
        )}
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
        <figcaption
          className={cn(
            "flex flex-col gap-1.5 font-sans text-[13px] leading-[1.55] text-[#6b6b66]",
            sideCaption ? "lg:min-w-40 lg:flex-1" : "mt-3.5",
          )}
        >
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
