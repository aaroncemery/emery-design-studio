import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/schemaTypes";

const SINGLETON_HOME_PAGE_ID = "singleton-homePage";
const SINGLETON_SITE_SETTINGS_ID = "singleton-siteSettings";
const SINGLETON_NAVIGATION_ID = "singleton-navigation";
const SINGLETON_FOOTER_ID = "singleton-footer";

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
              .child(
                S.list()
                  .title("Admin")
                  .items([
                    S.listItem()
                      .title("Site Settings")
                      .id("siteSettings")
                      .child(
                        S.document()
                          .schemaType("siteSettings")
                          .documentId(SINGLETON_SITE_SETTINGS_ID),
                      ),

                    S.listItem()
                      .title("Navigation")
                      .id("navigation")
                      .child(
                        S.document()
                          .schemaType("navigation")
                          .documentId(SINGLETON_NAVIGATION_ID),
                      ),

                    S.listItem()
                      .title("Footer")
                      .id("footer")
                      .child(
                        S.document()
                          .schemaType("footer")
                          .documentId(SINGLETON_FOOTER_ID),
                      ),

                    S.divider(),

                    S.listItem()
                      .title("Legal Pages")
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
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId(SINGLETON_HOME_PAGE_ID),
              ),

            S.divider(),

            S.listItem()
              .title("Projects")
              .schemaType("project")
              .child(S.documentTypeList("project").title("Projects")),

            S.listItem()
              .title("Services")
              .schemaType("service")
              .child(S.documentTypeList("service").title("Services")),

            S.listItem()
              .title("Testimonials")
              .schemaType("testimonial")
              .child(S.documentTypeList("testimonial").title("Testimonials")),

            S.listItem()
              .title("Press Items")
              .schemaType("pressItem")
              .child(S.documentTypeList("pressItem").title("Press Items")),

            S.listItem()
              .title("Journal Posts")
              .schemaType("journalPost")
              .child(S.documentTypeList("journalPost").title("Journal Posts")),

            S.divider(),

            S.listItem()
              .title("Pages")
              .schemaType("page")
              .child(S.documentTypeList("page").title("Pages")),

            S.divider(),

            S.listItem()
              .title("Inquiry Submissions")
              .schemaType("inquirySubmission")
              .child(
                S.documentTypeList("inquirySubmission").title(
                  "Inquiry Submissions",
                ),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
