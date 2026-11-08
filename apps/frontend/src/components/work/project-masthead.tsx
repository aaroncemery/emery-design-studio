import { MonoLabel } from "@/components/primitives/mono-label";
import { FULL_WIDTH_SIZES, ProjectFigure } from "./project-figure";
import { SplitHeadline } from "./split-headline";
import type { Project } from "@/lib/sanity/types";

export function ProjectMasthead({
  project,
  hasMakingOf,
}: {
  project: Project;
  hasMakingOf: boolean;
}) {
  const byline = [
    [project.location, project.year].filter(Boolean).join(", "),
    project.photoCredit ? `Photography by ${project.photoCredit}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <header className="bg-[#f6f4ef] pt-28 md:pt-36">
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10 lg:px-14">
        <MonoLabel className="block text-[#1b3a5b]">
          {[project.title, project.category].filter(Boolean).join(" — ")}
        </MonoLabel>
        <h1 className="mt-5 font-serif text-[clamp(48px,6vw,96px)] font-light leading-[0.92] tracking-[-0.02em] text-[#111111]">
          <SplitHeadline text={project.headline || project.title} />
        </h1>
        {project.excerpt && (
          <p className="mt-7 max-w-[560px] text-pretty font-serif text-[clamp(20px,2vw,28px)] font-light leading-[1.3] text-[#4a4a44]">
            {project.excerpt}
          </p>
        )}
        {(byline || hasMakingOf) && (
          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-[rgba(17,17,17,0.12)] pt-5">
            <MonoLabel className="text-[#9a968d]">{byline}</MonoLabel>
            {hasMakingOf && (
              <a
                href="#making-of"
                className="font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-[#1b3a5b] transition-opacity hover:opacity-70"
              >
                The making of ↓
              </a>
            )}
          </div>
        )}
        {project.coverImage?.asset?.url && (
          <div className="mt-8">
            <ProjectFigure
              image={{
                ...project.coverImage,
                alt: project.headline || project.title,
                caption: null,
                source: null,
              }}
              ratio={2.1}
              sizes={FULL_WIDTH_SIZES}
              priority
            />
          </div>
        )}
      </div>
    </header>
  );
}
