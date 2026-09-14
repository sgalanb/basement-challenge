import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      description: "Describes the image for screen readers and search engines.",
      validation: (rule) => rule.required(),
    }),
  ],
});
