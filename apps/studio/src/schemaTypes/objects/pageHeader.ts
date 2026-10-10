import { defineType, defineField } from "sanity";

export const pageHeader = defineType({
  name: "pageHeader",
  title: "Page Header",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        'Split on "/" for a two-line heading with the second line italicized — same editor convention as the Hero and Studio Intro headings.',
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Page Header",
      subtitle,
    }),
  },
});
