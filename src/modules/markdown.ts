import { urlFor } from "@/modules/sanity/lib/image";
import type { POST_QUERY_RESULT } from "@/modules/sanity/types";
import { SITE, absoluteUrl } from "@/modules/site";
import { formatDate } from "@/modules/utils";

type Post = NonNullable<POST_QUERY_RESULT>;
type Block = Post["body"][number];
type TextBlock = Extract<Block, { _type: "block" }>;
type Span = NonNullable<TextBlock["children"]>[number];
type MarkDef = NonNullable<TextBlock["markDefs"]>[number];

/** Same footer on every markdown document so agents always know where the rest of the site is. */
export const MARKDOWN_FOOTER = [
  "---",
  "",
  `${SITE.name} · ${SITE.tagline} · [Site index](${absoluteUrl("/llms.txt")}) · [Sitemap](${absoluteUrl("/sitemap.xml")})`,
  "",
].join("\n");

function escapeText(text: string) {
  return text.replace(/([\\`*_{}[\]<>#])/g, "\\$1");
}

function renderSpan(span: Span, markDefs: MarkDef[]) {
  let text = escapeText(span.text ?? "");
  if (!text.trim()) return text;
  const marks = span.marks ?? [];
  const link = marks.map((mark) => markDefs.find((def) => def._key === mark)).find(Boolean);

  if (marks.includes("code")) text = `\`${span.text ?? ""}\``;
  if (marks.includes("strong")) text = `**${text}**`;
  if (marks.includes("em")) text = `_${text}_`;
  if (marks.includes("strike-through")) text = `~~${text}~~`;
  if (link) text = `[${text}](${absoluteUrl(link.href)})`;
  return text;
}

function renderChildren(block: TextBlock) {
  const markDefs = block.markDefs ?? [];
  return (block.children ?? []).map((span) => renderSpan(span, markDefs)).join("");
}

function renderTextBlock(block: TextBlock, listIndex: number) {
  const text = renderChildren(block);
  if (block.listItem) {
    const indent = "  ".repeat(Math.max(0, (block.level ?? 1) - 1));
    const marker = block.listItem === "number" ? `${listIndex}.` : "-";
    return `${indent}${marker} ${text}`;
  }
  if (block.style === "h2") return `## ${text}`;
  if (block.style === "h3") return `### ${text}`;
  return text;
}

function renderBlock(block: Block, listIndex: number): string {
  switch (block._type) {
    case "block":
      return renderTextBlock(block, listIndex);
    case "quote": {
      const attribution = [block.attributionName, block.attributionRole].filter(Boolean).join(", ");
      const quote = `> ${escapeText(block.text)}`;
      return attribution ? `${quote}\n>\n> — ${escapeText(attribution)}` : quote;
    }
    case "code": {
      const fence = `\`\`\`${block.language ?? ""}\n${block.code ?? ""}\n\`\`\``;
      return block.filename ? `**${escapeText(block.filename)}**\n\n${fence}` : fence;
    }
    case "imageWithAlt": {
      if (!block.asset) return "";
      return `![${escapeText(block.alt)}](${urlFor(block).url()})`;
    }
    default:
      return "";
  }
}

/** Renders a Portable Text array as Markdown paragraphs separated by blank lines. */
export function portableTextToMarkdown(blocks: readonly Block[] | null | undefined) {
  if (!blocks?.length) return "";

  const out: string[] = [];
  let listIndex = 0;
  let previousWasList = false;

  for (const block of blocks) {
    const isListItem = block._type === "block" && Boolean(block.listItem);
    if (isListItem) {
      listIndex = previousWasList ? listIndex + 1 : 1;
    } else {
      listIndex = 0;
    }
    const rendered = renderBlock(block, listIndex);
    if (!rendered) continue;
    // Consecutive list items stay in one list, everything else is its own paragraph.
    if (isListItem && previousWasList) out[out.length - 1] += `\n${rendered}`;
    else out.push(rendered);
    previousWasList = isListItem;
  }

  return out.join("\n\n");
}

export type MarkdownLink = { label: string; href: string; description?: string | null };

export function markdownLinkList(items: MarkdownLink[]) {
  return items
    .map((item) => {
      const link = `[${item.label}](${absoluteUrl(item.href)})`;
      return item.description ? `- ${link}: ${item.description}` : `- ${link}`;
    })
    .join("\n");
}

/** Front matter style header agents can parse, followed by the human summary. */
export function markdownDocument(
  meta: { title: string; description?: string | null; url: string; extra?: Record<string, string> },
  body: string,
) {
  const fields: Record<string, string> = {
    title: meta.title,
    ...(meta.description ? { description: meta.description } : {}),
    url: absoluteUrl(meta.url),
    site: SITE.name,
    ...meta.extra,
  };
  const frontMatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");

  return `---\n${frontMatter}\n---\n\n# ${meta.title}\n\n${body.trim()}\n\n${MARKDOWN_FOOTER}`;
}

type PostWithRefs = Omit<Post, "authorIds" | "categoryIds"> & {
  authors: { name: string; socialUrl: string }[];
  categories: { title: string; slug: string }[];
  previous: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
  relatedPosts: { title: string; slug: string }[];
};

export function postToMarkdown(post: PostWithRefs) {
  const path = `/blog/${post.slug}`;
  const parts: string[] = [];

  parts.push(`> ${post.excerpt}`);

  const byline = [
    `**Published:** ${formatDate(post.date)}`,
    post.authors.length > 0 &&
      `**Authors:** ${post.authors.map((a) => `[${a.name}](${a.socialUrl})`).join(", ")}`,
    post.categories.length > 0 &&
      `**Categories:** ${post.categories
        .map((c) => `[${c.title}](${absoluteUrl(`/blog?category=${c.slug}`)})`)
        .join(", ")}`,
  ].filter(Boolean);
  parts.push(byline.join("  \n"));

  const intro = portableTextToMarkdown(post.intro);
  if (intro) parts.push(intro);

  if (post.featuredImage?.asset) {
    parts.push(`![${escapeText(post.featuredImage.alt)}](${urlFor(post.featuredImage).url()})`);
  }

  parts.push(portableTextToMarkdown(post.body));

  const more: string[] = [];
  if (post.previous)
    more.push(
      `- Previous: [${post.previous.title}](${absoluteUrl(`/blog/${post.previous.slug}`)})`,
    );
  if (post.next)
    more.push(`- Next: [${post.next.title}](${absoluteUrl(`/blog/${post.next.slug}`)})`);
  for (const related of post.relatedPosts) {
    more.push(`- Related: [${related.title}](${absoluteUrl(`/blog/${related.slug}`)})`);
  }
  if (more.length > 0) parts.push(`## More from the blog\n\n${more.join("\n")}`);

  return markdownDocument(
    {
      title: post.title,
      description: post.excerpt,
      url: path,
      extra: {
        date: post.date,
        authors: post.authors.map((a) => a.name).join(", "),
        categories: post.categories.map((c) => c.title).join(", "),
      },
    },
    parts.join("\n\n"),
  );
}
