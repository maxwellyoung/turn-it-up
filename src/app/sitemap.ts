import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wherehaveyoubeen.blog";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/release`,
      lastModified: new Date("2025-03-14"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
