/** @type {import('next').NextConfig} */
const nextConfig = {
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
        pathname: '/smartfarm-storage/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  experimental: {
    mcpServer: true,
  },
  devIndicators: false,
};

module.exports = nextConfig;