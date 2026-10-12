"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import {
  Placeholder,
  type PlaceholderVariant,
} from "@/components/primitives/placeholder";
import type { Service } from "@/lib/sanity/types";

// Where the rail/photo-crossfade "active" section flips as you scroll —
// a trigger band centered ~35% down the viewport, read via
// IntersectionObserver rather than a manual scroll+rAF loop. A few
// percent tall (not a hairline) so ordinary scroll jitter right at a
// section boundary doesn't toggle the active index back and forth.
const FLIP_ROOT_MARGIN = "-33% 0px -62% 0px";

// Clears the fixed floating nav pill (site-nav.tsx: `top-5` + its own
// padding) so an anchor-jump, rail click, or sticky element never lands
// under it.
const NAV_CLEARANCE = 112;

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
  if (service.recentProjects && service.recentProjects.length > 0) {
    rows.push({
      label: "Recent",
      value: (
        <span className="inline-flex flex-wrap items-baseline">
          {service.recentProjects.map((project, i) => (
            <span key={project._id}>
              <Link
                href={`/work/${project.slug}`}
                className="hover:opacity-70 transition-opacity underline-offset-4 hover:underline"
              >
                {project.title}
              </Link>
              {i < service.recentProjects!.length - 1 && (
                <span aria-hidden="true">&nbsp;·&nbsp;</span>
              )}
            </span>
          ))}
        </span>
      ),
    });
  }
  return rows;
}

function ServiceContent({
  service,
  totalCount,
}: {
  service: Service;
  totalCount: string;
}) {
  const specRows = buildSpecRows(service);

  return (
    <>
      {service.number && (
        <MonoLabel className="text-[#1b3a5b] block mb-5">
          {service.number} / {totalCount}
        </MonoLabel>
      )}

      <h2
        className="font-serif text-[#111111] leading-[1.1] tracking-tight"
        style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
      >
        {service.title}
      </h2>

      {service.subtitle && (
        <p
          className="font-serif italic text-[#111111] leading-snug mt-5 max-w-md"
          style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
        >
          {service.subtitle}
        </p>
      )}

      {service.description && (
        <p className="font-sans text-[#2a2a2a] text-[15px] leading-relaxed max-w-md mt-9">
          {service.description}
        </p>
      )}

      {service.whatsIncluded && service.whatsIncluded.length > 0 && (
        <p className="font-sans text-[13px] text-[#6b6b66] leading-[1.8] max-w-md mt-7">
          {service.whatsIncluded.join(" · ")}
        </p>
      )}

      {specRows.length > 0 && (
        <div className="flex flex-wrap gap-x-8 gap-y-4 mt-10 pt-4 border-t border-[rgba(17,17,17,0.12)] max-w-md">
          {specRows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1.5">
              <MonoLabel className="text-[#9a968d] text-[9px]">
                {row.label}
              </MonoLabel>
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#111111]">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
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
      </div>
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
  const totalCount = String(services.length).padStart(2, "0");

  useEffect(() => {
    // More than one article can straddle the trigger band for a moment
    // right at a shared border — tracking the full intersecting set and
    // always resolving to its highest index (rather than reacting to
    // whichever entry's callback happens to fire last) keeps that
    // moment deterministic instead of flickering between the two.
    const intersecting = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = articlesRef.current.indexOf(
            entry.target as HTMLElement,
          );
          if (index === -1) return;
          if (entry.isIntersecting) {
            intersecting.add(index);
          } else {
            intersecting.delete(index);
          }
        });
        if (intersecting.size > 0) setActive(Math.max(...intersecting));
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
        <MonoLabel className="text-[#9a968d] block mb-4">Contents</MonoLabel>
        <ol className="flex flex-col gap-0.5">
          {services.map((service, i) => {
            const isActive = i === active;
            return (
              <li key={service._id}>
                <button
                  type="button"
                  onClick={() => scrollToService(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex items-center gap-3 w-full px-2.5 py-2 text-left transition-colors duration-[400ms] group",
                    isActive ? "bg-[#111111]" : "bg-transparent",
                  )}
                >
                  <MonoLabel
                    className={isActive ? "text-[#c8553d]" : "text-[#9a968d]"}
                  >
                    {service.number ?? String(i + 1).padStart(2, "0")}
                  </MonoLabel>
                  <MonoLabel
                    className={
                      isActive
                        ? "text-[#f6f4ef]"
                        : "text-[#111111] group-hover:text-[#6b6b66] transition-colors duration-300"
                    }
                    style={{ lineHeight: 1.4 }}
                  >
                    {service.title}
                  </MonoLabel>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Progress — horizontal fill, no absolute-positioned percentage-height hack */}
        <div className="h-px w-full bg-[rgba(17,17,17,0.12)] mt-7">
          <div
            className="h-full bg-[#111111] transition-all duration-500 ease-out"
            style={{ width: `${((active + 1) / services.length) * 100}%` }}
          />
        </div>
        <MonoLabel className="text-[#9a968d] block mt-2.5 text-[9px]">
          {String(active + 1).padStart(2, "0")} of {totalCount}
        </MonoLabel>
      </nav>

      {/* Copy column */}
      <div>
        {services.map((service, i) => {
          const isLast = i === services.length - 1;
          return (
            <article
              key={service._id}
              id={service.slug}
              ref={(el) => {
                articlesRef.current[i] = el;
              }}
              className={cn(
                "py-16 lg:flex lg:flex-col lg:justify-center first:pt-0",
                // The last article's own box is what the sticky photo's
                // containing block ends at — giving it the same height as
                // the photo (instead of the usual 70vh) is what keeps the
                // photo pinned through this section's full length, rather
                // than releasing as soon as there's less room left in the
                // grid than the photo needs. `--sticky-h` is set below so
                // this stays derived from NAV_CLEARANCE, not a duplicated
                // magic number.
                isLast ? "lg:min-h-[var(--sticky-h)]" : "lg:min-h-[70vh]",
              )}
              style={
                {
                  scrollMarginTop: NAV_CLEARANCE,
                  "--sticky-h": `calc(100vh - ${NAV_CLEARANCE + 48}px)`,
                } as React.CSSProperties
              }
            >
              {/* Photo — mobile/tablet only, inline per service, full-bleed */}
              <div
                className="lg:hidden -mx-6 md:-mx-10 relative mb-10 overflow-hidden"
                style={{ aspectRatio: "4 / 5" }}
              >
                <ServicePhoto
                  service={service}
                  variant={PHOTO_VARIANTS[i % PHOTO_VARIANTS.length]}
                />
              </div>

              <ServiceContent service={service} totalCount={totalCount} />
            </article>
          );
        })}
      </div>

      {/* Photo column — desktop only. Each photo sits in its own lane,
            offset a full frame-height from its neighbors; advancing the
            active index slides the whole stack up into place — matching
            the direction the copy column itself moves as you scroll
            down — rather than cross-fading in place, so the swap reads
            as one continuous, physical motion instead of a blink. */}
      <div
        className="hidden lg:block sticky self-start overflow-hidden"
        style={{
          top: NAV_CLEARANCE,
          height: `calc(100vh - ${NAV_CLEARANCE + 48}px)`,
        }}
      >
        {services.map((service, i) => (
          <motion.div
            key={service._id}
            className="absolute inset-0"
            initial={false}
            animate={{ y: `${(i - active) * 100}%` }}
            transition={{
              duration: prefersReduced ? 0 : 1,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            aria-hidden={i !== active}
          >
            <ServicePhoto
              service={service}
              variant={PHOTO_VARIANTS[i % PHOTO_VARIANTS.length]}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
