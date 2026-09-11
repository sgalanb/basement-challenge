import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

const home = { title: "Home", href: "/" };
const blog = { title: "Blog", href: "/blog" };

export const resolve: PresentationPluginOptions["resolve"] = {
  // Which document to open when previewing a given URL
  mainDocuments: defineDocuments([
    { route: "/", filter: `_type == "homePage"` },
    { route: "/blog", filter: `_type == "blogPage"` },
    { route: "/blog/:slug", filter: `_type == "post" && slug.current == $slug` },
  ]),
  // Where a given document is used on the site
  locations: {
    homePage: defineLocations({ locations: [home] }),
    blogPage: defineLocations({ locations: [blog] }),
    layout: defineLocations({
      message: "Navbar and footer appear on every page",
      locations: [home, blog],
    }),
    post: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Untitled", href: `/blog/${doc?.slug}` }, blog],
      }),
    }),
    author: defineLocations({
      message: "Shown on every post by this author",
      locations: [blog],
    }),
    category: defineLocations({
      select: { slug: "slug.current" },
      resolve: (doc) => ({
        locations: [{ title: "Blog, filtered", href: `/blog?category=${doc?.slug}` }],
      }),
    }),
  },
};
