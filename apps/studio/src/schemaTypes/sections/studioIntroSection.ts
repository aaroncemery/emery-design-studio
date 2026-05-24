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
      name: "imageLayout",
      title: "Image Layout",
      type: "string",
      options: {
        list: [
          { title: "Main with Inset", value: "mainWithInset" },
          { title: "Side by Side", value: "sideBySide" },
          { title: "Single Full", value: "singleFull" },
        ],
        layout: "radio",
      },
      initialValue: "mainWithInset",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      description:
        "mainWithInset: first is main, second is inset. sideBySide: first two shown equal width. singleFull: first image only.",
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
