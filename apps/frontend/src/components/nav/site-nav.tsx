"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import { resolveNavHref, resolveNavLabel } from "@/lib/sanity/utils";
import type { Navigation, SiteSettings } from "@/lib/sanity/types";

const FALLBACK_NAV_LINKS = [
  { key: "/work", label: "Work", href: "/work" },
  { key: "/studio", label: "Studio", href: "/studio" },
  { key: "/services", label: "Services", href: "/services" },
  { key: "/journal", label: "Journal", href: "/journal" },
];

interface SiteNavProps {
  navigation?: Navigation | null;
  siteSettings?: SiteSettings | null;
}

export function SiteNav({ navigation, siteSettings }: SiteNavProps) {
  const brandLabel =
    stegaClean(siteSettings?.headerBrandLabel) || "Emery Design Studio";
  const locationLabel =
    stegaClean(siteSettings?.headerLocationLabel) ||
    "Puget Sound · Pacific Northwest";
  const establishedLabel =
    stegaClean(siteSettings?.headerEstablishedLabel) || "Established MMXIV";
  const indexLabel =
    stegaClean(siteSettings?.headerIndexLabel) || "Index №01 — Home";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const scrolledRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 60;
    if (next !== scrolledRef.current) {
      scrolledRef.current = next;
      setScrolled(next);
    }
  });

  const resolvedLinks = navigation?.items?.length
    ? navigation.items.map((item) => ({
        key: item._key,
        label: resolveNavLabel(item),
        href: resolveNavHref(item),
      }))
    : FALLBACK_NAV_LINKS;

  const labelClass = cn(
    "transition-colors duration-500",
    scrolled ? "text-[#111111]" : "text-white mix-blend-difference",
  );

  const dividerClass = cn(
    "w-px h-3 mx-2 flex-shrink-0 transition-colors duration-500",
    scrolled ? "bg-[rgba(17,17,17,0.28)]" : "bg-white/40",
  );

  const pillBg =
    scrolled || menuOpen
      ? "bg-[rgba(246,244,239,0.88)] backdrop-blur-[18px] shadow-[0_2px_24px_rgba(17,17,17,0.08)] border border-[rgba(17,17,17,0.06)]"
      : "bg-transparent";

  const pillTextClass = cn(
    "transition-colors duration-500",
    scrolled || menuOpen ? "text-[#111111]" : "text-white mix-blend-difference",
  );

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 pointer-events-none"
        role="banner"
      >
        {/* Corner labels — desktop only */}
        <div className="hidden md:block absolute left-5 top-5 pointer-events-auto">
          <MonoLabel className={cn(labelClass, "block text-[9px]")}>
            {brandLabel}
          </MonoLabel>
          <MonoLabel
            className={cn(labelClass, "block text-[9px] mt-1 opacity-60")}
          >
            {locationLabel}
          </MonoLabel>
        </div>

        <div className="hidden md:block absolute right-5 top-5 text-right pointer-events-auto">
          <MonoLabel className={cn(labelClass, "block text-[9px]")}>
            {establishedLabel}
          </MonoLabel>
          <MonoLabel
            className={cn(labelClass, "block text-[9px] mt-1 opacity-60")}
          >
            {indexLabel}
          </MonoLabel>
        </div>

        {/* Desktop full pill nav */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex absolute inset-x-0 top-4 justify-center pointer-events-auto"
        >
          <div
            className={cn(
              "flex items-center px-5 py-2.5 rounded-full transition-all duration-500",
              scrolled
                ? "bg-[rgba(246,244,239,0.88)] backdrop-blur-[18px] shadow-[0_2px_24px_rgba(17,17,17,0.08)] border border-[rgba(17,17,17,0.06)]"
                : "bg-transparent",
            )}
          >
            <Link
              href="/"
              className={cn(
                "font-mono text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-500",
                scrolled ? "text-[#111111]" : "text-white mix-blend-difference",
              )}
            >
              EMERY
            </Link>

            <div className={dividerClass} />

            {resolvedLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "font-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1 transition-colors duration-500 hover:opacity-70",
                  scrolled
                    ? "text-[#111111]"
                    : "text-white mix-blend-difference",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className={dividerClass} />

            <Link
              href="/#contact"
              className={cn(
                "font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-1.5 rounded-full border transition-all duration-500",
                scrolled
                  ? "text-[#1b3a5b] border-[#1b3a5b] hover:bg-[#1b3a5b] hover:text-white"
                  : "text-white border-white/70 hover:bg-white/10 mix-blend-difference",
              )}
            >
              Inquire&nbsp;→
            </Link>
          </div>
        </nav>

        {/* Mobile collapsed pill */}
        <div className="md:hidden absolute inset-x-0 top-4 flex justify-center pointer-events-auto">
          <div
            className={cn(
              "flex items-center px-5 py-2.5 rounded-full transition-all duration-500",
              pillBg,
            )}
          >
            <Link
              href="/"
              className={cn(
                "font-mono text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-500",
                pillTextClass,
              )}
            >
              EMERY
            </Link>

            <div className={dividerClass} />

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "font-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1 transition-colors duration-500",
                pillTextClass,
              )}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 md:hidden bg-[rgba(246,244,239,0.97)] backdrop-blur-[18px] flex flex-col justify-center px-8"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav aria-label="Mobile navigation">
            <ul className="space-y-0">
              {resolvedLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-serif italic text-[#111111] leading-tight py-5 border-b border-[rgba(17,17,17,0.08)] hover:text-[#1b3a5b] transition-colors duration-300"
                    style={{ fontSize: "clamp(36px, 9vw, 52px)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-4 bg-[#1b3a5b] text-white inline-flex items-center gap-3"
              >
                Begin an inquiry&nbsp;→
              </Link>
            </div>
          </nav>

          <div className="absolute bottom-8 left-8">
            <MonoLabel className="text-[#9a968d] text-[9px] block">
              {brandLabel}
            </MonoLabel>
            <MonoLabel className="text-[#9a968d] text-[9px] block mt-1 opacity-60">
              {locationLabel}
            </MonoLabel>
          </div>
        </div>
      )}
    </>
  );
}
