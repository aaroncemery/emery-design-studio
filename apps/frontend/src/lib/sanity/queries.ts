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

export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    title,
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
    body[] { ${bodyFields} }
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
    body[] { ${bodyFields} }
  }
`;
