import { defineType, defineField } from "sanity";

export const captionedImage = defineType({
  name: "captionedImage",
  title: "Captioned Image",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "source",
      title: "Source / Credit",
      type: "string",
      description:
        "Optional small line under the caption, e.g. 'Sofa, Brand · Pillows, Brand'.",
    }),
  ],
  preview: {
    select: { media: "asset", title: "caption", subtitle: "alt" },
    prepare: ({ media, title, subtitle }) => ({
      media,
      title: title || "Captioned Image",
      subtitle,
    }),
  },
});
