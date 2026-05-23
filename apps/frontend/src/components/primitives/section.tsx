import { cn } from "@/lib/utils";

type PaddingY = "none" | "sm" | "md" | "lg" | "xl";
type As = "section" | "div" | "article" | "footer" | "header";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  as?: As;
  paddingY?: PaddingY;
  fullBleed?: boolean;
}

const paddingMap: Record<PaddingY, string> = {
  none: "",
  sm: "py-16",
  md: "py-24",
  lg: "py-32",
  xl: "py-40 md:py-48",
};

export function Section({
  children,
  className,
  innerClassName,
  id,
  as: Tag = "section",
  paddingY = "lg",
  fullBleed = false,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("w-full", className)}>
      {fullBleed ? (
        children
      ) : (
        <div
          className={cn(
            "mx-auto w-full max-w-[1480px] px-6 md:px-10 lg:px-14",
            paddingMap[paddingY],
            innerClassName,
          )}
        >
          {children}
        </div>
      )}
    </Tag>
  );
}
