import { defineType, defineField } from "sanity";

export const pressItem = defineType({
  name: "pressItem",
  title: "Press Item",
  type: "document",
  fields: [
    defineField({
      name: "publicationName",
      title: "Publication Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "url", type: "url" }),
  ],
  preview: {
    select: { title: "publicationName", media: "logo" },
  },
});
