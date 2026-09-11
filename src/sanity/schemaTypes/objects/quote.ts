import { defineField, defineType } from "sanity";

export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attributionName",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "attributionRole",
      title: "Role",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "text", name: "attributionName", role: "attributionRole" },
    prepare: ({ title, name, role }) => ({
      title: title ? `“${title}”` : "Quote",
      subtitle: [name, role].filter(Boolean).join(" · "),
    }),
  },
});
