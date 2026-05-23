import { cn } from "@/lib/utils";

export type PlaceholderVariant =
  | "daylight"
  | "stone"
  | "wood"
  | "plaster"
  | "dusk"
  | "garden";

const gradients: Record<PlaceholderVariant, string> = {
  daylight:
    "linear-gradient(135deg, #c9b898 0%, #b8a080 20%, #d4c4a2 45%, #c2ad8c 65%, #e0d0b4 85%, #c8b898 100%)",
  stone:
    "linear-gradient(160deg, #a8a9aa 0%, #9a9b9e 25%, #8d8e92 50%, #6e7073 70%, #8a8c90 100%)",
  wood: "linear-gradient(120deg, #7a5a18 0%, #5e4210 20%, #8a6822 45%, #6a4e14 65%, #9c7c32 85%, #5e4210 100%)",
  plaster:
    "linear-gradient(145deg, #eae6dc 0%, #ddd8cc 30%, #d0cabb 55%, #c8c2b0 75%, #d4cec0 100%)",
  dusk: "linear-gradient(160deg, #252f4a 0%, #1e2840 25%, #2d3a58 50%, #1a2238 70%, #3a4872 100%)",
  garden:
    "linear-gradient(135deg, #4a6432 0%, #3a5028 20%, #2c4020 45%, #5a7840 65%, #3e5830 85%, #2c4020 100%)",
};

interface PlaceholderProps {
  variant?: PlaceholderVariant;
  className?: string;
  aspectRatio?: number;
  "aria-hidden"?: boolean;
}

export function Placeholder({
  variant = "daylight",
  className,
  aspectRatio,
  "aria-hidden": ariaHidden = true,
}: PlaceholderProps) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={cn("w-full", className)}
      style={{
        backgroundImage: gradients[variant],
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...(aspectRatio
          ? { aspectRatio: String(aspectRatio) }
          : { height: "100%" }),
      }}
    />
  );
}
