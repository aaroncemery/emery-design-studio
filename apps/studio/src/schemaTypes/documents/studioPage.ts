import { defineType, defineField } from "sanity";

export const studioPage = defineType({
  name: "studioPage",
  title: "Studio Page",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageHeader",
    }),
    defineField({
      name: "intro",
      title: "About Content",
      type: "studioIntroSection",
      description:
        "The full About write-up for /studio. Independent from the home page's studio-intro teaser — same field shape, separate content.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Studio Page" }),
  },
});
