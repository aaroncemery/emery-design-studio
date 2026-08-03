"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type CTAVariant = "solid" | "accent" | "ghost" | "onImage";

interface CTAProps {
  href: string;
  children: React.ReactNode;
  variant?: CTAVariant;
  className?: string;
  arrow?: boolean;
  external?: boolean;
}

const variants: Record<CTAVariant, string> = {
  solid:
    "border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#f6f4ef]",
  accent:
    "border border-[#1b3a5b] bg-[#1b3a5b] text-white hover:bg-[#152e4a] hover:border-[#152e4a]",
  ghost:
    "border border-[rgba(17,17,17,0.28)] text-[#6b6b66] hover:bg-[#f6f4ef] hover:text-[#111111] hover:border-[rgba(17,17,17,0.5)]",
  onImage:
    "border border-white/80 text-white hover:bg-[#f6f4ef] hover:text-[#111111] hover:border-[#f6f4ef]",
};

export function CTA({
  href,
  children,
  variant = "solid",
  className,
  arrow = true,
  external = false,
}: CTAProps) {
  const baseClass = cn(
    "group inline-flex items-center gap-3 px-6 py-3 font-mono text-[10px] tracking-[0.16em] uppercase",
    "transition-all duration-[360ms] ease-[cubic-bezier(.2,.7,.2,1)]",
    variants[variant],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="transition-transform duration-[360ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClass}>
      {content}
    </Link>
  );
}
