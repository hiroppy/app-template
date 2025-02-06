import type { NextConfig } from "next";
import { config } from "./env";

config();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*?)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  /* start: sample */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  /* end: sample */
  experimental: {
    typedRoutes: true,
    authInterrupts: true,
    dynamicIO: true,
  },
  /* start: otel */
  webpack: (config, { isServer }) => {
    if (isServer) {
      // https://github.com/open-telemetry/opentelemetry-js/issues/4173
      config.ignoreWarnings = [{ module: /opentelemetry/ }];
    }
    return config;
  },
  /* end: otel */
};

export default nextConfig;
