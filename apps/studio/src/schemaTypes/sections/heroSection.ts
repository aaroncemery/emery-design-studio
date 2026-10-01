import { defineType, defineField } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({ name: "headline", type: "string" }),
    defineField({ name: "subheadline", type: "string" }),
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
    defineField({
      name: "heroFeatured",
      title: "Hero – bottom left",
      type: "heroCorner",
      initialValue: { eyebrow: "Featured" },
    }),
    defineField({
      name: "heroStatus",
      title: "Hero – bottom right",
      type: "heroCorner",
      initialValue: {
        eyebrow: "Now booking",
        headline: "Spring 2027 projects",
        meta: "Seattle · Eastside · Remote",
      },
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
