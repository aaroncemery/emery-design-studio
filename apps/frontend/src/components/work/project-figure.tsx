import Image from "next/image";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import type { ProjectImage } from "@/lib/sanity/types";

interface ProjectFigureProps {
  image: ProjectImage;
  /** Width / height. Defaults to the image's own aspect ratio. */
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
  const asset = image.asset;
  if (!asset?.url) return null;
  const aspect = ratio ?? asset.metadata?.dimensions?.aspectRatio ?? 4 / 3;
  const hasCaption = !hideCaption && (image.caption || image.source);

  return (
    <figure className={cn("m-0", className)}>
      <div
        className="relative w-full overflow-hidden bg-[#ece8df]"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={asset.url}
          alt={image.alt}
          fill
          className="object-cover"
          style={
            image.hotspot
              ? {
                  objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`,
                }
              : undefined
          }
          priority={priority}
          placeholder={asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={asset.metadata?.lqip ?? undefined}
          sizes={sizes}
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
