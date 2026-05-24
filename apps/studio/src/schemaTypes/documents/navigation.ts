import { defineType, defineField, defineArrayMember } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Nav Items",
      type: "array",
      of: [defineArrayMember({ type: "navItem" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Navigation" }),
  },
});
