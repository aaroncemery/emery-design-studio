import { defineType, defineField, defineArrayMember } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
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
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "studioIntroSection" }),
        defineArrayMember({ type: "collectionSection" }),
        defineArrayMember({ type: "inquirySection" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
