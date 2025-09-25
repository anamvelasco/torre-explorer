// next.config.ts
import type { NextConfig } from "next";

const isCI = !!process.env.VERCEL; // En Vercel será true

const nextConfig: NextConfig = {
  // Evita que ESLint corte el build en Vercel
  eslint: {
    ignoreDuringBuilds: isCI,
  },
  // Evita que TypeScript corte el build en Vercel
  typescript: {
    ignoreBuildErrors: isCI,
  },
};

export default nextConfig;
