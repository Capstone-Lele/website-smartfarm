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
      },
      {
        protocol: 'http',
        hostname: '72.62.120.189',
        port: '9000',
        pathname: '/smartfarm-storage/**', // Mengizinkan semua gambar di dalam path ini
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  experimental: {
    mcpServer: true,
  },
  devIndicators: false,

  // Rewrites untuk proxy API for prod only
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/proxy/:path*',
  //       destination: 'http://72.62.120.189:3001/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
