import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import bundleAnalyzerInit from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";

const withBundleAnalyzer = bundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

export default withBundleAnalyzer(withSerwist(nextConfig));
