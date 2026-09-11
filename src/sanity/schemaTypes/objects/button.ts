import { defineField, defineType } from "sanity";

import { hrefPattern } from "./link";

export const buttonVariants = [
  { title: "Dark", value: "dark" },
  { title: "Light", value: "light" },
] as const;

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Case-insensitive, will be converted to UPPERCASE.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      description: "Relative path (/contact) or absolute URL (https://…).",
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
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: { list: [...buttonVariants], layout: "radio", direction: "horizontal" },
      initialValue: "dark",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", variant: "variant", href: "href" },
    prepare: ({ title, variant, href }) => ({
      title,
      subtitle: [variant, href].filter(Boolean).join(" · "),
    }),
  },
});
