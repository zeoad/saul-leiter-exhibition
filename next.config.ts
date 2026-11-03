import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Static export has no optimizer; a custom loader points next/image's
    // generated srcset at the pre-sized variants from
    // scripts/responsive-images.mjs (see src/lib/image-loader.ts).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Align srcset candidates with the pre-generated buckets so small
    // viewports can actually hit the 480/960 variants.
    deviceSizes: [480, 768, 960, 1280, 1600, 1920],
  },
  trailingSlash: true,
};

export default nextConfig;