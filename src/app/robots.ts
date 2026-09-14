import type { MetadataRoute } from "next";

import { SITE_URL } from "@/modules/utils";

// Not a real site, avoid indexing.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
