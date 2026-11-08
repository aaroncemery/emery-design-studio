import type { Project, ProjectImage } from "@/lib/sanity/types";

export interface SheetImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  lqip: string | null;
  width: number | null;
  height: number | null;
}

type Candidate = Pick<ProjectImage, "asset"> &
  Partial<Pick<ProjectImage, "alt" | "caption">>;

/** Every photograph on the page, in reading order, de-duplicated by asset. */
export function collectProjectImages(project: Project): SheetImage[] {
  const found: Candidate[] = [];

  if (project.coverImage) {
    found.push({ asset: project.coverImage.asset, alt: project.title });
  }
  for (const block of project.body ?? []) {
    if (block._type === "storyImage" || block._type === "storyInset") {
      found.push(block.image);
    } else if (block._type === "storyPair") {
      found.push(...(block.images ?? []));
    } else if (block._type === "image") {
      found.push({ asset: block.asset });
    }
  }
  for (const note of project.makingOf?.notes ?? []) {
    found.push(...(note.images ?? []));
  }
  if (project.makingOf?.maker?.portrait) {
    found.push(project.makingOf.maker.portrait);
  }
  for (const img of project.gallery ?? []) found.push({ asset: img.asset });

  const seen = new Set<string>();
  const out: SheetImage[] = [];
  for (const c of found) {
    const asset = c.asset;
    if (!asset?.url || seen.has(asset._id)) continue;
    seen.add(asset._id);
    out.push({
      id: asset._id,
      url: asset.url,
      alt: c.alt || project.title,
      caption: c.caption ?? null,
      lqip: asset.metadata?.lqip ?? null,
      width: asset.metadata?.dimensions?.width ?? null,
      height: asset.metadata?.dimensions?.height ?? null,
    });
  }
  return out;
}
