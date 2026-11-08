"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { MonoLabel } from "@/components/primitives/mono-label";
import type { SheetImage } from "./collect-images";

/** "All photographs": thumbnail sheet that opens a full-screen lightbox. */
export function ContactSheet({ images }: { images: SheetImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;

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
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#111111]/95" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex flex-col outline-none"
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="sr-only">
              Project photographs
            </DialogPrimitive.Title>
            <div className="flex items-center justify-between px-6 py-5 text-white/80">
              <MonoLabel>
                {open !== null ? open + 1 : 0} / {count}
              </MonoLabel>
              <DialogPrimitive.Close className="font-mono text-[10px] uppercase tracking-[0.18em] hover:text-white">
                Close ✕
              </DialogPrimitive.Close>
            </div>
            <div className="relative min-h-0 flex-1">
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
            <div className="flex items-center justify-between gap-6 px-6 py-5 text-white/80">
              <button
                type="button"
                onClick={() => step(-1)}
                className="font-mono text-[10px] uppercase tracking-[0.18em] hover:text-white"
              >
                ← Prev
              </button>
              <p className="max-w-[60ch] text-center font-sans text-[13px]">
                {current?.caption}
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                className="font-mono text-[10px] uppercase tracking-[0.18em] hover:text-white"
              >
                Next →
              </button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </section>
  );
}
