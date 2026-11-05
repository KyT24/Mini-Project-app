import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Proxy ke backend agar cookie login menjadi first-party di domain frontend
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://ih-clinic-api.vercel.app/api/v1/:path*",
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
