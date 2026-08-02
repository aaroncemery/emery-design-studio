const imageFields = `
  asset-> {
    _id,
    url,
    metadata {
      dimensions { width, height, aspectRatio },
      lqip
    }
  },
  hotspot { x, y },
  crop { top, bottom, left, right }
`;

const bodyFields = `
  ...,
  _type == "image" => {
    "asset": asset-> {
      _id,
      url,
      metadata { dimensions { width, height, aspectRatio }, lqip }
    }
  }
`;

const seoFields = `
  title,
  description,
  "ogImage": ogImage { ${imageFields} },
  keywords,
  noIndex,
  noFollow,
  robots,
  canonicalUrl
`;

const navItemFields = `
  _key,
  linkType,
  label,
  url,
  "page": page-> { title, "slug": slug.current, _type }
`;

export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    title,
    "seo": seo { ${seoFields} },
    sections[] {
      _type,
      _key,
      headline,
      subheadline,
      availabilityText,
      tagline,
      "backgroundImage": backgroundImage { ${imageFields} },
      heading,
      body[] { ${bodyFields} },
      stats[] { label, value },
      imageLayout,
      "images": images[] { ${imageFields} },
      subheading,
      displayAs,
      "items": items[]-> {
        _type,
        _id,
        title,
        "slug": slug.current,
        location,
        year,
        season,
        category,
        excerpt,
        featured,
        "coverImage": coverImage { ${imageFields} },
        number,
        description,
        tags,
        quote,
        authorName,
        authorContext,
        publicationName,
        url,
        "logo": logo { ${imageFields} }
      },
      scopeOptions,
      budgetOptions
    }
  }
`;

export const FEATURED_PROJECTS_QUERY = `
  *[_type == "project" && featured == true] | order(year desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    season,
    category,
    excerpt,
    "coverImage": coverImage { ${imageFields} }
  }
`;

export const ALL_PROJECTS_QUERY = `
  *[_type == "project"] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    season,
    category,
    excerpt,
    featured,
    "coverImage": coverImage { ${imageFields} }
  }
`;

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    season,
    category,
    excerpt,
    featured,
    "coverImage": coverImage { ${imageFields} },
    gallery[] { ${imageFields} },
    body[] { ${bodyFields} },
    "seo": seo { ${seoFields} }
  }
`;

export const ALL_SERVICES_QUERY = `
  *[_type == "service"] | order(number asc) {
    _id,
    title,
    "slug": slug.current,
    number,
    description,
    tags
  }
`;

export const ALL_TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] {
    _id,
    quote,
    authorName,
    authorContext
  }
`;

export const ALL_PRESS_ITEMS_QUERY = `
  *[_type == "pressItem"] {
    _id,
    publicationName,
    url,
    "logo": logo { ${imageFields} }
  }
`;

export const ALL_JOURNAL_POSTS_QUERY = `
  *[_type == "journalPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    "coverImage": coverImage { ${imageFields} }
  }
`;

export const JOURNAL_POST_BY_SLUG_QUERY = `
  *[_type == "journalPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    "coverImage": coverImage { ${imageFields} },
    body[] { ${bodyFields} },
    "seo": seo { ${seoFields} }
  }
`;

export const PAGE_BY_SLUG_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    sections[] {
      _type,
      _key,
      headline,
      subheadline,
      availabilityText,
      tagline,
      "backgroundImage": backgroundImage { ${imageFields} },
      heading,
      body[] { ${bodyFields} },
      stats[] { label, value },
      imageLayout,
      "images": images[] { ${imageFields} },
      subheading,
      displayAs,
      "items": items[]-> {
        _type,
        _id,
        title,
        "slug": slug.current,
        location,
        year,
        season,
        category,
        excerpt,
        featured,
        "coverImage": coverImage { ${imageFields} },
        number,
        description,
        tags,
        quote,
        authorName,
        authorContext,
        publicationName,
        url,
        "logo": logo { ${imageFields} }
      },
      scopeOptions,
      budgetOptions
    },
    "seo": seo { ${seoFields} }
  }
`;

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    "defaultOgImage": defaultOgImage { ${imageFields} },
    "logo": logo { ${imageFields} },
    "favicon": favicon { ${imageFields} }
  }
`;

export const NAVIGATION_QUERY = `
  *[_type == "navigation"][0] {
    items[] {
      ${navItemFields}
    }
  }
`;

export const FOOTER_QUERY = `
  *[_type == "footer"][0] {
    copyrightText,
    socialLinks[] {
      _key,
      platform,
      url
    },
    legalLinks[] {
      ${navItemFields}
    }
  }
`;

export const ALL_LEGAL_PAGES_QUERY = `
  *[_type == "legalPage"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

export const LEGAL_PAGE_BY_SLUG_QUERY = `
  *[_type == "legalPage" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    body[] { ${bodyFields} },
    "seo": seo { ${seoFields} }
  }
`;
