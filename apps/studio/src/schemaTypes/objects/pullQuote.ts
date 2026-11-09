import { defineType, defineField } from "sanity";

export const pullQuote = defineType({
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({
      name: "text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "text" },
    prepare: ({ title }) => ({ title, subtitle: "Pull quote" }),
  },
});
