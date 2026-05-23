import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { SiteFooter } from "@/components/sections/site-footer";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";

export const metadata: Metadata = {
  title: "Services — Emery Design Studio",
  description:
    "Interior design services offered by Emery Design Studio — full renovation, interior architecture, styling, and consultation.",
};

export default function ServicesPage() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Section
          className="bg-[#f6f4ef] min-h-[70vh] flex flex-col justify-center"
          paddingY="xl"
        >
          <MonoLabel className="text-[#1b3a5b] block mb-6">
            Services&nbsp;—&nbsp;How&nbsp;We&nbsp;Work
          </MonoLabel>
          <h1
            className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
          >
            How we&rsquo;re <em>usually</em>
            <br />
            asked to help.
          </h1>
          <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
            Full service details coming soon. In the meantime,{" "}
            <Link
              href="/#services"
              className="text-[#1b3a5b] hover:opacity-70 transition-opacity"
            >
              view our services
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
