import { defineType, defineField, defineArrayMember } from "sanity";

export const studioIntroSection = defineType({
  name: "studioIntroSection",
  title: "Studio Intro Section",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "value", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      description: "First image is the main image; second is the inset",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Studio Intro Section",
      subtitle: "Studio Intro",
    }),
  },
});
