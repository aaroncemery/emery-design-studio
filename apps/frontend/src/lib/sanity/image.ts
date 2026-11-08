import { urlFor } from "./client";

/**
 * The shape every image query projects (see `imageFields` in queries.ts):
 * the dereferenced asset plus the editor's crop and hotspot from Studio.
 */
export interface SanityImageInput {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      } | null;
      lqip?: string | null;
    } | null;
  } | null;
  hotspot?: { x?: number | null; y?: number | null } | null;
  crop?: {
    top?: number | null;
    bottom?: number | null;
    left?: number | null;
    right?: number | null;
  } | null;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function cropBox(image: SanityImageInput) {
  const left = image.crop?.left ?? 0;
  const right = image.crop?.right ?? 0;
  const top = image.crop?.top ?? 0;
  const bottom = image.crop?.bottom ?? 0;
  return { left, right, top, bottom, w: 1 - left - right, h: 1 - top - bottom };
}

/**
 * Base image URL with the editor's crop applied (as a `rect` param) and no
 * size. The global loader (`image-loader.ts`) adds width, quality and format
 * for each srcset entry, so the Sanity CDN does all resizing and conversion.
 */
export function sanityImageSrc(image: SanityImageInput): string | null {
  if (!image.asset?._id) return null;
  return urlFor({
    asset: { _ref: image.asset._id },
    crop: image.crop ?? undefined,
  } as Parameters<typeof urlFor>[0]).url();
}

/** Width / height of the image *after* the editor's crop. */
export function sanityImageAspect(image: SanityImageInput): number | null {
  const dims = image.asset?.metadata?.dimensions;
  if (!dims) return null;
  const { w, h } = cropBox(image);
  if (w <= 0 || h <= 0) return dims.aspectRatio;
  return (dims.width * w) / (dims.height * h);
}

/**
 * CSS `object-position` that keeps the editor's hotspot in frame when the
 * image is cropped further by its container (object-fit: cover). The hotspot
 * is stored relative to the original image, so it's re-expressed relative to
 * the cropped region.
 */
export function sanityFocalPosition(
  image: SanityImageInput,
): string | undefined {
  const point = focalPoint(image);
  if (!point) return undefined;
  return `${(point.x * 100).toFixed(1)}% ${(point.y * 100).toFixed(1)}%`;
}

function focalPoint(image: SanityImageInput) {
  const { hotspot } = image;
  if (hotspot?.x == null || hotspot?.y == null) return null;
  const { left, top, w, h } = cropBox(image);
  if (w <= 0 || h <= 0) return null;
  return {
    x: clamp01((hotspot.x - left) / w),
    y: clamp01((hotspot.y - top) / h),
  };
}

/**
 * Social-share image: 1200×630, cropped around the hotspot, as JPEG (the
 * widest crawler support). Used for Open Graph / Twitter cards.
 */
export function sanityOgImageUrl(image: SanityImageInput): string | null {
  if (!image.asset?._id) return null;
  let builder = urlFor({
    asset: { _ref: image.asset._id },
  } as Parameters<typeof urlFor>[0])
    .width(1200)
    .height(630)
    .fit("crop")
    .format("jpg")
    .quality(80);
  // The builder skips the editor's crop once a focal-point crop is requested,
  // so apply it explicitly as a pixel rect first.
  const dims = image.asset.metadata?.dimensions;
  if (dims && image.crop) {
    const { left, top, w, h } = cropBox(image);
    builder = builder.rect(
      Math.round(left * dims.width),
      Math.round(top * dims.height),
      Math.round(w * dims.width),
      Math.round(h * dims.height),
    );
  }
  const point = focalPoint(image);
  if (point) builder = builder.crop("focalpoint").focalPoint(point.x, point.y);
  return builder.url();
}
