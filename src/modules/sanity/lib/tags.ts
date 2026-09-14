export const TAGS = {
  post: "post",
  category: "category",
  author: "author",
  blogPage: "blogPage",
  homePage: "homePage",
  layout: "layout",
} as const;

export type Tag = (typeof TAGS)[keyof typeof TAGS];

export const isTag = (value: string): value is Tag => value in TAGS;

/** Tags for listings that render post cards */
export const POST_CARD_TAGS: Tag[] = [TAGS.post, TAGS.category];

/**
 * Fires on structural post changes only: create, delete, or edits to `date`, `slug`, `categories`
 * or `relatedPosts`. Those are the fields that decide which posts are neighbours or related.
 */
export const POST_GRAPH_TAG = "postGraph";

export const postTag = (slug: string) => `post:${slug}`;
export const authorTag = (id: string) => `author:${id}`;
export const categoryTag = (id: string) => `category:${id}`;
