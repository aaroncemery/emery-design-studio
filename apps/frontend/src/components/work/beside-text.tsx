import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/primitives/mono-label";
import { sanityImageAspect } from "@/lib/sanity/image";
import { FIG, figSizes, figWidths, sideMode } from "@/lib/work/layout";
import { FRAME, COLUMN, bodyText } from "./frame";
import { ProjectFigure } from "./project-figure";
import type { ComponentProps } from "react";

type Image = ComponentProps<typeof ProjectFigure>["image"];

interface BesideTextProps {
  image: Image;
  text?: string | null;
  label?: string | null;
  /** Which side the image sits on. */
  side: "left" | "right";
  /** `data-block` kind for the spacing rules. */
  block?: string;
}

/**
 * Text with one image beside it. Picks a layout from the content:
 *  - margin: long text stays in the reading column, a small image hangs into
 *    the margin beside it;
 *  - spread: short text sits against a larger image, bottom-aligned so the
 *    last line is level with the caption (the empty space goes above).
 * Below lg everything stacks: text, then image, then caption.
 */
export function BesideText({
  image,
  text,
  label,
  side,
  block = "side",
}: BesideTextProps) {
  const ratio = sanityImageAspect(image) ?? 4 / 3;
  const left = side === "left";
  const mode = sideMode(text, !!label, ratio);

  const copy = (
    <>
      {label && (
        <MonoLabel className="mb-3 flex items-center gap-4 text-[#1b3a5b]">
          <span aria-hidden className="h-px w-8 bg-[#1b3a5b]/60" />
          {label}
        </MonoLabel>
      )}
      {text && <p className={bodyText}>{text}</p>}
    </>
  );

  if (mode === "margin") {
    const width = figWidths(ratio, FIG.marginArea, FIG.marginEdge - 48);
    return (
      <div data-block={block} className={cn(FRAME, "items-start gap-y-6")}>
        <div className={cn(COLUMN, "lg:row-start-1")}>{copy}</div>
        <ProjectFigure
          image={image}
          width={width}
          sizes={figSizes(width)}
          className={cn(
            "lg:row-start-1 lg:col-span-3 lg:max-w-[calc(100%-1.5rem)]",
            left
              ? "lg:col-start-1 lg:mr-6 lg:justify-self-end"
              : "lg:col-start-10 lg:ml-6 lg:justify-self-start",
          )}
        />
      </div>
    );
  }

  const width = figWidths(ratio, FIG.spreadArea, FIG.spreadMaxW);
  return (
    <div data-block={block} className={FRAME}>
      <div
        style={{ "--wd": `${width.desktop}px` } as React.CSSProperties}
        className={cn(
          "flex flex-col gap-6 lg:col-span-12 lg:items-end lg:justify-end lg:gap-14",
          left ? "lg:flex-row-reverse" : "lg:flex-row",
        )}
      >
        <div className="lg:w-[420px] lg:max-w-[calc(100%-var(--wd)-3.5rem)] lg:flex-none lg:pb-[30px]">
          {copy}
        </div>
        <ProjectFigure
          image={image}
          width={width}
          sizes={figSizes(width)}
          className="lg:max-w-[45%] lg:flex-none"
        />
      </div>
    </div>
  );
}
