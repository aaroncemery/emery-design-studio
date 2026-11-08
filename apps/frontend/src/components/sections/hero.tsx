"use client";

import { cleanText } from "@/lib/sanity/utils";
import { useRef } from "react";
import { SanityPicture } from "@/components/primitives/sanity-picture";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import { Placeholder } from "@/components/primitives/placeholder";
import type { HeroCornerData, HeroSection } from "@/lib/sanity/types";

interface Props {
  data?: HeroSection;
}

function HeroCorner({
  data,
  align,
}: {
  data?: HeroCornerData;
  align: "left" | "right";
}) {
  if (!data?.headline) return null;

  const content = (
    <>
      {data.eyebrow && (
        <MonoLabel className="text-white/45 block mb-1.5">
          {data.eyebrow}
        </MonoLabel>
      )}
      <p
        className={
          align === "left"
            ? "font-serif italic text-white text-[20px] leading-tight"
            : "font-sans text-white text-sm leading-tight"
        }
      >
        {data.headline}
      </p>
      {data.meta && (
        <MonoLabel className="text-white/35 mt-1.5 block text-[9px]">
          {data.meta.replace(/ /g, " ")}
        </MonoLabel>
      )}
    </>
  );

  return (
    <div className={align === "right" ? "text-right" : undefined}>
      {data.href ? <Link href={data.href}>{content}</Link> : content}
    </div>
  );
}

export function Hero({ data }: Props) {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const tagline = cleanText(data?.tagline);

  // Split on "/" — editor convention: "Headline / italic second line"
  let headlineLine1 = "";
  let headlineLine2 = "";
  const headline = cleanText(data?.headline);
  if (headline) {
    const idx = headline.indexOf("/");
    if (idx !== -1) {
      headlineLine1 = headline.slice(0, idx).trim();
      headlineLine2 = headline.slice(idx + 1).trim();
      if (headlineLine1 && headlineLine2) headlineLine1 += " /";
    } else {
      headlineLine1 = headline;
    }
  }

  const subheadline = cleanText(data?.subheadline);

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
          <SanityPicture
            image={data.backgroundImage}
            alt=""
            priority
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
        {tagline && (
          <div className="flex items-center gap-5 mb-8">
            <div className="w-12 h-px bg-white/35" aria-hidden="true" />
            <MonoLabel className="text-white/60">{tagline}</MonoLabel>
            <div className="w-12 h-px bg-white/35" aria-hidden="true" />
          </div>
        )}

        {/* H1 */}
        {headline && (
          <h1
            className="font-serif font-light text-white leading-[0.92] tracking-tight mb-7"
            style={{ fontSize: "clamp(56px, 8vw, 132px)" }}
          >
            {headlineLine1 && <span className="block">{headlineLine1}</span>}
            {headlineLine2 && (
              <span className="block italic">{headlineLine2}</span>
            )}
          </h1>
        )}

        {/* Subhead */}
        {subheadline && (
          <p className="font-sans text-white/75 text-base leading-relaxed max-w-sm mb-10">
            {subheadline}
          </p>
        )}

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
      <div className="hidden md:grid grid-cols-3 items-end absolute bottom-7 inset-x-0 px-8 lg:px-14 z-10">
        {/* Left: featured project */}
        <div className="col-start-1">
          <HeroCorner data={data?.heroFeatured ?? undefined} align="left" />
        </div>

        {/* Center: scroll cue */}
        <div
          className="col-start-2 justify-self-center flex flex-col items-center gap-2"
          aria-hidden="true"
        >
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
        <div className="col-start-3">
          <HeroCorner data={data?.heroStatus ?? undefined} align="right" />
        </div>
      </div>
    </section>
  );
}
