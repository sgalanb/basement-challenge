import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier.",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Shown on cards, the featured post, and as the opening line of the article.",
      validation: (rule) => rule.required().max(220).warning("Keep it under 220 characters."),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "simplePortableText",
      description: "Paragraph shown under the excerpt, above the featured image.",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "author" }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      description: "Leave empty to show the latest posts that share a category.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "post" }],
          options: {
            filter: ({ document }) => ({
              filter: "_id != $id && !(_id in path('drafts.**'))",
              params: { id: document._id.replace(/^drafts\./, "") },
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(3).unique(),
    }),
  ],
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      media: "featuredImage",
      category: "categories.0.title",
    },
    prepare: ({ title, date, media, category }) => ({
      title,
      subtitle: [date, category].filter(Boolean).join(" · "),
      media,
    }),
  },
});
