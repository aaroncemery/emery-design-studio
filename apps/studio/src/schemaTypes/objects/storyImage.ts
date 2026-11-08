import { defineType, defineField } from "sanity";

export const storyImage = defineType({
  name: "storyImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "captionedImage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "layout",
      type: "string",
      description: "Wide runs edge to edge; In column sits with the text.",
      options: {
        list: [
          { title: "Wide", value: "wide" },
          { title: "In column", value: "column" },
        ],
        layout: "radio",
      },
      initialValue: "wide",
    }),
  ],
  preview: {
    select: {
      media: "image.asset",
      title: "image.caption",
      subtitle: "layout",
    },
    prepare: ({ media, title, subtitle }) => ({
      media,
      title: title || "Image",
      subtitle,
    }),
  },
});
