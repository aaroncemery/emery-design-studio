import { defineType, defineField } from "sanity";

export const journalPage = defineType({
  name: "journalPage",
  title: "Journal Page",
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
        'Shown instead of the post grid when no journal posts exist, e.g. "Essays and notes... coming soon."',
    }),
  ],
  preview: {
    prepare: () => ({ title: "Journal Page" }),
  },
});
