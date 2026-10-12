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
// a thin trigger band placed 35% down the viewport, read via
// IntersectionObserver rather than a manual scroll+rAF loop.
const FLIP_ROOT_MARGIN = "-35% 0px -64% 0px";

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
        className="font-serif text-[#111111] leading-[0.95] tracking-tight"
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

// Mobile-only sticky nav strip — hidden while the header's own contents
// list is on screen, then fades in once that list scrolls past. Tap to
// expand the full list (same black/terracotta active styling as the
// desktop rail); tap again, or pick a service, to collapse it.
function MobileContentsStrip({
  services,
  active,
  visible,
  onJump,
  prefersReduced,
}: {
  services: Service[];
  active: number;
  visible: boolean;
  onJump: (index: number) => void;
  prefersReduced: boolean | null;
}) {
  const [open, setOpen] = useState(false);
  const activeService = services[active];
  const transitionClass = prefersReduced ? "duration-0" : "duration-[400ms]";

  return (
    <div className="lg:hidden sticky z-30" style={{ top: NAV_CLEARANCE - 56 }}>
      <div
        className={cn(
          "bg-[rgba(246,244,239,0.96)] backdrop-blur-[14px] border-b border-[rgba(17,17,17,0.12)] transition-all ease-out",
          transitionClass,
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full min-h-11 px-6 flex items-center justify-between"
        >
          <span className="flex items-center gap-2.5">
            <MonoLabel className="text-[#1b3a5b] text-[9px]">
              {activeService?.number}
            </MonoLabel>
            <MonoLabel className="text-[#111111] text-[9px]">
              {activeService?.title}
            </MonoLabel>
          </span>
          <MonoLabel className="text-[#9a968d] text-[9px]">
            {open ? "Close ×" : `${active + 1} of ${services.length} ▾`}
          </MonoLabel>
        </button>

        <div className="h-px bg-[rgba(17,17,17,0.12)] relative">
          <div
            className={cn(
              "absolute inset-y-0 left-0 bg-[#111111] ease-out",
              prefersReduced ? "duration-0" : "duration-500",
            )}
            style={{ width: `${((active + 1) / services.length) * 100}%` }}
          />
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows]",
            transitionClass,
          )}
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {services.map((service, i) => {
              const isActive = i === active;
              return (
                <button
                  key={service._id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onJump(i);
                  }}
                  className={cn(
                    "w-full min-h-12 px-6 flex items-center gap-2.5 transition-colors",
                    transitionClass,
                    isActive ? "bg-[#111111]" : "bg-transparent",
                  )}
                >
                  <MonoLabel
                    className={cn(
                      "text-[9px]",
                      isActive ? "text-[#c8553d]" : "text-[#9a968d]",
                    )}
                  >
                    {service.number}
                  </MonoLabel>
                  <MonoLabel
                    className={cn(
                      "text-[9px]",
                      isActive ? "text-[#f6f4ef]" : "text-[#111111]",
                    )}
                  >
                    {service.title}
                  </MonoLabel>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  services: Service[];
}

export function ServicesFolio({ services }: Props) {
  const [active, setActive] = useState(0);
  const [stripVisible, setStripVisible] = useState(false);
  const articlesRef = useRef<(HTMLElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const totalCount = String(services.length).padStart(2, "0");

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

  // Shows the mobile strip once the header's own contents list (which
  // sits directly above this component) has scrolled past.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStripVisible(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function scrollToService(index: number) {
    articlesRef.current[index]?.scrollIntoView({ block: "start" });
  }

  return (
    <div>
      <div ref={sentinelRef} aria-hidden="true" />

      <MobileContentsStrip
        services={services}
        active={active}
        visible={stripVisible}
        onJump={scrollToService}
        prefersReduced={prefersReduced}
      />

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
    </div>
  );
}
