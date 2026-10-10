import { defineType, defineField } from "sanity";

export const workPage = defineType({
  name: "workPage",
  title: "Work Page",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageHeader",
    }),
    defineField({
      name: "emptyStateText",
      title: "Empty State Text",
      type: "text",
      description:
        'Shown instead of the project grid when no projects exist, e.g. "Projects coming soon."',
    }),
  ],
  preview: {
    prepare: () => ({ title: "Work Page" }),
  },
});
