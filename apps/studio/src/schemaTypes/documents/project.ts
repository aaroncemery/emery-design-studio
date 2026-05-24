import { defineType, defineField, defineArrayMember } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
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
    defineField({ name: "location", type: "string" }),
    defineField({ name: "year", type: "number" }),
    defineField({
      name: "season",
      type: "string",
      options: {
        list: [
          { title: "Spring", value: "spring" },
          { title: "Summer", value: "summer" },
          { title: "Fall", value: "fall" },
          { title: "Winter", value: "winter" },
          { title: "Year-round", value: "year-round" },
        ],
      },
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Full Renovation", value: "Full Renovation" },
          { title: "Interior Architecture", value: "Interior Architecture" },
          { title: "Styling & Furnishing", value: "Styling & Furnishing" },
          { title: "Consultation", value: "Consultation" },
        ],
      },
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      description: "1–2 sentence card blurb",
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({
      name: "body",
      title: "Project Write-up",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "coverImage" },
  },
});
