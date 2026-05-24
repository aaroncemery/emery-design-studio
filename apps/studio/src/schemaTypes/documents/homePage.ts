import { defineType, defineField, defineArrayMember } from "sanity";
import { GROUP, GROUPS } from "../../utils/constants";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [GROUPS.content, GROUPS.seo],
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Home Page",
      description: "Internal label only — not shown on the site",
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
    prepare: () => ({ title: "Home Page" }),
  },
});
