"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import {
  Placeholder,
  type PlaceholderVariant,
} from "@/components/primitives/placeholder";
import type { Service } from "@/lib/sanity/types";

// Where the rail/photo-crossfade "active" section flips as you scroll —
// a thin trigger band placed 35% down the viewport, read via
// IntersectionObserver rather than a manual scroll+rAF loop.
const FLIP_ROOT_MARGIN = "-35% 0px -64% 0px";

// Clears the fixed floating nav pill (site-nav.tsx: `top-5` + its own
// padding) so an anchor-jump or rail click never lands a section under it.
const NAV_CLEARANCE = 100;

const PHOTO_VARIANTS: PlaceholderVariant[] = [
  "wood",
  "stone",
  "plaster",
  "daylight",
  "dusk",
  "garden",
];

interface SpecRow {
  label: string;
  value: React.ReactNode;
}

function buildSpecRows(service: Service): SpecRow[] {
  const rows: SpecRow[] = [];
  if (service.duration)
    rows.push({ label: "Duration", value: service.duration });
  if (service.engagement)
    rows.push({ label: "Engagement", value: service.engagement });
  if (service.recentProjects && service.recentProjects.length > 0) {
    rows.push({
      label: "Recent",
      value: (
        <span className="flex flex-wrap items-baseline gap-x-1.5">
          {service.recentProjects.map((project, i) => (
            <span key={project._id}>
              <Link
                href={`/work/${project.slug}`}
                className="hover:opacity-70 transition-opacity underline-offset-4 hover:underline"
              >
                {project.title}
              </Link>
              {i < service.recentProjects!.length - 1 && (
                <span aria-hidden="true">,</span>
              )}
            </span>
          ))}
        </span>
      ),
    });
  }
  return rows;
}

function ServiceContent({ service }: { service: Service }) {
  const specRows = buildSpecRows(service);

  return (
    <>
      <div className="flex items-baseline gap-4 mb-5">
        {service.number && (
          <span
            className="font-serif italic text-[#9a968d]"
            style={{ fontSize: "clamp(24px, 2.4vw, 36px)" }}
            aria-hidden="true"
          >
            /{service.number}
          </span>
        )}
        <h2
          className="font-serif text-[#111111] leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
        >
          {service.title}
        </h2>
      </div>

      {service.subtitle && (
        <p
          className="font-serif italic text-[#111111] leading-snug mb-6 max-w-md"
          style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
        >
          {service.subtitle}
        </p>
      )}

      {service.description && (
        <p className="font-sans text-[#6b6b66] text-[15px] leading-relaxed max-w-md mb-10">
          {service.description}
        </p>
      )}

      {service.whatsIncluded && service.whatsIncluded.length > 0 && (
        <div className="mb-10 max-w-md">
          <MonoLabel className="text-[#9a968d] block mb-3 text-[9px]">
            What&rsquo;s included
          </MonoLabel>
          <div className="grid grid-cols-2 gap-x-6">
            {service.whatsIncluded.map((item) => (
              <p
                key={item}
                className="font-sans text-[13px] text-[#111111] border-t border-[rgba(17,17,17,0.12)] py-2.5"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      )}

      {specRows.length > 0 && (
        <div className="mb-10 max-w-md">
          {specRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[110px_1fr] gap-x-4 border-t border-[rgba(17,17,17,0.12)] py-2.5"
            >
              <MonoLabel className="text-[#9a968d] text-[9px]">
                {row.label}
              </MonoLabel>
              <span className="font-mono text-[11px] tracking-[0.04em] text-[#111111]">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <CTA
        href={
          service.relatedWorkCategory
            ? `/work?category=${encodeURIComponent(service.relatedWorkCategory)}`
            : "/work"
        }
        variant="ghost"
      >
        See {service.title.toLowerCase()} work
      </CTA>
    </>
  );
}

function ServicePhoto({
  service,
  variant,
}: {
  service: Service;
  variant: PlaceholderVariant;
}) {
  const asset = service.image?.asset?.asset;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#111111]">
      {asset?.url ? (
        <Image
          src={asset.url}
          alt={service.image?.alt || service.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 40vw"
          placeholder={asset.metadata?.lqip ? "blur" : undefined}
          blurDataURL={asset.metadata?.lqip ?? undefined}
        />
      ) : (
        <>
          <Placeholder variant={variant} className="absolute inset-0 h-full" />
          <div className="absolute inset-0 flex items-end p-6">
            <MonoLabel className="text-white/70 text-[9px]">
              Photography coming soon
            </MonoLabel>
          </div>
        </>
      )}
      {asset?.url && service.image?.caption && (
        <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
          <MonoLabel className="text-white/80 text-[9px]">
            {service.image.caption}
          </MonoLabel>
        </div>
      )}
    </div>
  );
}

interface Props {
  services: Service[];
}

export function ServicesFolio({ services }: Props) {
  const [active, setActive] = useState(0);
  const articlesRef = useRef<(HTMLElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = articlesRef.current.indexOf(
            entry.target as HTMLElement,
          );
          if (index !== -1) setActive(index);
        });
      },
      { rootMargin: FLIP_ROOT_MARGIN, threshold: 0 },
    );

    articlesRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [services]);

  function scrollToService(index: number) {
    articlesRef.current[index]?.scrollIntoView({ block: "start" });
  }

  return (
    <div className="grid lg:grid-cols-[200px_1fr_40%] gap-x-12">
      {/* Rail — desktop only */}
      <nav
        aria-label="Jump to service"
        className="hidden lg:block sticky self-start"
        style={{ top: NAV_CLEARANCE }}
      >
        <ol className="border-t border-[rgba(17,17,17,0.12)]">
          {services.map((service, i) => {
            const isActive = i === active;
            return (
              <li key={service._id}>
                <button
                  type="button"
                  onClick={() => scrollToService(i)}
                  aria-current={isActive ? "true" : undefined}
                  className="block text-left w-full py-4 group"
                >
                  <span className="flex items-baseline gap-3">
                    <MonoLabel
                      className={isActive ? "text-[#1b3a5b]" : "text-[#9a968d]"}
                    >
                      {service.number ?? String(i + 1).padStart(2, "0")}
                    </MonoLabel>
                    <span
                      className={`font-serif leading-tight transition-colors duration-300 ${
                        isActive
                          ? "text-[#111111]"
                          : "text-[#9a968d] group-hover:text-[#6b6b66]"
                      }`}
                      style={{ fontSize: "15px" }}
                    >
                      {service.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Progress — horizontal fill, no absolute-positioned percentage-height hack */}
        <div className="h-px w-full bg-[rgba(17,17,17,0.12)] mt-2">
          <div
            className="h-full bg-[#1b3a5b] transition-all duration-500 ease-out"
            style={{ width: `${((active + 1) / services.length) * 100}%` }}
          />
        </div>
        <MonoLabel className="text-[#9a968d] block mt-4 text-[9px]">
          {String(active + 1).padStart(2, "0")} of{" "}
          {String(services.length).padStart(2, "0")}
        </MonoLabel>
      </nav>

      {/* Copy column */}
      <div>
        {services.map((service, i) => (
          <article
            key={service._id}
            id={service.slug}
            ref={(el) => {
              articlesRef.current[i] = el;
            }}
            className="py-16 lg:min-h-[70vh] lg:flex lg:flex-col lg:justify-center border-t border-[rgba(17,17,17,0.12)] first:border-t-0 first:pt-0"
            style={{ scrollMarginTop: NAV_CLEARANCE }}
          >
            {/* Photo — mobile/tablet only, inline per service */}
            <div
              className="lg:hidden relative mb-10 overflow-hidden"
              style={{ aspectRatio: 1.1 }}
            >
              <ServicePhoto
                service={service}
                variant={PHOTO_VARIANTS[i % PHOTO_VARIANTS.length]}
              />
            </div>

            <ServiceContent service={service} />
          </article>
        ))}
      </div>

      {/* Photo column — desktop only, sticky crossfade */}
      <div
        className="hidden lg:block sticky self-start overflow-hidden"
        style={{
          top: NAV_CLEARANCE,
          height: `calc(100vh - ${NAV_CLEARANCE + 48}px)`,
        }}
      >
        {services.map((service, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={service._id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: prefersReduced ? 1 : isActive ? 1 : 1.04,
              }}
              transition={{
                opacity: {
                  duration: prefersReduced ? 0.15 : 0.9,
                  ease: [0.2, 0.7, 0.2, 1],
                },
                scale: {
                  duration: prefersReduced ? 0 : 1.6,
                  ease: [0.2, 0.7, 0.2, 1],
                },
              }}
              aria-hidden={!isActive}
            >
              <ServicePhoto
                service={service}
                variant={PHOTO_VARIANTS[i % PHOTO_VARIANTS.length]}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
