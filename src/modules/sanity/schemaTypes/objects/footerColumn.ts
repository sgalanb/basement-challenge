import { defineArrayMember, defineField, defineType } from "sanity";

export const footerColumn = defineType({
  name: "footerColumn",
  title: "Footer column",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Case-insensitive, will be converted to UPPERCASE.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", links: "links" },
    prepare: ({ title, links }) => ({
      title,
      subtitle: `${links?.length ?? 0} link${links?.length === 1 ? "" : "s"}`,
    }),
  },
});
