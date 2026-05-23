"use client";

import Link from "next/link";
import { MonoLabel } from "@/components/primitives/mono-label";
import { Rule } from "@/components/primitives/rule";

const studioLinks = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "Inquiry", href: "/#contact" },
];

const elsewhereLinks = [
  { label: "Instagram", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "Houzz", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#f6f4ef]" id="footer">
      {/* Massive display wordmark */}
      <div className="mx-auto w-full max-w-370 px-6 md:px-10 lg:px-14 pt-24 pb-10 overflow-hidden">
        <p
          className="font-serif leading-none tracking-tighter text-[#111111] select-none"
          style={{ fontSize: "clamp(80px, 16vw, 280px)" }}
          aria-label="Emery Studio"
        >
          <em>Emery</em>
          <span className="text-[#1b3a5b]" aria-hidden="true">
            &middot;
          </span>
          Studio
        </p>
      </div>

      <Rule strong className="mx-6 md:mx-10 lg:mx-14" />

      {/* 4-column grid */}
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10 lg:px-14 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: About + newsletter */}
          <div>
            <MonoLabel className="text-[#9a968d] block mb-5">About</MonoLabel>
            <p className="font-sans text-[#6b6b66] text-sm leading-relaxed mb-6">
              A small interior design studio based in Kirkland, Washington.
              Working with residential clients since 2014.
            </p>
            <div className="mt-6">
              <MonoLabel className="text-[#9a968d] block mb-3">
                Newsletter
              </MonoLabel>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-0">
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address for newsletter"
                  className="flex-1 bg-transparent border-b border-[rgba(17,17,17,0.2)] pb-2 font-sans text-[13px] text-[#111111] placeholder:text-[#9a968d] focus:outline-none focus:border-[#1b3a5b] transition-colors duration-300 min-w-0"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="font-mono text-[10px] tracking-[0.16em] text-[#1b3a5b] pl-3 pb-2 hover:opacity-70 transition-opacity duration-300 shrink-0"
                >
                  →
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Studio nav */}
          <div>
            <MonoLabel className="text-[#9a968d] block mb-5">Studio</MonoLabel>
            <nav aria-label="Footer studio navigation">
              <ul className="space-y-3">
                {studioLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-[#6b6b66] text-sm hover:text-[#111111] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3: Visit */}
          <div>
            <MonoLabel className="text-[#9a968d] block mb-5">Visit</MonoLabel>
            <address className="not-italic space-y-2 mb-6">
              <p className="font-sans text-[#6b6b66] text-sm">
                Emery Design Studio
              </p>
              <p className="font-sans text-[#6b6b66] text-sm">
                Kirkland, WA 98033
              </p>
            </address>
            <a
              href="mailto:hello@emerydesignstudio.com"
              className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#1b3a5b] hover:opacity-70 transition-opacity duration-300 block"
            >
              hello@emerydesignstudio.com
            </a>
            <div className="mt-4">
              <MonoLabel className="text-[#9a968d] block mb-1">Hours</MonoLabel>
              <p className="font-sans text-[#6b6b66] text-sm">
                Mon–Fri, 9–5 PT
              </p>
            </div>
          </div>

          {/* Col 4: Elsewhere */}
          <div>
            <MonoLabel className="text-[#9a968d] block mb-5">
              Elsewhere
            </MonoLabel>
            <nav aria-label="Footer social links">
              <ul className="space-y-3">
                {elsewhereLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[#6b6b66] text-sm hover:text-[#111111] transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="text-[#9a968d] text-xs"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <Rule className="mx-6 md:mx-10 lg:mx-14" />
      <div className="mx-auto w-full max-w-370 px-6 md:px-10 lg:px-14 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <MonoLabel className="text-[#9a968d] text-[9px]">
          © MMXXVI Emery Design Studio
        </MonoLabel>
        <div className="flex items-center gap-6">
          <MonoLabel className="text-[#9a968d] text-[9px]">
            Photography: Various artists
          </MonoLabel>
          <Link
            href="/terms"
            className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#9a968d] hover:text-[#111111] transition-colors duration-300"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#9a968d] hover:text-[#111111] transition-colors duration-300"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
