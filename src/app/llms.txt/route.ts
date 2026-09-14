import { llmsTxt } from "@/modules/markdown-content";

/** Site index for agents, per https://llmstxt.org. */
export async function GET() {
  return new Response(await llmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
    },
  });
}
