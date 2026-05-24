import { defineType, defineField, defineArrayMember } from "sanity";
import { GROUP, GROUPS } from "../../utils/constants";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [GROUPS.content, GROUPS.details, GROUPS.media, GROUPS.seo],
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      description: "1–2 sentence card blurb",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "body",
      title: "Project Write-up",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({ name: "location", type: "string", group: GROUP.DETAILS }),
    defineField({ name: "year", type: "number", group: GROUP.DETAILS }),
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
      group: GROUP.DETAILS,
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
      group: GROUP.DETAILS,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      group: GROUP.MEDIA,
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      group: GROUP.MEDIA,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: GROUP.SEO,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "coverImage" },
  },
});
