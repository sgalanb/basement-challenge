import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "metadata",
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home" }),
  },
});
