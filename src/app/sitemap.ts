import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const LAST_MODIFIED = new Date("2026-10-29");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
