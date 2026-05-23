import { cn } from "@/lib/utils";

interface MonoLabelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "span" | "p" | "div" | "label";
}

export function MonoLabel({
  children,
  className,
  style,
  as: Tag = "span",
}: MonoLabelProps) {
  return (
    <Tag
      className={cn(
        "font-mono text-[10px] tracking-[0.18em] uppercase leading-none",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
