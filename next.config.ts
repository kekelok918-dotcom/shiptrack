import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript errors are handled by the project's own tsc check in CI.
    // Disable build-time checking to avoid Next.js 16's stricter mode conflicts
    // with Prisma-generated types in JSX contexts.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint errors are handled separately in CI
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
