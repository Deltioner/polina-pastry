import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://polina-pastry.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/ukraine", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/shop/cakes", priority: 0.8, changeFrequency: "weekly" },
    { path: "/shop/pastries", priority: 0.8, changeFrequency: "weekly" },
    { path: "/shop/cookies", priority: 0.7, changeFrequency: "weekly" },
    { path: "/shop/bread", priority: 0.7, changeFrequency: "weekly" },
    { path: "/shop/seasonal", priority: 0.7, changeFrequency: "weekly" },
    { path: "/shop/custom", priority: 0.8, changeFrequency: "weekly" },
  ];

  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
