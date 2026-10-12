import { defineType, defineField } from "sanity";
import { GROUP, GROUPS } from "../../utils/constants";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
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
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Short paragraph shown beside the H1 in the header.",
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
    prepare: () => ({ title: "Services Page" }),
  },
});
