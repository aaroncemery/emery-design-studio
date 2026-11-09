import { defineType, defineField } from "sanity";

export const storyInset = defineType({
  name: "storyInset",
  title: "Text beside image",
  type: "object",
  fields: [
    defineField({
      name: "text",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "captionedImage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "side",
      title: "Image side",
      type: "string",
      options: {
        list: [
          { title: "Right", value: "right" },
          { title: "Left", value: "left" },
        ],
        layout: "radio",
      },
      initialValue: "right",
    }),
  ],
  preview: {
    select: { media: "image.asset", title: "text", subtitle: "side" },
    prepare: ({ media, title, subtitle }) => ({
      media,
      title: title || "Text beside image",
      subtitle: subtitle ? `Image ${subtitle}` : undefined,
    }),
  },
});
