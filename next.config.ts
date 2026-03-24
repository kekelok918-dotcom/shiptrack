import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript errors are handled by tsc --noEmit in CI
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
