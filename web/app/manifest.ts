import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Use Alarm",
    short_name: "UseAlarm",
    description: "Check & manage subscriptions with alarm",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/static/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/static/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/static/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/static/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/static/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
