import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["api.dicebear.com", "images.unsplash.com"],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
