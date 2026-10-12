import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// Crawlers that collect data to train AI models. Blocked — there's no
// upside to the studio in having its photography and copy used as
// training data, only downside.
const TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Google-Extended",
  "Bytespider",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Amazonbot",
  "Diffbot",
];

// Crawlers that fetch pages on-demand (or build a live answer/search index)
// when someone asks an AI assistant about the studio. Kept open so the
// studio can actually surface in those answers.
const RETRIEVAL_CRAWLERS = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...RETRIEVAL_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
      ...TRAINING_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
