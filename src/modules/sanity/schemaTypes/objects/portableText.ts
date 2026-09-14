import { defineArrayMember, defineField, defineType } from "sanity";

import { hrefPattern } from "./link";

const linkAnnotation = defineArrayMember({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(hrefPattern, { name: "url", invert: false })
          .error("Must start with /, https://, http://, mailto:, tel: or #"),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

/** Paragraphs and links only. Used for the post intro. */
export const simplePortableText = defineType({
  name: "simplePortableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Strikethrough", value: "strike-through" },
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
});

/** Full article body. */
export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Strikethrough", value: "strike-through" },
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({ type: "quote" }),
    defineArrayMember({ type: "imageWithAlt" }),
    defineArrayMember({
      type: "code",
      title: "Code Block",
      options: {
        language: "typescript",
        languageAlternatives: [
          { title: "TypeScript", value: "typescript" },
          { title: "JavaScript", value: "javascript" },
          { title: "TSX", value: "tsx" },
          { title: "JSX", value: "jsx" },
          { title: "JSON", value: "json" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "Shell", value: "sh" },
          { title: "Markdown", value: "markdown" },
          { title: "Plain text", value: "text" },
        ],
        withFilename: true,
      },
    }),
  ],
});
