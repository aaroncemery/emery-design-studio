import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import {
  presentationTool,
  defineDocuments,
  defineLocations,
} from "sanity/presentation";
import { schemaTypes } from "./src/schemaTypes";
import {
  Settings2Icon,
  CompassIcon,
  FootprintsIcon,
  UserStarIcon,
  ScaleIcon,
  HouseIcon,
  DrillIcon,
  HandPlatterIcon,
  MessageSquareIcon,
  NewspaperIcon,
  NotebookPenIcon,
  StickyNotePlusIcon,
  SpeechIcon,
} from "lucide-react";

const SINGLETON_HOME_PAGE_ID = "singleton-homePage";
const SINGLETON_SITE_SETTINGS_ID = "singleton-siteSettings";
const SINGLETON_NAVIGATION_ID = "singleton-navigation";
const SINGLETON_FOOTER_ID = "singleton-footer";

const PRODUCTION_PREVIEW_URL = "https://www.emerydesign.studio";

const mainDocuments = defineDocuments([
  {
    route: "/work/:slug",
    filter: `_type == "project" && slug.current == $slug`,
  },
  {
    route: "/journal/:slug",
    filter: `_type == "journalPost" && slug.current == $slug`,
  },
  {
    route: "/legal/:slug",
    filter: `_type == "legalPage" && slug.current == $slug`,
  },
  { route: "/", filter: `_type == "homePage"` },
]);

const locations = {
  project: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Untitled", href: `/work/${doc?.slug}` },
        { title: "All projects", href: "/work" },
      ],
    }),
  }),
  journalPost: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Untitled", href: `/journal/${doc?.slug}` },
        { title: "All journal posts", href: "/journal" },
      ],
    }),
  }),
  legalPage: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Untitled", href: `/legal/${doc?.slug}` },
      ],
    }),
  }),
  homePage: defineLocations({
    select: {},
    resolve: () => ({
      locations: [{ title: "Home", href: "/" }],
    }),
  }),
  service: defineLocations({
    select: { title: "title" },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || "Untitled", href: "/" },
        { title: "Services", href: "/services" },
      ],
    }),
  }),
  testimonial: defineLocations({
    message: "Used on the home page if included in a collection section",
    tone: "caution",
  }),
  pressItem: defineLocations({
    message: "Used on the home page if included in a collection section",
    tone: "caution",
  }),
  siteSettings: defineLocations({
    message: "Used on every page",
    tone: "caution",
  }),
  navigation: defineLocations({
    message: "Used on every page",
    tone: "caution",
  }),
  footer: defineLocations({
    message: "Used on every page",
    tone: "caution",
  }),
};

export default defineConfig({
  name: "default",
  title: "Emery Design Studio",

  projectId: "qehxawm7",
  dataset: "edc-prod",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Admin section
            S.listItem()
              .title("Admin")
              .id("admin")
              .icon(UserStarIcon)
              .child(
                S.list()
                  .title("Admin")
                  .items([
                    S.listItem()
                      .title("Site Settings")
                      .id("siteSettings")
                      .icon(Settings2Icon)
                      .child(
                        S.document()
                          .schemaType("siteSettings")
                          .documentId(SINGLETON_SITE_SETTINGS_ID),
                      ),

                    S.listItem()
                      .title("Navigation")
                      .id("navigation")
                      .icon(CompassIcon)
                      .child(
                        S.document()
                          .schemaType("navigation")
                          .documentId(SINGLETON_NAVIGATION_ID),
                      ),

                    S.listItem()
                      .title("Footer")
                      .id("footer")
                      .icon(FootprintsIcon)
                      .child(
                        S.document()
                          .schemaType("footer")
                          .documentId(SINGLETON_FOOTER_ID),
                      ),

                    S.divider(),

                    S.listItem()
                      .title("Legal Pages")
                      .icon(ScaleIcon)
                      .schemaType("legalPage")
                      .child(
                        S.documentTypeList("legalPage").title("Legal Pages"),
                      ),
                  ]),
              ),

            S.divider(),

            // Singleton: only one home page document ever exists
            S.listItem()
              .title("Home Page")
              .id("homePage")
              .icon(HouseIcon)
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId(SINGLETON_HOME_PAGE_ID),
              ),

            S.divider(),

            S.listItem()
              .title("Projects")
              .icon(DrillIcon)
              .schemaType("project")
              .child(S.documentTypeList("project").title("Projects")),

            S.listItem()
              .title("Services")
              .icon(HandPlatterIcon)
              .schemaType("service")
              .child(S.documentTypeList("service").title("Services")),

            S.listItem()
              .title("Testimonials")
              .icon(MessageSquareIcon)
              .schemaType("testimonial")
              .child(S.documentTypeList("testimonial").title("Testimonials")),

            S.listItem()
              .title("Press Items")
              .icon(NewspaperIcon)
              .schemaType("pressItem")
              .child(S.documentTypeList("pressItem").title("Press Items")),

            S.listItem()
              .title("Journal Posts")
              .icon(NotebookPenIcon)
              .schemaType("journalPost")
              .child(S.documentTypeList("journalPost").title("Journal Posts")),

            S.divider(),

            S.listItem()
              .title("Pages")
              .icon(StickyNotePlusIcon)
              .schemaType("page")
              .child(S.documentTypeList("page").title("Pages")),

            S.divider(),

            S.listItem()
              .title("Inquiry Submissions")
              .icon(SpeechIcon)
              .schemaType("inquirySubmission")
              .child(
                S.documentTypeList("inquirySubmission").title(
                  "Inquiry Submissions",
                ),
              ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        initial:
          process.env.SANITY_STUDIO_PREVIEW_URL || PRODUCTION_PREVIEW_URL,
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      allowOrigins: [PRODUCTION_PREVIEW_URL, "http://localhost:3000"],
      resolve: {
        mainDocuments,
        locations,
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
