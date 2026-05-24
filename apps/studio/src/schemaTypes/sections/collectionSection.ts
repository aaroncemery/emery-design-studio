import { defineType, defineField, defineArrayMember } from "sanity";

export const collectionSection = defineType({
  name: "collectionSection",
  title: "Collection Section",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "string" }),
    defineField({
      name: "displayAs",
      title: "Display As",
      type: "string",
      options: {
        list: [
          { title: "Project Grid", value: "projectGrid" },
          { title: "Service Rows", value: "serviceRows" },
          { title: "Testimonial Rotator", value: "testimonialRotator" },
          { title: "Press Mentions", value: "pressMentions" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [
            { type: "project" },
            { type: "service" },
            { type: "testimonial" },
            { type: "pressItem" },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "displayAs" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Collection Section",
      subtitle: subtitle,
    }),
  },
});
