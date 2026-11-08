"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import type { SheetImage } from "./collect-images";

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous image" : "Next image"}
      className="flex size-11 shrink-0 items-center justify-center border border-[rgba(17,17,17,0.28)] text-[#111111] transition-colors duration-300 hover:border-[#111111] sm:size-[52px]"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

/** "All photographs": thumbnail sheet that opens a full-screen lightbox. */
export function ContactSheet({ images }: { images: SheetImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? i : (i + dir + count) % count)),
    [count],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  // Keep the active thumbnail in view as the viewer steps through.
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  }, [open]);

  if (count === 0) return null;
  const current = open === null ? null : images[open];

  return (
    <section className="bg-[#f6f4ef] py-16 md:py-28">
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10 lg:px-14">
        <div className="flex items-end justify-between gap-4 border-b border-[rgba(17,17,17,0.12)] pb-6">
          <div>
            <MonoLabel className="text-[#1b3a5b]">Gallery</MonoLabel>
            <h2 className="mt-5 font-serif text-[clamp(36px,4vw,64px)] font-light leading-[0.95] tracking-[-0.02em] text-[#111111]">
              All <em>photographs</em>
            </h2>
          </div>
          <MonoLabel className="text-[#9a968d]">
            {count} {count === 1 ? "image" : "images"}
          </MonoLabel>
        </div>

        <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open image ${i + 1} of ${count}: ${img.alt}`}
                className="relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-[#ece8df] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#1b3a5b]"
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.03]"
                  placeholder={img.lqip ? "blur" : "empty"}
                  blurDataURL={img.lqip ?? undefined}
                  sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 33vw"
                />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(0)}
          className="mt-8 inline-flex items-center gap-3 border border-[rgba(17,17,17,0.28)] px-6 py-3 font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-[#6b6b66] transition-colors duration-300 hover:border-[rgba(17,17,17,0.5)] hover:text-[#111111]"
        >
          View full screen <span aria-hidden>→</span>
        </button>
      </div>

      <DialogPrimitive.Root
        open={open !== null}
        onOpenChange={(o) => !o && setOpen(null)}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#f6f4ef]" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex flex-col text-[#111111] outline-none"
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="sr-only">
              Project photographs
            </DialogPrimitive.Title>
            <div className="flex items-center justify-between px-6 py-5">
              <MonoLabel className="text-[#6b6b66]">
                {String(open !== null ? open + 1 : 0).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
              </MonoLabel>
              <DialogPrimitive.Close className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60">
                Close ✕
              </DialogPrimitive.Close>
            </div>

            <div className="flex min-h-0 flex-1 items-center gap-3 px-3 sm:gap-6 sm:px-6">
              <ArrowButton direction="prev" onClick={() => step(-1)} />
              <div className="relative h-full min-w-0 flex-1">
                {current && (
                  <Image
                    key={current.id}
                    src={current.url}
                    alt={current.alt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                )}
              </div>
              <ArrowButton direction="next" onClick={() => step(1)} />
            </div>

            <p className="min-h-[3rem] px-6 pt-4 text-center font-sans text-[13px] leading-[1.55] text-[#6b6b66]">
              {current?.caption}
            </p>

            <ul className="flex gap-2 overflow-x-auto px-6 pb-6 [scrollbar-width:none] sm:justify-center">
              {images.map((img, i) => (
                <li key={img.id} className="shrink-0">
                  <button
                    type="button"
                    ref={i === open ? activeThumbRef : undefined}
                    onClick={() => setOpen(i)}
                    aria-label={`Show image ${i + 1} of ${count}: ${img.alt}`}
                    aria-current={i === open}
                    className={cn(
                      "relative block h-12 w-16 overflow-hidden bg-[#ece8df] outline-offset-2 transition-opacity duration-300 sm:h-14 sm:w-20",
                      i === open
                        ? "opacity-100 outline outline-1 outline-[#111111]"
                        : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </section>
  );
}
