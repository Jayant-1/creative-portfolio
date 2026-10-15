import { MetadataRoute } from "next";
import { projects, siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS } from "@/lib/components-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/experience",
    "/components",
    "/projects",
    "/contact",
  ].map((path) => ({ url: `${siteUrl}${path}` }));

  const componentRoutes: MetadataRoute.Sitemap = CRAFT_COMPONENTS.map((c) => ({
    url: `${siteUrl}/components/${c.slug}`,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
  }));

  return [
    ...staticRoutes,
    ...componentRoutes,
    ...projectRoutes,
  ];
}
