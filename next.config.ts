import type { NextConfig } from "next";

const PREFERS_MARKDOWN = [
  { type: "header", key: "accept", value: "(.*)text/markdown(.*)" },
] as const;

const PAGES = [
  { source: "/", md: "/index.md", destination: "/api/markdown" },
  { source: "/blog", md: "/blog.md", destination: "/api/markdown/blog" },
  { source: "/blog/:slug", md: "/blog/:slug.md", destination: "/api/markdown/blog/:slug" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  rewrites: async () => ({
    beforeFiles: PAGES.flatMap(({ source, md, destination }) => [
      { source: md, destination },
      { source, destination, has: [...PREFERS_MARKDOWN] },
    ]),
  }),
};

export default nextConfig;
