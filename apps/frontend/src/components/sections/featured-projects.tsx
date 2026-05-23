import Link from "next/link";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import { Reveal } from "@/components/primitives/reveal";
import {
  Placeholder,
  type PlaceholderVariant,
} from "@/components/primitives/placeholder";

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  category: string;
  blurb: string;
  placeholder: PlaceholderVariant;
  aspectRatio: number;
  colClass: string;
  paddingTop?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Madison Park Residence",
    location: "Seattle, WA",
    year: "2025",
    category: "Full Renovation",
    blurb: "A complete reimagining of a 1940s craftsman on the water's edge.",
    placeholder: "daylight",
    aspectRatio: 0.72,
    colClass: "col-span-7",
  },
  {
    id: 2,
    name: "Yarrow Point House",
    location: "Yarrow Point, WA",
    year: "2025",
    category: "Interior Architecture",
    blurb:
      "Bespoke joinery and plaster work throughout a lakeside contemporary.",
    placeholder: "stone",
    aspectRatio: 1.18,
    colClass: "col-span-5",
    paddingTop: "12%",
  },
  {
    id: 4,
    name: "Medina Guesthouse",
    location: "Medina, WA",
    year: "2024",
    category: "Styling & Furnishing",
    blurb:
      "Considered objects and textiles for a guest cottage on the east shore.",
    placeholder: "dusk",
    aspectRatio: 1.18,
    colClass: "col-span-4",
    paddingTop: "8%",
  },
  {
    id: 3,
    name: "Hunts Point Retreat",
    location: "Hunts Point, WA",
    year: "2024",
    category: "Full Renovation",
    blurb: "Ground-up renovation of a modernist retreat compound.",
    placeholder: "plaster",
    aspectRatio: 0.58,
    colClass: "col-span-8",
  },
  {
    id: 5,
    name: "Laurelhurst Bath Suite",
    location: "Seattle, WA",
    year: "2024",
    category: "Interior Architecture",
    blurb: "A master bath suite defined by honed stone and warm brass.",
    placeholder: "garden",
    aspectRatio: 0.58,
    colClass: "col-start-4 col-span-6",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group" style={{ paddingTop: project.paddingTop }}>
      {/* Image */}
      <Link href={`/work`} aria-label={`View ${project.name}`}>
        <div className="relative overflow-hidden">
          <Placeholder
            variant={project.placeholder}
            aspectRatio={project.aspectRatio}
            className="w-full transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
          />

          {/* Index number */}
          <span
            className="absolute top-4 left-4 font-serif italic text-white/60 text-sm leading-none"
            aria-hidden="true"
          >
            /{String(project.id).padStart(2, "0")}
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]">
              <MonoLabel className="text-white/60 block mb-2">
                View project →
              </MonoLabel>
              <p className="font-sans text-white/85 text-sm leading-relaxed">
                {project.blurb}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Meta below image */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif italic text-[#111111] text-[26px] leading-tight">
            {project.name}
          </h3>
          <MonoLabel className="text-[#6b6b66] mt-1.5 block text-[9px]">
            {project.category}&nbsp;·&nbsp;{project.location}&nbsp;·&nbsp;
            {project.year}
          </MonoLabel>
        </div>
      </div>
    </article>
  );
}

export function FeaturedProjects() {
  return (
    <Section id="projects" className="bg-[#f6f4ef]" paddingY="xl">
      {/* Section header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
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
      <div className="grid grid-cols-12 gap-x-8" style={{ rowGap: "96px" }}>
        {projects.map((project, i) => (
          <Reveal
            key={project.id}
            delay={i * 0.08}
            className={project.colClass}
          >
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
