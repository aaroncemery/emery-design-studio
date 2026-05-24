import { defineType, defineField, defineArrayMember } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "number",
      type: "string",
      description: 'Display number, e.g. "01"',
    }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: 'e.g. "Concept", "Procurement", "FF&E"',
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "number" },
  },
});
