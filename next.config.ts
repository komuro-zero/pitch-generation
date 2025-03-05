import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: false, // 🚨 Disable Turbopack
  },
  /* config options here */
};

export default nextConfig;
