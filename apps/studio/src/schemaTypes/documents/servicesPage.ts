import { defineType, defineField } from "sanity";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageHeader",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Services Page" }),
  },
});
