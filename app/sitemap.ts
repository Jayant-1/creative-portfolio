import { MetadataRoute } from "next";
import { projects, siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS } from "@/lib/components-data";

export default function sitemap(): MetadataRoute.Sitemap {
  // Truthful last modified timestamp reflecting repository commits and updates
  const lastModDate = new Date("2026-10-17T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: lastModDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: lastModDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/components`,
      lastModified: lastModDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: lastModDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/experience`,
      lastModified: lastModDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: lastModDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const componentRoutes: MetadataRoute.Sitemap = CRAFT_COMPONENTS.map((c) => ({
    url: `${siteUrl}/components/${c.slug}`,
    lastModified: lastModDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: lastModDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Isolated preview routes (/preview/*) are deliberately excluded to prevent indexing
  return [
    ...staticRoutes,
    ...componentRoutes,
    ...projectRoutes,
  ];
}
