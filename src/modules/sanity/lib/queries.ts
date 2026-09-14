import { defineQuery } from "next-sanity";

// FRAGMENTS

const imageFields = /* groq */ `
  "asset": asset->{ _id, url, metadata { dimensions { width, height }, lqip } },
  hotspot,
  crop,
  "alt": coalesce(alt, asset->altText)
`;

const linkFields = /* groq */ `label, href, openInNewTab`;

const authorFields = /* groq */ `
  _id,
  name,
  socialUrl,
  picture { ${imageFields} }
`;

const categoryFields = /* groq */ `_id, title, "slug": slug.current`;

const postFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  date,
  featuredImage { ${imageFields} }
`;

const postCardFields = /* groq */ `
  ${postFields},
  categories[]-> { ${categoryFields} }
`;

/** Text blocks resolve `link` annotations, `image` and `code` blocks are fully expanded. */
const portableTextFields = /* groq */ `
  ...,
  _type == "imageWithAlt" => { ${imageFields} },
  markDefs[] { ... }
`;

// LAYOUT

export const LAYOUT_QUERY = defineQuery(`
  *[_type == "layout"][0] {
    navLinks[] { _key, ${linkFields} },
    navCtas[] { _key, ${linkFields}, variant },
    footerColumns[] { _key, title, links[] { _key, ${linkFields} } },
    copyrightText
  }
`);

// PAGES

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] { metadata }
`);

/** Featured post falls back to the most recent post when none is selected. */
export const BLOG_PAGE_QUERY = defineQuery(`
  *[_type == "blogPage"][0] {
    metadata,
    heroTitle,
    listTitle,
    "featuredPost": coalesce(
      featuredPost-> { ${postCardFields} },
      *[_type == "post" && defined(slug.current)] | order(date desc, _createdAt desc)[0] { ${postCardFields} }
    )
  }
`);

// BLOG LISTING

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) { ${categoryFields} }
`);

/** Shared by the page slice and the total count so both agree on what "the list" is. */
const postListFilter = /* groq */ `
  _type == "post"
  && defined(slug.current)
  && _id != $exclude
  && ($category == null || $category in categories[]->slug.current)
`;

/**
 * One page of posts, newest first, plus the total so the client knows when to stop loading more.
 * `$category` is a category slug or null for all posts. `$exclude` is the featured post id (or null)
 * so it doesn't repeat in the grid. `$start`/`$end` are the slice bounds.
 */
export const POSTS_QUERY = defineQuery(`{
  "posts": *[${postListFilter}] | order(date desc, _createdAt desc) [$start...$end] { ${postCardFields} },
  "total": count(*[${postListFilter}])
}`);

// SINGLE POST

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`);

/** Every published post URL and when it last changed */
export const POST_SITEMAP_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc) { "slug": slug.current, _updatedAt }
`);

/**
 * A post page is assembled in three steps so every fetch can be tagged with exactly the documents
 * it depends on (Next.js tags are declared before a fetch runs).
 *
 * Step 1: the post itself. References come back as ids so later steps can tag by them.
 */
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    intro[] { ${portableTextFields} },
    body[] { ${portableTextFields} },
    "authorIds": authors[]._ref,
    "categoryIds": categories[]._ref
  }
`);

/** Slug for the follow-up fetch, category ids because the card embeds category titles. */
const graphNodeFields = /* groq */ `"slug": slug.current, "categoryIds": categories[]._ref`;

/**
 * Step 2: which posts surround this one. Depends only on structural fields (`date`, `categories`,
 * `relatedPosts`, `slug`, existence), so it's tagged with `POST_GRAPH_TAG` alone.
 * Related posts: the manual selection, or up to 3 latest posts sharing a category. Previous/next are by date.
 */
export const POST_GRAPH_QUERY = defineQuery(`
  *[_type == "post" && _id == $id][0] {
    "related": select(
      count(relatedPosts) > 0 => relatedPosts[]-> { ${graphNodeFields} },
      *[
        _type == "post"
        && _id != ^._id
        && defined(slug.current)
        && count(categories[@._ref in ^.^.categories[]._ref]) > 0
      ] | order(date desc, _createdAt desc)[0...3] { ${graphNodeFields} }
    ),
    "previous": *[_type == "post" && defined(slug.current) && date < ^.date] | order(date desc)[0] { ${graphNodeFields} },
    "next": *[_type == "post" && defined(slug.current) && date > ^.date] | order(date asc)[0] { ${graphNodeFields} }
  }
`);

/** Step 3: the referenced documents, tagged per post slug / author id / category id. */
export const POST_REFS_QUERY = defineQuery(`{
  "posts": *[_type == "post" && slug.current in $slugs] { ${postCardFields} },
  "authors": *[_type == "author" && _id in $authorIds] { ${authorFields} },
  "categories": *[_type == "category" && _id in $categoryIds] { ${categoryFields} }
}`);
