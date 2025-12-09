import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "r-xx.bstatic.com", "lh3.googleusercontent.com", "172.26.10.213:7247"],
  },
};

export default nextConfig;
