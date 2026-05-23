import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { SiteFooter } from "@/components/sections/site-footer";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";

export const metadata: Metadata = {
  title: "Work — Emery Design Studio",
  description:
    "Selected residential interior projects by Emery Design Studio, Kirkland WA.",
};

export default function WorkPage() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Section
          className="bg-[#f6f4ef] min-h-[70vh] flex flex-col justify-center"
          paddingY="xl"
        >
          <MonoLabel className="text-[#1b3a5b] block mb-6">
            Work&nbsp;—&nbsp;Project&nbsp;Archive
          </MonoLabel>
          <h1
            className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
          >
            The full
            <br />
            <em>archive.</em>
          </h1>
          <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
            Projects coming soon. In the meantime,{" "}
            <Link
              href="/#projects"
              className="text-[#1b3a5b] hover:opacity-70 transition-opacity"
            >
              see selected work
            </Link>{" "}
            on the homepage.
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
