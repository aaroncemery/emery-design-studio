import { defineType, defineField, defineArrayMember } from "sanity";

export const inquirySection = defineType({
  name: "inquirySection",
  title: "Inquiry Section",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "string" }),
    defineField({
      name: "scopeOptions",
      title: "Scope Options",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description:
        'Options shown in the scope dropdown, e.g. "Full Renovation"',
    }),
    defineField({
      name: "budgetOptions",
      title: "Budget Options",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: 'Options shown as pill toggles, e.g. "Under $500k"',
    }),
  ],
  preview: {
    prepare: () => ({ title: "Inquiry Section" }),
  },
});
