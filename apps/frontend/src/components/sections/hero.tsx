"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import { Placeholder } from "@/components/primitives/placeholder";
import type { HeroSection } from "@/lib/sanity/types";

interface Props {
  data?: HeroSection;
}

export function Hero({ data }: Props) {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const tagline = data?.tagline ?? "File ℶ24—Resi · Vol. XII · Spec. A";

  // Split on "/" — editor convention: "Headline / italic second line"
  let headlineLine1 = "Interiors /";
  let headlineLine2 = "of consequence.";
  if (data?.headline) {
    const idx = data.headline.indexOf("/");
    if (idx !== -1) {
      headlineLine1 = data.headline.slice(0, idx).trim() + " /";
      headlineLine2 = data.headline.slice(idx + 1).trim();
    } else {
      headlineLine1 = data.headline;
      headlineLine2 = "";
    }
  }

  const subheadline =
    data?.subheadline ??
    "Considered residential interiors from a small, slow studio on Lake Washington.";

  const availabilityText = data?.availabilityText ?? null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "100vh", minHeight: "720px" }}
      aria-label="Homepage hero"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={prefersReduced ? { scale: 1.06 } : { y: imageY, scale: 1.06 }}
      >
        {data?.backgroundImage?.asset?.url ? (
          <Image
            src={data.backgroundImage.asset.url}
            alt=""
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={data.backgroundImage.asset.metadata.lqip}
            sizes="100vw"
          />
        ) : (
          <Placeholder
            variant="daylight"
            className="absolute inset-0 w-full h-full"
          />
        )}
      </motion.div>

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/65"
      />

      {/* Centered masthead */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Eyebrow with flanking rules */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-12 h-px bg-white/35" aria-hidden="true" />
          <MonoLabel className="text-white/60">{tagline}</MonoLabel>
          <div className="w-12 h-px bg-white/35" aria-hidden="true" />
        </div>

        {/* H1 */}
        <h1
          className="font-serif font-light text-white leading-[0.92] tracking-tight mb-7"
          style={{ fontSize: "clamp(56px, 8vw, 132px)" }}
        >
          <span className="block">{headlineLine1}</span>
          {headlineLine2 && (
            <span className="block italic">{headlineLine2}</span>
          )}
        </h1>

        {/* Subhead */}
        <p className="font-sans text-white/75 text-base leading-relaxed max-w-sm mb-10">
          {subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <CTA href="/#contact" variant="onImage">
            Begin an inquiry
          </CTA>
          <CTA href="/work" variant="onImage" arrow={false}>
            Selected work
          </CTA>
        </div>
      </div>

      {/* Bottom credit rail — hidden on mobile */}
      <div className="hidden md:flex absolute bottom-7 inset-x-0 px-8 lg:px-14 items-end justify-between z-10">
        {/* Left: featured project */}
        <div>
          <MonoLabel className="text-white/45 block mb-1.5">Featured</MonoLabel>
          <p className="font-serif italic text-white text-[20px] leading-tight">
            Madison Park Residence
          </p>
          <MonoLabel className="text-white/35 mt-1.5 block text-[9px]">
            Seattle,&nbsp;WA&nbsp;·&nbsp;2025&nbsp;·&nbsp;Full&nbsp;Renovation
          </MonoLabel>
        </div>

        {/* Center: scroll cue */}
        <div className="flex flex-col items-center gap-2" aria-hidden="true">
          <MonoLabel className="text-white/35 text-[9px]">Scroll</MonoLabel>
          <div className="relative w-px h-14 bg-white/20 overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 w-full bg-white rounded-full"
              style={{ height: "45%" }}
              initial={{ top: "-50%" }}
              animate={{ top: ["-50%", "120%"] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0.2,
              }}
            />
          </div>
        </div>

        {/* Right: availability */}
        <div className="text-right">
          <MonoLabel className="text-white/45 block mb-1.5">
            Currently
          </MonoLabel>
          {availabilityText ? (
            <p className="font-sans text-white text-sm leading-tight">
              {availabilityText}
            </p>
          ) : (
            <>
              <p className="font-sans text-white text-sm leading-tight">
                Two commissions for 2026
              </p>
              <MonoLabel className="text-white/35 mt-1.5 block text-[9px]">
                2&nbsp;of&nbsp;6–8&nbsp;slots&nbsp;open
              </MonoLabel>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
