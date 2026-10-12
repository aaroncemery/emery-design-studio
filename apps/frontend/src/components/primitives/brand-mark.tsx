import Image from "next/image";
import type { SanityImage } from "@/lib/sanity/types";

// Renders a real logo image once one exists in Sanity, falling back to the
// text wordmark until then — so uploading a logo later needs no code change.
export function BrandMark({
  logo,
  label,
  textClassName,
  imageHeight,
}: {
  logo?: SanityImage | null;
  label: string;
  textClassName: string;
  imageHeight: number;
}) {
  if (logo?.asset?.url) {
    const aspectRatio = logo.asset.metadata?.dimensions?.aspectRatio ?? 1;
    return (
      <Image
        src={logo.asset.url}
        alt={label}
        height={imageHeight}
        width={Math.round(imageHeight * aspectRatio)}
      />
    );
  }
  return <span className={textClassName}>{label}</span>;
}
