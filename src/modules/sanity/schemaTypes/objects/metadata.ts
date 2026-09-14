import { defineField, defineType } from "sanity";

export const metadata = defineType({
  name: "metadata",
  title: "Metadata",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Title",
      type: "string",
      validation: (rule) => rule.max(70).warning("Keep it under 70 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Keep it under 160 characters."),
    }),
  ],
});
