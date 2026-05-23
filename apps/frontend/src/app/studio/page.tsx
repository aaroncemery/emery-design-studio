import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/nav/site-nav";
import { SiteFooter } from "@/components/sections/site-footer";
import { Section } from "@/components/primitives/section";
import { MonoLabel } from "@/components/primitives/mono-label";

export const metadata: Metadata = {
  title: "Studio — Emery Design Studio",
  description:
    "About Emery Design Studio — a small interior design atelier in Kirkland, WA.",
};

export default function StudioPage() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Section
          className="bg-[#ece8df] min-h-[70vh] flex flex-col justify-center"
          paddingY="xl"
        >
          <MonoLabel className="text-[#1b3a5b] block mb-6">
            Studio&nbsp;—&nbsp;About
          </MonoLabel>
          <h1
            className="font-serif text-[#111111] leading-[0.92] tracking-tight mb-8 max-w-2xl"
            style={{ fontSize: "clamp(48px, 6vw, 96px)" }}
          >
            A small atelier
            <br />
            on the <em>water.</em>
          </h1>
          <p className="font-sans text-[#6b6b66] text-sm leading-relaxed max-w-sm mb-10">
            Studio content coming soon. In the meantime,{" "}
            <Link
              href="/#studio"
              className="text-[#1b3a5b] hover:opacity-70 transition-opacity"
            >
              read more
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
