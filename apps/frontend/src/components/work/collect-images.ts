import type { SanityImageInput } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";

export interface SheetImage {
  id: string;
  image: SanityImageInput;
  alt: string;
  caption: string | null;
}

type Candidate = SanityImageInput & { alt?: string; caption?: string | null };

/** Every photograph on the page, in reading order, de-duplicated by asset. */
export function collectProjectImages(project: Project): SheetImage[] {
  const found: Candidate[] = [];

  if (project.coverImage) {
    found.push({ ...project.coverImage, alt: project.title });
  }
  for (const block of project.body ?? []) {
    if (block._type === "storyImage" || block._type === "storyInset") {
      found.push(block.image);
    } else if (block._type === "storyPair") {
      found.push(...(block.images ?? []));
    } else if (block._type === "image") {
      found.push({
        asset: block.asset,
        hotspot: block.hotspot,
        crop: block.crop,
      });
    }
  }
  for (const note of project.makingOf?.notes ?? []) {
    found.push(...(note.images ?? []));
  }
  if (project.makingOf?.maker?.portrait) {
    found.push(project.makingOf.maker.portrait);
  }
  for (const img of project.gallery ?? []) found.push(img);

  const seen = new Set<string>();
  const out: SheetImage[] = [];
  for (const c of found) {
    const asset = c.asset;
    if (!asset?.url || seen.has(asset._id)) continue;
    seen.add(asset._id);
    out.push({
      id: asset._id,
      image: c,
      alt: c.alt || project.title,
      caption: c.caption ?? null,
    });
  }
  return out;
}
