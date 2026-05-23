"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  const labelClass = cn(
    "transition-colors duration-500",
    scrolled ? "text-[#111111]" : "text-white mix-blend-difference",
  );

  const dividerClass = cn(
    "w-px h-3 mx-2 flex-shrink-0 transition-colors duration-500",
    scrolled ? "bg-[rgba(17,17,17,0.28)]" : "bg-white/40",
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 pointer-events-none"
      role="banner"
    >
      {/* Top-left corner label */}
      <div className="absolute left-5 top-5 pointer-events-auto">
        <MonoLabel className={cn(labelClass, "block text-[9px]")}>
          Emery Design Studio
        </MonoLabel>
        <MonoLabel
          className={cn(labelClass, "block text-[9px] mt-1 opacity-60")}
        >
          N&nbsp;47.68°&nbsp;·&nbsp;W&nbsp;122.20°&nbsp;—&nbsp;Kirkland
        </MonoLabel>
      </div>

      {/* Top-right corner label */}
      <div className="absolute right-5 top-5 text-right pointer-events-auto">
        <MonoLabel className={cn(labelClass, "block text-[9px]")}>
          Established MMXIV
        </MonoLabel>
        <MonoLabel
          className={cn(labelClass, "block text-[9px] mt-1 opacity-60")}
        >
          Index&nbsp;№01&nbsp;—&nbsp;Home
        </MonoLabel>
      </div>

      {/* Centered pill nav */}
      <nav
        aria-label="Main navigation"
        className="absolute inset-x-0 top-4 flex justify-center pointer-events-auto"
      >
        <div
          className={cn(
            "flex items-center px-5 py-2.5 rounded-full transition-all duration-500",
            scrolled
              ? "bg-[rgba(246,244,239,0.88)] backdrop-blur-[18px] shadow-[0_2px_24px_rgba(17,17,17,0.08)] border border-[rgba(17,17,17,0.06)]"
              : "bg-transparent",
          )}
        >
          {/* EMERY wordmark */}
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

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-[10px] tracking-[0.16em] uppercase px-3 py-1 transition-colors duration-500 hover:opacity-70",
                scrolled ? "text-[#111111]" : "text-white mix-blend-difference",
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
    </header>
  );
}
