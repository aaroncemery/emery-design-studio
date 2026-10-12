import { defineType, defineField } from "sanity";
import { GROUP, GROUPS } from "../../utils/constants";

export const studioPage = defineType({
  name: "studioPage",
  title: "Studio Page",
  type: "document",
  groups: [GROUPS.content, GROUPS.seo],
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageHeader",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "intro",
      title: "About Content",
      type: "studioIntroSection",
      group: GROUP.MAIN_CONTENT,
      description:
        "The full About write-up for /studio. Independent from the home page's studio-intro teaser — same field shape, separate content.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: GROUP.SEO,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Studio Page" }),
  },
});
