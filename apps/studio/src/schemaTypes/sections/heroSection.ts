import { defineType, defineField } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({ name: "headline", type: "string" }),
    defineField({ name: "subheadline", type: "string" }),
    defineField({
      name: "availabilityText",
      title: "Availability Text",
      type: "string",
      description: 'e.g. "Two commissions for 2026, 2 of 6–8 slots open"',
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: 'e.g. "File №24—Resi · Vol. XII · Spec. A"',
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }) => ({
      title: title || "Hero Section",
      subtitle: "Hero",
    }),
  },
});
