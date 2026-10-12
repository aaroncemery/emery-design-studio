import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const title =
    request.nextUrl.searchParams.get("title") ?? "Emery Design Studio";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "90px",
        backgroundColor: "#f6f4ef",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#1b3a5b",
          marginBottom: 36,
        }}
      >
        Emery Design Studio
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 64,
          lineHeight: 1.08,
          color: "#111111",
          maxWidth: 950,
        }}
      >
        {title}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
