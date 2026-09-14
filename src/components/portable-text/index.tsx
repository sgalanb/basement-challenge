import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";
import { stegaClean } from "next-sanity";
import Link from "next/link";

import { NewTabHint } from "@/components/new-tab-hint";

import { CodeBlock } from "./code-block";
import { ImageBlock } from "./image-block";
import { QuoteBlock } from "./quote-block";

/** Maps Sanity block types, styles and marks to React. */
export const portableTextComponents: PortableTextComponents = {
  types: {
    quote: QuoteBlock,
    code: CodeBlock,
    imageWithAlt: ImageBlock,
  },
  block: {
    normal: ({ children }) => <p className="typography-body my-4">{children}</p>,
    h2: ({ children }) => <h2 className="typography-headline mt-12 mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="typography-title-emphasized mt-8 mb-3">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="typography-body my-4 list-disc pl-6">{children}</ul>,
    number: ({ children }) => (
      <ol className="typography-body my-4 list-decimal pl-6">{children}</ol>
    ),
  },
  listItem: ({ children }) => <li className="my-1">{children}</li>,
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    "strike-through": ({ children }) => <s>{children}</s>,
    code: ({ children }) => (
      <code className="bg-basement-dark-grey/80 border-basement-grey/80 rounded border px-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = stegaClean(value?.href ?? "#");
      const external = value?.openInNewTab || /^(https?:)?\/\//.test(href);
      const className = "underline underline-offset-4 hover:text-accent";

      if (external) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {children}
            <NewTabHint />
          </a>
        );
      }
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    },
  },
};

/** Any block array from query results. */
type Blocks = Array<{ _type: string; _key: string }>;

export function PortableText({
  value,
  className,
}: {
  value: Blocks | null | undefined;
  className?: string;
}) {
  if (!value?.length) return null;

  return (
    <div className={className}>
      <PortableTextRenderer value={value} components={portableTextComponents} />
    </div>
  );
}
