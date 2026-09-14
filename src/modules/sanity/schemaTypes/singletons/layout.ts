import { defineArrayMember, defineField, defineType } from "sanity";

export const layout = defineType({
  name: "layout",
  title: "Layout",
  type: "document",
  groups: [
    { name: "navbar", title: "Navbar" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      group: "navbar",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({
      name: "navCtas",
      title: "Call To Action Buttons",
      type: "array",
      group: "navbar",
      of: [defineArrayMember({ type: "button" })],
    }),
    defineField({
      name: "footerColumns",
      title: "Footer Columns",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "footerColumn" })],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      group: "footer",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Layout" }),
  },
});
