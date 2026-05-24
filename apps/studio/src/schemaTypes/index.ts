// documents
import { project } from "./documents/project";
import { service } from "./documents/service";
import { testimonial } from "./documents/testimonial";
import { pressItem } from "./documents/pressItem";
import { journalPost } from "./documents/journalPost";
import { inquirySubmission } from "./documents/inquirySubmission";
import { page } from "./documents/page";
import { homePage } from "./documents/homePage";

// page builder section object types
import { heroSection } from "./sections/heroSection";
import { studioIntroSection } from "./sections/studioIntroSection";
import { collectionSection } from "./sections/collectionSection";
import { inquirySection } from "./sections/inquirySection";

export const schemaTypes = [
  // documents
  project,
  service,
  testimonial,
  pressItem,
  journalPost,
  inquirySubmission,
  page,
  homePage,
  // section object types
  heroSection,
  studioIntroSection,
  collectionSection,
  inquirySection,
];
