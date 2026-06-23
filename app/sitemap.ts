import type { MetadataRoute } from "next";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://quanticshpk.com";

  const staticPages = [
    { url: base, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/services`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/products`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/projects`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/support`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const servicePages = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...servicePages];
}
