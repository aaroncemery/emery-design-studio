import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "Houzz", value: "houzz" },
          { title: "YouTube", value: "youtube" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      platform: "platform",
      url: "url",
    },
    prepare({ platform, url }) {
      const title = platform
        ? platform.charAt(0).toUpperCase() + platform.slice(1)
        : "Social Link";
      return { title, subtitle: url };
    },
  },
});
