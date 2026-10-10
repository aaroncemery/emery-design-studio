// documents
import { project } from "./documents/project";
import { service } from "./documents/service";
import { testimonial } from "./documents/testimonial";
import { pressItem } from "./documents/pressItem";
import { journalPost } from "./documents/journalPost";
import { inquirySubmission } from "./documents/inquirySubmission";
import { page } from "./documents/page";
import { homePage } from "./documents/homePage";

// page singleton document types
import { studioPage } from "./documents/studioPage";
import { servicesPage } from "./documents/servicesPage";
import { workPage } from "./documents/workPage";
import { journalPage } from "./documents/journalPage";

// admin document types
import { siteSettings } from "./documents/siteSettings";
import { navigation } from "./documents/navigation";
import { footer } from "./documents/footer";
import { legalPage } from "./documents/legalPage";

// page builder section object types
import { heroSection } from "./sections/heroSection";
import { studioIntroSection } from "./sections/studioIntroSection";
import { collectionSection } from "./sections/collectionSection";
import { inquirySection } from "./sections/inquirySection";

// shared object types
import { seo } from "./objects/seo";
import { navItem } from "./objects/navItem";
import { socialLink } from "./objects/socialLink";
import { heroCorner } from "./objects/heroCorner";
import { pageHeader } from "./objects/pageHeader";

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
  // page singleton document types
  studioPage,
  servicesPage,
  workPage,
  journalPage,
  // section object types
  heroSection,
  studioIntroSection,
  collectionSection,
  inquirySection,
  // shared object types
  seo,
  navItem,
  socialLink,
  heroCorner,
  pageHeader,
  // admin document types
  siteSettings,
  navigation,
  footer,
  legalPage,
];
