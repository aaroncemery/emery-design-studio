import { cn } from "@/lib/utils";

interface RuleProps {
  className?: string;
  strong?: boolean;
}

export function Rule({ className, strong = false }: RuleProps) {
  return (
    <hr
      className={cn(
        "border-0 border-t",
        strong
          ? "border-[rgba(17,17,17,0.28)]"
          : "border-[rgba(17,17,17,0.12)]",
        className,
      )}
    />
  );
}
