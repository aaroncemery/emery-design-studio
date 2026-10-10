"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";
import type { Testimonial, PressItem } from "@/lib/sanity/types";

const AUTO_ROTATE_DURATION = 7000;

interface Props {
  testimonials?: Testimonial[];
  pressItems?: PressItem[];
  heading?: string;
  subheading?: string;
}

export function Testimonials({
  testimonials,
  pressItems,
  heading,
  subheading,
}: Props) {
  const hasTestimonials = testimonials && testimonials.length > 0;
  const displayPress =
    pressItems && pressItems.length > 0
      ? pressItems
      : (undefined as PressItem[] | undefined);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const safeActive = hasTestimonials
    ? Math.min(active, testimonials.length - 1)
    : 0;
  const prefersReduced = useReducedMotion();

  function handleSelect(i: number) {
    setActive(i);
    setPaused(true);
  }

  useEffect(() => {
    if (!hasTestimonials || prefersReduced || paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ROTATE_DURATION);
    return () => clearInterval(timer);
  }, [hasTestimonials, testimonials, prefersReduced, paused]);

  if (!hasTestimonials) {
    return (
      <Section id="testimonials" className="bg-[#111111]" paddingY="xl">
        <MonoLabel className="text-[#c8553d] block mb-10">
          §&nbsp;05&nbsp;—&nbsp;Clients
        </MonoLabel>
        {heading && (
          <h2
            className="font-serif text-[#f6f4ef] leading-[0.92] tracking-tight mb-8"
            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="font-sans text-[#f6f4ef]/70 text-sm leading-relaxed mb-10 max-w-lg">
            {subheading}
          </p>
        )}
        <p className="font-sans text-[#f6f4ef]/50 text-sm leading-relaxed max-w-sm">
          Client testimonials coming soon.
        </p>
      </Section>
    );
  }

  return (
    <Section id="testimonials" className="bg-[#111111]" paddingY="xl">
      <MonoLabel className="text-[#c8553d] block mb-10">
        §&nbsp;05&nbsp;—&nbsp;Clients
      </MonoLabel>

      {heading && (
        <h2
          className="font-serif text-[#f6f4ef] leading-[0.92] tracking-tight mb-8"
          style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p className="font-sans text-[#f6f4ef]/70 text-sm leading-relaxed mb-10 max-w-lg">
          {subheading}
        </p>
      )}

      {/* Quote panel */}
      <div
        id="testimonial-panel"
        role="tabpanel"
        aria-live="polite"
        aria-label="Current testimonial"
        className="mb-14"
      >
        {/* Static quote mark — sits above the animated content, never moves */}
        <span
          className="font-serif text-[#c8553d] leading-none select-none block mb-2"
          style={{ fontSize: "120px", opacity: 0.7, lineHeight: 0.8 }}
          aria-hidden="true"
        >
          &ldquo;
        </span>

        {/* Directional slide — grid-stacked so container height never changes */}
        <div className="grid overflow-x-hidden">
          {testimonials.map((t, i) => {
            const isVisible = safeActive === i;
            const xOffset = Math.sign(i - safeActive) * 40;
            return (
              <motion.div
                key={t._id}
                style={{ gridArea: "1 / 1" }}
                initial={false}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  x: isVisible ? 0 : xOffset,
                }}
                transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                aria-hidden={!isVisible}
              >
                <blockquote>
                  <p
                    className="font-serif italic text-[#f6f4ef] leading-[1.15] tracking-tight mb-8 max-w-4xl"
                    style={{ fontSize: "clamp(28px, 3.4vw, 52px)" }}
                  >
                    {t.quote}
                  </p>
                  <footer>
                    <span className="font-serif text-[#f6f4ef]/80 text-base">
                      — {t.authorName}
                    </span>
                    <div className="flex items-center gap-4 mt-3">
                      <div
                        className="w-10 h-px bg-[rgba(246,244,239,0.2)]"
                        aria-hidden="true"
                      />
                      <MonoLabel className="text-[#f6f4ef]/40 text-[9px]">
                        {t.authorContext}
                      </MonoLabel>
                    </div>
                  </footer>
                </blockquote>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tab row — equal-width thirds with progress bar */}
      <div
        role="tablist"
        aria-label="Client testimonials"
        className="flex border-t border-[rgba(246,244,239,0.1)]"
      >
        {testimonials.map((t, i) => {
          const isActive = safeActive === i;
          return (
            <button
              key={t._id}
              role="tab"
              aria-selected={isActive}
              aria-controls="testimonial-panel"
              onClick={() => handleSelect(i)}
              className="relative flex-1 py-5 px-4 text-left group"
            >
              <MonoLabel
                className="transition-colors duration-300 block"
                style={{
                  color: isActive
                    ? "rgba(246,244,239,0.9)"
                    : "rgba(246,244,239,0.3)",
                }}
              >
                {t.authorName}
              </MonoLabel>

              {/* Progress bar track */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-[rgba(246,244,239,0.08)]">
                {/* Animated fill — auto-rotating */}
                {isActive && !paused && !prefersReduced && (
                  <motion.div
                    key={`${safeActive}-progress`}
                    className="absolute inset-0 bg-[#c8553d] origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: AUTO_ROTATE_DURATION / 1000,
                      ease: "linear",
                    }}
                  />
                )}
                {/* Static indicator — manually selected */}
                {isActive && paused && (
                  <div className="absolute inset-0 bg-[#c8553d] opacity-50" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Press bar */}
      {displayPress && (
        <div className="mt-16">
          <MonoLabel className="text-[#f6f4ef]/30 block mb-8 text-[9px]">
            As featured in
          </MonoLabel>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {displayPress.map((item) => (
              <span
                key={item._id}
                className="font-serif italic text-[#f6f4ef]/30 text-[22px] leading-none"
              >
                {item.publicationName}
              </span>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
