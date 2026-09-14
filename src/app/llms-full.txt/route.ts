import { allPostsMarkdown, llmsTxt } from "@/modules/markdown-content";

/** The llms.txt index followed by every blog post, as one Markdown file. */
export async function GET() {
  const [index, posts] = await Promise.all([llmsTxt(), allPostsMarkdown()]);

  return new Response([index, ...posts].join("\n\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
