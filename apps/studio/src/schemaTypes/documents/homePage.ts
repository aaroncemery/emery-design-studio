import { defineType, defineField, defineArrayMember } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Home Page",
      description: "Internal label only — not shown on the site",
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
    prepare: () => ({ title: "Home Page" }),
  },
});
