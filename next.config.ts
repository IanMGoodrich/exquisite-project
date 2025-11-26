import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    // Configuration options for the Next.js Image component
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // Allow images from all hosts for now TODO: Update later.
      },
    ],
    // Other image options like unoptimized, deviceSizes, imageSizes, domains, etc.
  },
};

export default nextConfig;
