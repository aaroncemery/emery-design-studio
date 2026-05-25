import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import { Reveal } from "@/components/primitives/reveal";
import {
  Placeholder,
  type PlaceholderVariant,
} from "@/components/primitives/placeholder";
import type { Project } from "@/lib/sanity/types";

interface LayoutConfig {
  colClass: string;
  paddingClass: string;
  aspectRatio: number;
  placeholder: PlaceholderVariant;
}

const LAYOUT_CONFIGS: LayoutConfig[] = [
  {
    colClass: "col-span-12 md:col-span-7",
    paddingClass: "",
    aspectRatio: 0.72,
    placeholder: "daylight",
  },
  {
    colClass: "col-span-12 md:col-span-5",
    paddingClass: "md:pt-[12%]",
    aspectRatio: 1.18,
    placeholder: "stone",
  },
  {
    colClass: "col-span-12 md:col-span-4",
    paddingClass: "md:pt-[8%]",
    aspectRatio: 1.18,
    placeholder: "dusk",
  },
  {
    colClass: "col-span-12 md:col-span-8",
    paddingClass: "",
    aspectRatio: 0.58,
    placeholder: "plaster",
  },
  {
    colClass: "col-span-12 md:col-start-4 md:col-span-6",
    paddingClass: "",
    aspectRatio: 0.58,
    placeholder: "garden",
  },
];

function ProjectCard({
  project,
  layout,
  index,
}: {
  project: Project;
  layout: LayoutConfig;
  index: number;
}) {
  return (
    <article className={`group ${layout.paddingClass}`}>
      <Link href={`/work/${project.slug}`} aria-label={`View ${project.title}`}>
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: layout.aspectRatio }}
        >
          {project.coverImage?.asset?.url ? (
            <Image
              src={project.coverImage.asset.url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 60vw"
              placeholder="blur"
              blurDataURL={project.coverImage.asset.metadata.lqip}
            />
          ) : (
            <Placeholder
              variant={layout.placeholder}
              aspectRatio={layout.aspectRatio}
              className="w-full transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
            />
          )}

          {/* Index number */}
          <span
            className="absolute top-4 left-4 font-serif italic text-white/60 text-sm leading-none"
            aria-hidden="true"
          >
            /{String(index + 1).padStart(2, "0")}
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]">
              <MonoLabel className="text-white/60 block mb-2">
                View project →
              </MonoLabel>
              {project.excerpt && (
                <p className="font-sans text-white/85 text-sm leading-relaxed">
                  {project.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif italic text-[#111111] text-[26px] leading-tight">
            {project.title}
          </h3>
          <MonoLabel className="text-[#6b6b66] mt-1.5 block text-[11px] md:text-[9px]">
            {[project.category, project.location, project.year]
              .filter(Boolean)
              .join(" · ")}
          </MonoLabel>
        </div>
      </div>
    </article>
  );
}

interface Props {
  projects?: Project[];
}

export function FeaturedProjects({ projects }: Props) {
  const hasProjects = projects && projects.length > 0;

  return (
    <Section id="projects" className="bg-[#f6f4ef]" paddingY="xl">
      {/* Section header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-20">
          <div className="max-w-lg">
            <MonoLabel className="text-[#1b3a5b] block mb-4">
              §&nbsp;02&nbsp;—&nbsp;Selected&nbsp;Work
            </MonoLabel>
            <h2
              className="font-serif text-[#111111] leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              Rooms we&rsquo;ve&nbsp;/
              <br />
              <em>quietly</em> built.
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed mb-6">
              A small selection of completed projects. Each one takes two to
              three years and leaves us changed by it.
            </p>
            <CTA href="/work" variant="solid">
              The full archive
            </CTA>
          </div>
        </div>
      </Reveal>

      {/* 12-column staggered grid */}
      {hasProjects ? (
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 md:gap-y-24">
          {projects.slice(0, 5).map((project, i) => {
            const layout = LAYOUT_CONFIGS[i % LAYOUT_CONFIGS.length];
            return (
              <Reveal
                key={project._id}
                delay={i * 0.08}
                className={layout.colClass}
              >
                <ProjectCard project={project} layout={layout} index={i} />
              </Reveal>
            );
          })}
        </div>
      ) : (
        <p className="font-sans text-[#9a968d] text-sm">
          Projects coming soon.
        </p>
      )}
    </Section>
  );
}
