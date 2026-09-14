import type { MetadataRoute } from "next";

import { sanityFetch } from "@/modules/sanity/lib/live";
import { POST_SITEMAP_QUERY } from "@/modules/sanity/lib/queries";
import { TAGS } from "@/modules/sanity/lib/tags";
import { SITE_URL } from "@/modules/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await sanityFetch({
    query: POST_SITEMAP_QUERY,
    perspective: "published",
    stega: false,
    tags: [TAGS.post],
  });

  const latestUpdate = posts
    .map((post) => post._updatedAt)
    .sort()
    .at(-1);

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: latestUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post._updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
