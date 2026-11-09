import { defineType, defineField, defineArrayMember } from "sanity";

export const storyPair = defineType({
  name: "storyPair",
  title: "Image pair",
  type: "object",
  fields: [
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "captionedImage" })],
      validation: (Rule) => Rule.required().length(2),
    }),
  ],
  preview: {
    select: { media: "images.0.asset", title: "images.0.caption" },
    prepare: ({ media, title }) => ({
      media,
      title: title || "Image pair",
      subtitle: "Two images side by side",
    }),
  },
});
