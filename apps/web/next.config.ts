import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(import.meta.dirname, "../.."),
  },
  reactStrictMode: true,
};

export default nextConfig;
