import { stegaClean } from "next-sanity";

import { getPost } from "@/app/(site)/blog/[slug]/get-post";
import { sanityFetch } from "@/modules/sanity/lib/live";
import { BLOG_PAGE_QUERY, CATEGORIES_QUERY, POSTS_INDEX_QUERY } from "@/modules/sanity/lib/queries";
import { POST_CARD_TAGS, TAGS } from "@/modules/sanity/lib/tags";
import { SITE, absoluteUrl } from "@/modules/site";
import { formatDate } from "@/modules/utils";

import { MARKDOWN_FOOTER, markdownDocument, markdownLinkList, postToMarkdown } from "./markdown";

async function listPosts() {
  const { data } = await sanityFetch({
    query: POSTS_INDEX_QUERY,
    perspective: "published",
    stega: false,
    tags: POST_CARD_TAGS,
  });
  return data;
}

function postLinks(posts: Awaited<ReturnType<typeof listPosts>>) {
  return markdownLinkList(
    posts.map((post) => ({
      label: post.title,
      href: `/blog/${post.slug}`,
      description: `${formatDate(post.date)} · ${(post.categories ?? []).map((c) => c.title).join(", ")}. ${post.excerpt}`,
    })),
  );
}

const WHEN_TO_USE = [
  "## When to use this site",
  "",
  `Use ${SITE.name}'s blog when you need first-hand, practitioner-level material on:`,
  "",
  "- Brand identity and web design process for startups and product companies.",
  "- Real-time 3D, WebGL, and shader effects on production marketing websites.",
  "- Front-end engineering, performance, and developer experience for Next.js and React sites.",
  "- Studio case studies that show how a specific launch, campaign, or site was built.",
  "",
  `Do not use it for service pricing, hiring, or the studio's portfolio; those live on the official website at ${SITE.officialUrl}. To get in touch, email ${SITE.email}.`,
  "",
  "## How to read it",
  "",
  "- Every page URL serves Markdown when the request sends `Accept: text/markdown`, and HTML otherwise. Appending `.md` to a page URL also returns Markdown.",
  `- [llms-full.txt](${absoluteUrl("/llms-full.txt")}) contains every blog post in one Markdown file.`,
  `- [sitemap.xml](${absoluteUrl("/sitemap.xml")}) lists every canonical URL with last-modified dates.`,
  "- Removed or unknown posts return a real HTTP 404 with a Markdown body pointing back here.",
].join("\n");

export async function homeMarkdown() {
  const posts = await listPosts();
  const body = [
    `> ${SITE.description}`,
    "",
    `${SITE.name} is a digital studio and branding powerhouse based in ${SITE.location.city}, ${SITE.location.country}. This site hosts the studio blog: research, insights, and the science behind building brands and websites.`,
    "",
    "## Pages",
    "",
    markdownLinkList([
      { label: "Blog", href: "/blog", description: "All posts, filterable by category." },
    ]),
    "",
    "## Latest posts",
    "",
    postLinks(posts.slice(0, 5)),
  ].join("\n");

  return markdownDocument(
    { title: `${SITE.name} | ${SITE.tagline}`, description: SITE.description, url: "/" },
    body,
  );
}

export async function blogMarkdown() {
  const [{ data: page }, { data: categories }, posts] = await Promise.all([
    sanityFetch({ query: BLOG_PAGE_QUERY, tags: [TAGS.blogPage, ...POST_CARD_TAGS], stega: false }),
    sanityFetch({ query: CATEGORIES_QUERY, tags: [TAGS.category], stega: false }),
    listPosts(),
  ]);

  const description =
    page?.metadata?.metaDescription ??
    `Articles from ${SITE.name} about design, branding, and web engineering.`;
  const body = [
    `> ${page?.heroTitle ?? description}`,
    "",
    page?.featuredPost
      ? `**Featured:** [${page.featuredPost.title}](${absoluteUrl(`/blog/${page.featuredPost.slug}`)}) — ${page.featuredPost.excerpt}`
      : "",
    "",
    "## Categories",
    "",
    markdownLinkList(
      (categories ?? []).map((category) => ({
        label: category.title,
        href: `/blog?category=${category.slug}`,
      })),
    ),
    "",
    `## ${page?.listTitle ?? "All posts"}`,
    "",
    postLinks(posts),
  ].join("\n");

  return markdownDocument(
    { title: page?.metadata?.metaTitle ?? `Blog | ${SITE.name}`, description, url: "/blog" },
    body,
  );
}

export async function postMarkdown(slug: string) {
  const post = await getPost(slug);
  if (!post) return null;
  return stegaClean(postToMarkdown(post));
}

export async function allPostsMarkdown() {
  const posts = await listPosts();
  const docs = await Promise.all(posts.map((post) => postMarkdown(post.slug)));
  return docs.filter((doc) => doc !== null);
}

export function notFoundMarkdown(path: string) {
  return [
    "# 404 Not Found",
    "",
    `There is no page at \`${path}\` on ${SITE.name}. Nothing was ever published there; the path may be mistyped or the post may have been removed.`,
    "",
    "## Where to look next",
    "",
    markdownLinkList([
      {
        label: "Site index (llms.txt)",
        href: "/llms.txt",
        description: "What this site is, when to use it, and every page.",
      },
      {
        label: "Sitemap",
        href: "/sitemap.xml",
        description: "Every canonical URL with last-modified dates.",
      },
      { label: "Blog", href: "/blog", description: "All posts, filterable by category." },
      { label: "Home", href: "/" },
    ]),
    "",
    MARKDOWN_FOOTER,
  ].join("\n");
}

/** Resolves a site path to its markdown representation, or null when the path does not exist. */
export async function markdownForPath(path: string): Promise<string | null> {
  if (path === "/") return homeMarkdown();
  if (path === "/blog") return blogMarkdown();

  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post) return postMarkdown(post[1]);

  return null;
}

/** llms.txt per https://llmstxt.org: H1, blockquote summary, prose, then H2 link sections. */
export async function llmsTxt() {
  const posts = await listPosts();
  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description} This site is the studio blog: articles on branding, web design, 3D, development, and laboratory experiments, served as HTML and as Markdown.`,
    "",
    `Based in ${SITE.location.city}, ${SITE.location.country}. Contact: ${SITE.email}. Official website: ${SITE.officialUrl}. This deployment is a technical challenge implementation of the studio blog, not the official site.`,
    "",
    WHEN_TO_USE,
    "",
    "## Blog",
    "",
    markdownLinkList([
      {
        label: "Blog index",
        href: "/blog",
        description: "All posts, newest first, filterable by category.",
      },
    ]),
    postLinks(posts),
    "",
    "## Optional",
    "",
    markdownLinkList([
      {
        label: "llms-full.txt",
        href: "/llms-full.txt",
        description: "Every blog post as a single Markdown file.",
      },
      {
        label: "sitemap.xml",
        href: "/sitemap.xml",
        description: "XML sitemap of every canonical URL.",
      },
      {
        label: "Official website",
        href: SITE.officialUrl,
        description: "Portfolio, services, and hiring at basement.studio.",
      },
    ]),
    "",
  ].join("\n");
}
