import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "qualfi — 60-Second Bio Funnel for Fitness Coaches",
    short_name: "qualfi",
    description:
      "Replace your dead Linktree with a custom 60-second macro & training split diagnostic. Pre-qualify fitness leads (0–100 score) and route buyers to WhatsApp in <2s.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#faf7f2",
    categories: ["business", "fitness", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
