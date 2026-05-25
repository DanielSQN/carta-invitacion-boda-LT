import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        search: "?v=20260525-assets-refresh-2",
      },
    ],
  },
};

export default nextConfig;
