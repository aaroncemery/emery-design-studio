/**
 * Global `next/image` loader (see `images.loaderFile` in next.config.ts).
 *
 * Sanity's image CDN already resizes and re-encodes on the fly, so we let it
 * do that directly instead of routing through Next's optimizer (which would
 * first download the full-size original). Every srcset entry gets:
 *   w       the requested width
 *   fit=max never upscale past the original
 *   auto    serve AVIF/WebP to browsers that accept it
 *   q       quality
 * Anything that isn't a Sanity CDN URL is returned untouched.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  if (url.hostname !== "cdn.sanity.io") return src;

  url.searchParams.set("w", String(width));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}
