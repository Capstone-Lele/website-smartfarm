import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "i.pravatar.cc",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "localhost",
        protocol: "http",
        port: "9000",
        pathname: "/smartfarm-storage/**",
      },
      {
        hostname: "ui-avatars.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      }
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  experimental: {
    mcpServer: true,
  },
};

export default nextConfig;
