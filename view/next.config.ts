import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  // Explicitly configure turbopack as required by Next 16 when using a custom webpack plugin (from next-pwa)
  turbopack: {},
};

export default withPWA(nextConfig);
