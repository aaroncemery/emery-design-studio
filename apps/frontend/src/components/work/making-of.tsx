import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import { CTA } from "@/components/primitives/cta";
import { ProjectFigure } from "./project-figure";
import { SplitHeadline } from "./split-headline";
import { COLUMN, FRAME } from "./project-story";
import type { MakingOf } from "@/lib/sanity/types";

type Note = NonNullable<MakingOf["notes"]>[number];

const bodyText =
  "text-pretty font-serif text-[17px] font-normal leading-[1.7] text-[#2a2a2a]";

/** True when the editor has filled in anything worth rendering. */
export function hasMakingOfContent(m: MakingOf | null): m is MakingOf {
  return !!(m && (m.heading || m.intro || m.notes?.length || m.maker?.name));
}

function NoteText({ note }: { note: Note }) {
  return (
    <>
      {note.label && (
        <MonoLabel className="mb-3 flex items-center gap-4 text-[#1b3a5b]">
          <span aria-hidden className="h-px w-8 bg-[#1b3a5b]/60" />
          {note.label}
        </MonoLabel>
      )}
      {note.text && <p className={bodyText}>{note.text}</p>}
    </>
  );
}

/**
 * Layout follows content, not position: 2+ images pair up, one wide image
 * bleeds, one image with text sits beside it (alternating sides), a lone
 * image floats to a side, text alone sits in the column.
 */
function MakingNote({ note, flip }: { note: Note; flip: boolean }) {
  const images = (note.images ?? []).filter((i) => i.asset?.url);
  const hasText = !!(note.label || note.text);

  if (images.length > 1) {
    return (
      <div className="flex flex-col gap-8 py-8 md:py-12">
        {hasText && (
          <div className={FRAME}>
            <div className={COLUMN}>
              <NoteText note={note} />
            </div>
          </div>
        )}
        <div className={FRAME}>
          <div
            className={cn(
              "grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:col-span-10 lg:col-start-2",
              flip && "sm:[&>*:first-child]:order-2",
            )}
          >
            {images.map((image) => (
              <ProjectFigure
                key={image.asset?._id ?? image.alt}
                image={image}
                sizes="(min-width: 640px) 45vw, 100vw"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 1 && note.wide) {
    return (
      <div className="flex flex-col gap-8 py-8 md:py-12">
        {hasText && (
          <div className={FRAME}>
            <div className={COLUMN}>
              <NoteText note={note} />
            </div>
          </div>
        )}
        <div className={FRAME}>
          <ProjectFigure
            image={images[0]}
            className="lg:col-span-12"
            sizes="100vw"
          />
        </div>
      </div>
    );
  }

  if (images.length === 1 && hasText) {
    return (
      <div className={cn(FRAME, "items-start gap-y-6 py-8 md:py-12")}>
        <div className="lg:col-span-5 lg:col-start-4 lg:row-start-1">
          <NoteText note={note} />
        </div>
        <ProjectFigure
          image={images[0]}
          className={cn(
            "max-w-[360px] lg:row-start-1 lg:max-w-none",
            flip
              ? "lg:col-span-2 lg:col-start-1"
              : "lg:col-span-3 lg:col-start-10",
          )}
          sizes="(min-width: 1024px) 25vw, 70vw"
        />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={cn(FRAME, "py-8 md:py-12")}>
        <ProjectFigure
          image={images[0]}
          className={cn(
            "max-w-[480px] lg:max-w-none",
            flip
              ? "lg:col-span-4 lg:col-start-2"
              : "lg:col-span-4 lg:col-start-8",
          )}
          sizes="(min-width: 1024px) 33vw, 80vw"
        />
      </div>
    );
  }

  if (!hasText) return null;
  return (
    <div className={cn(FRAME, "py-6 md:py-8")}>
      <div className={COLUMN}>
        <NoteText note={note} />
      </div>
    </div>
  );
}

function MakerStrip({ maker }: { maker: NonNullable<MakingOf["maker"]> }) {
  if (!maker.name) return null;
  const role = [
    maker.discipline?.toLowerCase(),
    maker.location && `based in ${maker.location}`,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cn(FRAME, "py-12 md:py-16")}>
      <div className="grid grid-cols-1 items-center gap-6 border-t border-[rgba(17,17,17,0.28)] pt-10 sm:grid-cols-[auto_1fr_auto] sm:gap-8 lg:col-span-10 lg:col-start-2">
        {maker.portrait?.asset?.url && (
          <ProjectFigure
            image={maker.portrait}
            ratio={1}
            hideCaption
            className="w-24 sm:w-28"
            sizes="112px"
          />
        )}
        <div className="flex flex-col gap-3 sm:col-start-2">
          <MonoLabel className="text-[#1b3a5b]">The maker</MonoLabel>
          <p className={bodyText}>
            Made by <strong className="font-semibold">{maker.name}</strong>
            {role && `, ${role}`}.
          </p>
          {maker.quote && (
            <p className="font-serif text-[20px] font-light italic leading-[1.3] text-[#2a2a2a]">
              “{maker.quote}”
            </p>
          )}
        </div>
        {maker.url && (
          <CTA
            href={maker.url}
            variant="ghost"
            external
            className="justify-self-start sm:justify-self-end"
          >
            Visit the maker
          </CTA>
        )}
      </div>
    </div>
  );
}

export function MakingOfSection({ makingOf }: { makingOf: MakingOf }) {
  const notes = makingOf.notes ?? [];
  // Alternate sides only across notes that place an image beside text.
  let side = 0;
  return (
    <section
      id="making-of"
      className="scroll-mt-24 bg-[#ece8df] py-16 md:py-28"
    >
      {(makingOf.heading || makingOf.intro) && (
        <div className={FRAME}>
          <div className={COLUMN}>
            <MonoLabel className="text-[#1b3a5b]">
              {makingOf.label || "The making of"}
            </MonoLabel>
            {makingOf.heading && (
              <h2 className="mt-5 font-serif text-[clamp(36px,4vw,64px)] font-light leading-[0.95] tracking-[-0.02em] text-[#111111]">
                <SplitHeadline text={makingOf.heading} />
              </h2>
            )}
            {makingOf.intro && (
              <p className="mt-7 max-w-[560px] text-pretty font-serif text-[clamp(20px,2vw,26px)] font-light leading-[1.4] text-[#4a4a44]">
                {makingOf.intro}
              </p>
            )}
          </div>
        </div>
      )}
      {notes.map((note) => {
        const beside = (note.images?.length ?? 0) >= 1 && !note.wide;
        const flip = beside ? side++ % 2 === 1 : false;
        return <MakingNote key={note._key} note={note} flip={flip} />;
      })}
      {makingOf.maker && <MakerStrip maker={makingOf.maker} />}
    </section>
  );
}
