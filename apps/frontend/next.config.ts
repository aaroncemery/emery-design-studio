import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Sanity's CDN resizes and converts images itself; see the loader.
    loader: "custom",
    loaderFile: "./src/lib/sanity/image-loader.ts",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://www.sanity.io https://emery-design.sanity.studio http://localhost:3333",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
