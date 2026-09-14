"use server";

import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { POST_CARD_TAGS } from "@/sanity/lib/tags";

import { POSTS_PAGE_SIZE } from "./config";

export async function loadPosts(input: {
  category: string | null;
  offset: number;
  exclude: string | null;
}) {
  // Normalize inputs
  const category = typeof input.category === "string" ? input.category : null;
  const exclude = typeof input.exclude === "string" ? input.exclude : null;
  const start = Number.isInteger(input.offset) && input.offset >= 0 ? input.offset : 0;

  const { data } = await sanityFetch({
    query: POSTS_QUERY,
    params: { category, exclude, start, end: start + POSTS_PAGE_SIZE },
    tags: POST_CARD_TAGS,
  });

  return data;
}
