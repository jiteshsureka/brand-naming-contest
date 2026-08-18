import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Netlify Functions cap request bodies well under 10MB; stay safely inside that.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
