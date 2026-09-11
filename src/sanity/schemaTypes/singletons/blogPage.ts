import { defineField, defineType } from "sanity";

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "metadata",
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredPost",
      title: "Featured Post",
      type: "reference",
      to: [{ type: "post" }],
      description: "Leave empty to feature the most recent post.",
    }),
    defineField({
      name: "listTitle",
      title: "Posts Section Title",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Blog" }),
  },
});
