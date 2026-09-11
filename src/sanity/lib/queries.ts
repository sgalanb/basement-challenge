import { defineQuery } from "next-sanity";

// ---------- Fragments ----------

const imageFields = /* groq */ `
  asset,
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

/** Everything a post card / featured block needs. */
const postCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  date,
  featuredImage { ${imageFields} },
  categories[]-> { ${categoryFields} }
`;

/** Text blocks resolve `link` annotations, `image` and `code` blocks are fully expanded. */
const portableTextFields = /* groq */ `
  ...,
  _type == "imageWithAlt" => { ${imageFields} },
  markDefs[] { ... }
`;

// ---------- Layout ----------

export const LAYOUT_QUERY = defineQuery(`
  *[_type == "layout"][0] {
    navLinks[] { _key, ${linkFields} },
    navCtas[] { _key, ${linkFields}, variant },
    footerColumns[] { _key, title, links[] { _key, ${linkFields} } },
    copyrightText
  }
`);

// ---------- Pages ----------

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

// ---------- Blog listing ----------

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) { ${categoryFields} }
`);

/**
 * Paginated post list. `$category` is a category slug or null for all posts.
 * `$exclude` is the id of the featured post (or null) so it doesn't repeat in the grid.
 */
export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post"
    && defined(slug.current)
    && _id != $exclude
    && ($category == null || $category in categories[]->slug.current)
  ] | order(date desc, _createdAt desc) [$offset...$end] { ${postCardFields} }
`);

export const POSTS_COUNT_QUERY = defineQuery(`
  count(*[
    _type == "post"
    && defined(slug.current)
    && _id != $exclude
    && ($category == null || $category in categories[]->slug.current)
  ])
`);

// ---------- Single post ----------

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`);

/**
 * Related posts: the manual selection, or up to 3 latest posts sharing a category.
 * Previous/next are by date.
 */
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${postCardFields},
    intro[] { ${portableTextFields} },
    body[] { ${portableTextFields} },
    authors[]-> { ${authorFields} },
    "relatedPosts": select(
      count(relatedPosts) > 0 => relatedPosts[]-> { ${postCardFields} },
      *[
        _type == "post"
        && _id != ^._id
        && defined(slug.current)
        && count(categories[@._ref in ^.^.categories[]._ref]) > 0
      ] | order(date desc, _createdAt desc)[0...3] { ${postCardFields} }
    ),
    "previous": *[_type == "post" && defined(slug.current) && date < ^.date] | order(date desc)[0] { title, "slug": slug.current },
    "next": *[_type == "post" && defined(slug.current) && date > ^.date] | order(date asc)[0] { title, "slug": slug.current }
  }
`);
