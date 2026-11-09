import Image from "next/image";
import {
  sanityFocalPosition,
  sanityImageSrc,
  type SanityImageInput,
} from "@/lib/sanity/image";

interface SanityPictureProps {
  image: SanityImageInput | null | undefined;
  alt: string;
  /** Required: the rendered width at each breakpoint (drives the srcset). */
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Fills its (relatively positioned) parent with a Sanity image, honouring the
 * crop and hotspot set in Studio and letting Sanity's CDN resize/convert.
 * Renders nothing when the image has no asset.
 */
export function SanityPicture({
  image,
  alt,
  sizes,
  priority,
  className,
  style,
}: SanityPictureProps) {
  if (!image) return null;
  const src = sanityImageSrc(image);
  if (!src) return null;
  const lqip = image.asset?.metadata?.lqip;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className ?? "object-cover"}
      style={{ objectPosition: sanityFocalPosition(image), ...style }}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip ?? undefined}
    />
  );
}
