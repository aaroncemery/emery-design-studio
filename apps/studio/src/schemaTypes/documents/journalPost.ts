import { defineType, defineField, defineArrayMember } from "sanity";
import { GROUP, GROUPS } from "../../utils/constants";

export const journalPost = defineType({
  name: "journalPost",
  title: "Journal Post",
  type: "document",
  groups: [GROUPS.content, GROUPS.media, GROUPS.seo],
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
    defineField({ name: "author", type: "string", group: GROUP.MAIN_CONTENT }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
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
    select: { title: "title", subtitle: "author", media: "coverImage" },
  },
});
