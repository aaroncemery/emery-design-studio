import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { SiteFooter } from "@/components/sections/site-footer";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";

export const metadata: Metadata = {
  title: "Journal — Emery Design Studio",
  description:
    "Writing and notes from Emery Design Studio on interiors, materials, and process.",
};

export default function JournalPage() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Section
          className="bg-[#f6f4ef] min-h-[70vh] flex flex-col justify-center"
          paddingY="xl"
        >
          <MonoLabel className="text-[#1b3a5b] block mb-6">
            Journal&nbsp;—&nbsp;Notes&nbsp;on&nbsp;Practice
          </MonoLabel>
          <h1
            className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
          >
            Slow <em>writing</em>
            <br />
            from the studio.
          </h1>
          <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
            Essays and notes on materials, process, and the spaces we build.
            Coming soon.
          </p>
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 inline-flex items-center gap-2"
          >
            ← Back home
          </Link>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
