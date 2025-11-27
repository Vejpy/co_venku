import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "r-xx.bstatic.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
