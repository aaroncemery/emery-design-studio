import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "authorName", title: "Author Name", type: "string" }),
    defineField({
      name: "authorContext",
      title: "Author Context",
      type: "string",
      description: 'e.g. "Madison Park Residence, 2024"',
    }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "authorContext" },
  },
});
