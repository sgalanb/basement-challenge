import { stegaClean } from "next-sanity";

import { unique } from "@/modules/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_GRAPH_QUERY, POST_QUERY, POST_REFS_QUERY } from "@/sanity/lib/queries";
import { POST_GRAPH_TAG, authorTag, categoryTag, postTag } from "@/sanity/lib/tags";

/**
 * Loads everything a post page renders in three sequential fetches, each tagged with exactly the
 * documents it depends on. Editing a post then regenerates only its own page and the few pages that
 * show its card, instead of every post page.
 */
export async function getPost(slug: string) {
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    tags: [postTag(slug)],
  });
  if (!post) return null;

  // Only ids and slugs, never rendered, so stega is off and the values are safe to use as tags.
  const { data: graph } = await sanityFetch({
    query: POST_GRAPH_QUERY,
    params: { id: post._id },
    tags: [POST_GRAPH_TAG],
    stega: false,
  });

  // Manually related posts can point at deleted documents, which dereference to null.
  const related = (graph?.related ?? []).filter((node) => node != null);
  const neighbours = [...related, graph?.previous, graph?.next].filter((node) => node != null);

  const slugs = unique(neighbours.map((node) => node.slug));
  const authorIds = post.authorIds ?? [];
  const categoryIds = unique([
    ...(post.categoryIds ?? []),
    ...neighbours.flatMap((node) => node.categoryIds ?? []),
  ]);

  const { data: refs } = await sanityFetch({
    query: POST_REFS_QUERY,
    params: { slugs, authorIds, categoryIds },
    tags: [...slugs.map(postTag), ...authorIds.map(authorTag), ...categoryIds.map(categoryTag)],
  });

  // Sanity returns `in` matches unordered; restore the order the post (or the graph) defines.
  const cardBySlug = new Map<string, (typeof refs.posts)[number]>();
  for (const card of refs.posts) cardBySlug.set(stegaClean(card.slug), card);
  const authorById = new Map(refs.authors.map((author) => [author._id, author]));
  const categoryById = new Map(refs.categories.map((category) => [category._id, category]));

  const { authorIds: _authorIds, categoryIds: _categoryIds, ...fields } = post;

  return {
    ...fields,
    authors: authorIds.map((id) => authorById.get(id)).filter((author) => author !== undefined),
    categories: (post.categoryIds ?? [])
      .map((id) => categoryById.get(id))
      .filter((category) => category !== undefined),
    relatedPosts: related
      .map((node) => cardBySlug.get(node.slug))
      .filter((card) => card !== undefined),
    previous: graph?.previous?.slug ? (cardBySlug.get(graph.previous.slug) ?? null) : null,
    next: graph?.next?.slug ? (cardBySlug.get(graph.next.slug) ?? null) : null,
  };
}
