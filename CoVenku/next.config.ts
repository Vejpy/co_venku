import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", port: "", pathname: "/**" },
      { protocol: "https", hostname: "r-xx.bstatic.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "www.hkregion.cz", port: "", pathname: "/**" },
      { protocol: "https", hostname: "nextjs.org", port: "", pathname: "/**" },
      { protocol: "https", hostname: "example.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "cdn.example.org", port: "", pathname: "/**" },
      { protocol: "https", hostname: "tailwindcss.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "raw.githubusercontent.com", port: "", pathname: "/**" }, 
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" }, 
      { protocol: "https", hostname: "cdn.jsdelivr.net", port: "", pathname: "/**" }, 
      { protocol: "https", hostname: "images.seeklogo.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "i.pinimg.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "leafletjs.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "getlogovector.com", port: "", pathname: "/**" },
    ],
  },
};

export default nextConfig;