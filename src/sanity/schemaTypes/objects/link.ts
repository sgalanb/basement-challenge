import { defineField, defineType } from "sanity";

export const hrefPattern = /^(\/|https?:\/\/|mailto:|tel:|#)/;

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      description: "Relative path (/blog) or absolute URL (https://…).",
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
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
