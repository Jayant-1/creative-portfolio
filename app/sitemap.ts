import { MetadataRoute } from "next";
import { projects, siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS } from "@/lib/components-data";

export default function sitemap(): MetadataRoute.Sitemap {
  // lastModified is omitted across routes because exact per-route substantive
  // change dates are not tracked in git/metadata. This avoids misleading search engines
  // with fabricated or blanket timestamps, allowing crawlers to rely on genuine HTTP headers.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/components`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/experience`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const componentRoutes: MetadataRoute.Sitemap = CRAFT_COMPONENTS.map((c) => ({
    url: `${siteUrl}/components/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
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
