import { defineType, defineField, defineArrayMember } from "sanity";
import { GROUP, GROUPS } from "../../utils/constants";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [GROUPS.content, GROUPS.seo],
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
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "studioIntroSection" }),
        defineArrayMember({ type: "collectionSection" }),
        defineArrayMember({ type: "inquirySection" }),
      ],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: GROUP.SEO,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
