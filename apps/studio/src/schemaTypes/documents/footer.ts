import { defineType, defineField, defineArrayMember } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: 'e.g. "© 2025 Emery Design Studio. All rights reserved."',
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "array",
      of: [defineArrayMember({ type: "navItem" })],
      description: "Links to legal pages — Privacy Policy, Terms of Use, etc.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer" }),
  },
});
