import { defineType, defineField } from "sanity";

export const inquirySubmission = defineType({
  name: "inquirySubmission",
  title: "Inquiry Submission",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "scope", type: "string" }),
    defineField({ name: "budget", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Responded", value: "responded" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email" },
  },
});
