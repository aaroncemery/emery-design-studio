"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Working with Emery felt like hiring a trusted collaborator rather than a contractor. The result exceeded everything we imagined for the space.",
    name: "Claire & Thomas B.",
    context: "Madison Park Residence, 2025",
  },
  {
    quote:
      "Their restraint is the point. Every choice is deliberate, nothing is decorative for its own sake, and the spaces feel like they always belonged.",
    name: "Sarah M.",
    context: "Yarrow Point House, 2025",
  },
  {
    quote:
      "We've done three projects now. The studio's process is meticulous and the outcome is always more than we thought was possible in the space.",
    name: "David K.",
    context: "Hunts Point Retreat, 2024",
  },
];

const publications = [
  "Architectural Digest",
  "Dwell",
  "Remodelista",
  "Kinfolk",
  "The Gentlewoman",
  "Cabana",
];

export function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Section id="testimonials" className="bg-[#111111]" paddingY="xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 mb-20">
        {/* Left: selector */}
        <div>
          <MonoLabel className="text-[#c8553d] block mb-8">
            §&nbsp;05&nbsp;—&nbsp;Clients
          </MonoLabel>
          <div
            className="flex flex-col gap-0"
            role="tablist"
            aria-label="Client testimonials"
          >
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                role="tab"
                aria-selected={active === i}
                aria-controls="testimonial-panel"
                onClick={() => setActive(i)}
                className="flex items-center gap-4 py-4 text-left group"
              >
                <div
                  className="w-8 h-px flex-shrink-0 transition-all duration-300"
                  style={{
                    backgroundColor:
                      active === i ? "#c8553d" : "rgba(246,244,239,0.2)",
                    width: active === i ? "32px" : "16px",
                  }}
                  aria-hidden="true"
                />
                <MonoLabel
                  className="transition-colors duration-300"
                  style={{
                    color:
                      active === i
                        ? "rgba(246,244,239,0.9)"
                        : "rgba(246,244,239,0.35)",
                  }}
                >
                  {t.name}
                </MonoLabel>
              </button>
            ))}
          </div>
        </div>

        {/* Right: quote display */}
        <div
          id="testimonial-panel"
          role="tabpanel"
          aria-live="polite"
          aria-label="Current testimonial"
          className="relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {/* Decorative quote mark */}
              <span
                className="font-serif text-[#c8553d] leading-none select-none block mb-2"
                style={{ fontSize: "120px", opacity: 0.7, lineHeight: 0.8 }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <blockquote>
                <p
                  className="font-serif italic text-[#f6f4ef] leading-[1.15] tracking-tight mb-8"
                  style={{ fontSize: "clamp(28px, 3.4vw, 52px)" }}
                >
                  {testimonials[active].quote}
                </p>
                <footer>
                  <span className="font-serif text-[#f6f4ef]/80 text-base">
                    — {testimonials[active].name}
                  </span>
                  <div className="flex items-center gap-4 mt-3">
                    <div
                      className="w-10 h-px bg-[rgba(246,244,239,0.2)]"
                      aria-hidden="true"
                    />
                    <MonoLabel className="text-[#f6f4ef]/40 text-[9px]">
                      {testimonials[active].context}
                    </MonoLabel>
                  </div>
                </footer>
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Press bar */}
      <div className="pt-12 border-t border-[rgba(246,244,239,0.1)]">
        <MonoLabel className="text-[#f6f4ef]/30 block mb-8 text-[9px]">
          As featured in
        </MonoLabel>
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {publications.map((pub) => (
            <span
              key={pub}
              className="font-serif italic text-[#f6f4ef]/30 text-[22px] leading-none"
            >
              {pub}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
