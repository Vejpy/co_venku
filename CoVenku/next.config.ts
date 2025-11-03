import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "r-xx.bstatic.com"],
  },
};

export default nextConfig;
