import Image from "next/image";
import Link from "next/link";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import { COLUMN, FRAME } from "./project-story";
import type { Project, ProjectNavItem } from "@/lib/sanity/types";

export function ProjectCredits({
  project,
  studioName,
}: {
  project: Project;
  studioName: string | null;
}) {
  const maker = project.makingOf?.maker;
  const sentences = [
    studioName && `Interior design and styling by ${studioName}.`,
    project.photoCredit && `Photography by ${project.photoCredit}.`,
    maker?.name &&
      `${maker.piece || "Made"} by ${[maker.name, maker.location].filter(Boolean).join(", ")}.`,
  ].filter(Boolean);
  if (sentences.length === 0) return null;
  const meta = [project.category, project.location, project.year]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="bg-[#f6f4ef] pb-16 md:pb-24">
      <div className={FRAME}>
        <div className={COLUMN}>
          <MonoLabel className="block border-b border-[rgba(17,17,17,0.12)] pb-4 text-[#111111]">
            Credits
          </MonoLabel>
          <p className="mt-4 font-sans text-[15px] leading-[1.7] text-[#2a2a2a]">
            {sentences.join(" ")}
          </p>
          {meta && (
            <MonoLabel className="mt-4 block text-[#9a968d]">{meta}</MonoLabel>
          )}
        </div>
      </div>
    </section>
  );
}

/** Teaser for the next project in /work order (wraps to the first). */
export function NextProject({ next }: { next: ProjectNavItem }) {
  return (
    <section className="bg-[#f6f4ef]">
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10 lg:px-14">
        <Link
          href={`/work/${next.slug}`}
          className="group grid grid-cols-1 items-center gap-8 border-t border-[rgba(17,17,17,0.12)] py-10 md:grid-cols-2 md:gap-16"
        >
          <div className="flex flex-col gap-4">
            <MonoLabel className="text-[#111111]">Next project</MonoLabel>
            <span className="font-serif text-[clamp(48px,6vw,96px)] font-light italic leading-[0.95] tracking-[-0.02em] text-[#111111]">
              {next.title}{" "}
              <span
                aria-hidden
                className="inline-block text-[0.4em] not-italic transition-transform duration-300 group-hover:translate-x-2"
              >
                →
              </span>
            </span>
            {next.category && (
              <MonoLabel className="text-[#9a968d]">{next.category}</MonoLabel>
            )}
          </div>
          {next.coverImage?.asset?.url && (
            <div className="relative aspect-[8/5] w-full overflow-hidden bg-[#ece8df]">
              <Image
                src={next.coverImage.asset.url}
                alt=""
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.02]"
                placeholder={
                  next.coverImage.asset.metadata?.lqip ? "blur" : "empty"
                }
                blurDataURL={next.coverImage.asset.metadata?.lqip ?? undefined}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}

export function InquiryBar() {
  return (
    <section className="bg-[#f6f4ef] pb-16 md:pb-24">
      <div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-center justify-between gap-6 border-t border-[rgba(17,17,17,0.12)] px-6 pt-8 md:px-10 lg:px-14">
        <p className="font-serif text-[clamp(24px,2.4vw,34px)] font-light italic leading-tight text-[#111111]">
          Have a project in mind?
        </p>
        <CTA href="/#contact" variant="accent">
          Begin an inquiry
        </CTA>
      </div>
    </section>
  );
}
