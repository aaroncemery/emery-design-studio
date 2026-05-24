# Sanity Integration Plan — Emery Design Studio

## Decisions (resolved via grill-me, 2026-05-23)

### Technical Stack

- Package: `next-sanity` (sanityFetch + revalidateTag, no bare client)
- Project ID: `qehxawm7` | Dataset: `edc-prod`
- Fetching: `sanityFetch` in React Server Components, `revalidateTag` for on-demand cache busting
- No live preview / Visual Editing this pass
- Inquiry form: Sanity write (record) + Resend email (notification), belt-and-suspenders

### Env Vars Needed (add to apps/frontend/.env.local)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=qehxawm7
NEXT_PUBLIC_SANITY_DATASET=edc-prod
SANITY_API_READ_TOKEN=       # viewer token from Sanity dashboard
SANITY_API_WRITE_TOKEN=      # editor token — server action only, never client-exposed
RESEND_API_KEY=              # from Resend dashboard
RESEND_TO_EMAIL=             # business inbox email
```

---

## Schema: Document Types

### `project`

| Field      | Type            | Notes                                                                         |
| ---------- | --------------- | ----------------------------------------------------------------------------- |
| title      | string          | required                                                                      |
| slug       | slug            | auto from title, used for /work/[slug]                                        |
| location   | string          | e.g. "Seattle, WA"                                                            |
| year       | number          | e.g. 2025                                                                     |
| season     | select          | spring / summer / fall / winter / year-round                                  |
| category   | select          | Full Renovation / Interior Architecture / Styling & Furnishing / Consultation |
| excerpt    | text            | 1–2 sentence card blurb                                                       |
| coverImage | image (hotspot) | homepage grid + archive card                                                  |
| gallery    | image[]         | individual project page                                                       |
| body       | portable text   | long-form write-up on project page                                            |
| featured   | boolean         | pulls into homepage featured grid                                             |

### `service`

| Field       | Type     | Notes                                   |
| ----------- | -------- | --------------------------------------- |
| title       | string   | required                                |
| slug        | slug     | auto from title                         |
| number      | string   | e.g. "01"                               |
| description | text     |                                         |
| tags        | string[] | e.g. ["Concept", "Procurement", "FF&E"] |

### `testimonial`

| Field         | Type   | Notes                               |
| ------------- | ------ | ----------------------------------- |
| quote         | text   | required                            |
| authorName    | string |                                     |
| authorContext | string | e.g. "Madison Park Residence, 2024" |

### `pressItem`

| Field           | Type   | Notes    |
| --------------- | ------ | -------- |
| publicationName | string | required |
| logo            | image  |          |
| url             | url    | optional |

### `journalPost`

| Field       | Type            | Notes                                     |
| ----------- | --------------- | ----------------------------------------- |
| title       | string          | required                                  |
| slug        | slug            | auto from title, used for /journal/[slug] |
| author      | string          |                                           |
| publishedAt | datetime        |                                           |
| coverImage  | image (hotspot) |                                           |
| body        | portable text   | full article                              |

### `inquirySubmission`

| Field       | Type     | Notes                      |
| ----------- | -------- | -------------------------- |
| name        | string   |                            |
| email       | string   |                            |
| location    | string   |                            |
| scope       | string   | value from form select     |
| budget      | string   | value from form toggle     |
| message     | text     |                            |
| submittedAt | datetime | auto-set on create         |
| status      | select   | new / reviewed / responded |

### `page`

| Field    | Type   | Notes                                         |
| -------- | ------ | --------------------------------------------- |
| title    | string | required                                      |
| slug     | slug   | used for routing                              |
| sections | array  | page builder — see section object types below |

### `homePage` (singleton)

| Field    | Type   | Notes                              |
| -------- | ------ | ---------------------------------- |
| title    | string | internal label only                |
| sections | array  | page builder — same pool as `page` |

---

## Schema: Page Builder Section Object Types

All section types are usable in both `homePage` and `page`.

### `heroSection`

- headline (string)
- subheadline (string)
- availabilityText (string) — e.g. "Two commissions for 2026"
- tagline (string) — e.g. "File №24—Resi · Vol. XII · Spec. A"
- backgroundImage (image with hotspot)

### `studioIntroSection`

- heading (string)
- body (portable text)
- stats (array of { label, value })
- images (image[]) — main + inset

### `collectionSection`

- heading (string)
- subheading (string, optional)
- displayAs (select): `projectGrid` | `serviceRows` | `testimonialRotator` | `pressMentions`
- items (array of references → project | service | testimonial | pressItem)

### `inquirySection`

- heading (string)
- subheading (string)
- scopeOptions (string[]) — options shown in the scope dropdown
- budgetOptions (string[]) — options shown as pill toggles

---

## Studio Structure (structure builder)

- Singletons: Home Page
- Content: Projects, Services, Testimonials, Press Items, Journal Posts
- Pages: Pages
- Submissions: Inquiry Submissions (read-only display, no publish action needed)

---

## Schema: SEO + Admin Types (resolved via grill-me, 2026-05-24)

### Decisions

- Three Admin singletons: `siteSettings`, `navigation`, `footer` — each a separate document
- One Admin document list: `legalPage` (title, slug, portable text body)
- `seo` object type: reuse user's existing shape (title, description, ogImage, keywords, noIndex, noFollow, robots, canonicalUrl)
- `navItem` object type: `linkType` select (`page` | `url`), `page` reference → `page` doc, `url` string, `label` string (optional override)
- `socialLink` object type: `platform` select (Instagram | Facebook | Houzz | YouTube), `url` string
- SEO group added to: `homePage`, `page`, `journalPost`, `project` — not service/testimonial/pressItem
- Simple docs (`service`, `testimonial`, `pressItem`, `inquirySubmission`) stay ungrouped

### `siteSettings` (singleton, Admin)

| Field           | Type   | Notes                                |
| --------------- | ------ | ------------------------------------ | -------------------- |
| siteName        | string | Used as title suffix — "             | Emery Design Studio" |
| siteDescription | text   | Default meta description fallback    |
| defaultOgImage  | image  | Fallback OG image when page has none |
| logo            | image  | Site logo for nav/header             |
| favicon         | image  | Browser tab icon                     |

### `navigation` (singleton, Admin)

| Field | Type      | Notes                     |
| ----- | --------- | ------------------------- |
| items | navItem[] | Ordered list of nav links |

### `footer` (singleton, Admin)

| Field         | Type         | Notes                                           |
| ------------- | ------------ | ----------------------------------------------- |
| copyrightText | string       | e.g. "© 2025 Emery Design Studio"               |
| socialLinks   | socialLink[] | Platform select + URL                           |
| legalLinks    | navItem[]    | Flat link list — references legalPage documents |

### `legalPage` (document list, Admin)

| Field | Type          | Notes           |
| ----- | ------------- | --------------- |
| title | string        | required        |
| slug  | slug          | auto from title |
| body  | portable text | legal content   |

### Groups added to existing documents

| Document      | Groups                       |
| ------------- | ---------------------------- |
| `homePage`    | Content, SEO                 |
| `page`        | Content, SEO                 |
| `journalPost` | Content, Media, SEO          |
| `project`     | Content, Details, Media, SEO |

**project group assignments:**

- Content: title, slug, excerpt, body, featured
- Details: location, year, season, category
- Media: coverImage, gallery
- SEO: seo

**journalPost group assignments:**

- Content: title, slug, author, publishedAt, body
- Media: coverImage
- SEO: seo

### Updated Studio Structure (Admin section added)

```
Admin
  ├── Site Settings (singleton)
  ├── Navigation (singleton)
  ├── Footer (singleton)
  └── Legal Pages (document list)

Content (existing, unchanged)
  ├── Home Page (singleton)
  ├── ─────────────────────
  ├── Projects
  ├── Services
  ├── Testimonials
  ├── Press Items
  ├── Journal Posts
  ├── ─────────────────────
  ├── Pages
  ├── ─────────────────────
  └── Inquiry Submissions
```

---

## Implementation Checklist

### Session 1 — Sanity Studio Schemas ✅ COMPLETE (2026-05-23)

- [x] Create `apps/studio/src/schemaTypes/documents/project.ts`
- [x] Create `apps/studio/src/schemaTypes/documents/service.ts`
- [x] Create `apps/studio/src/schemaTypes/documents/testimonial.ts`
- [x] Create `apps/studio/src/schemaTypes/documents/pressItem.ts`
- [x] Create `apps/studio/src/schemaTypes/documents/journalPost.ts`
- [x] Create `apps/studio/src/schemaTypes/documents/inquirySubmission.ts`
- [x] Create `apps/studio/src/schemaTypes/documents/page.ts`
- [x] Create `apps/studio/src/schemaTypes/documents/homePage.ts`
- [x] Create `apps/studio/src/schemaTypes/sections/heroSection.ts`
- [x] Create `apps/studio/src/schemaTypes/sections/studioIntroSection.ts`
- [x] Create `apps/studio/src/schemaTypes/sections/collectionSection.ts`
- [x] Create `apps/studio/src/schemaTypes/sections/inquirySection.ts`
- [x] Wire all schemas in `apps/studio/src/schemaTypes/index.ts`
- [x] Configure structure builder in `apps/studio/sanity.config.ts` (singletons, submission queue)
- [x] Verified Studio runs, TypeScript clean, HTTP 200 at localhost:3333

### Session 2 — Frontend Client + Queries ✅ COMPLETE (2026-05-23)

- [x] Install `next-sanity` in `apps/frontend`
- [x] Install `resend` in `apps/frontend`
- [x] Create `apps/frontend/src/lib/sanity/client.ts` (createClient, sanityFetch, urlFor)
- [x] Create `apps/frontend/src/lib/sanity/queries.ts` (GROQ per content type + page builder)
- [x] Create `apps/frontend/src/lib/sanity/types.ts` (TypeScript interfaces)
- [x] Env vars confirmed in `apps/frontend/.env.local` (all tokens present)
- [x] Update `apps/frontend/src/app/actions/inquiry.ts` to write to Sanity + send Resend email

### Session 3 — Frontend Component Wiring ✅ COMPLETE (2026-05-23)

- [x] Update `apps/frontend/src/app/page.tsx` to fetch homePage from Sanity + render page builder
- [x] Update `hero.tsx` to accept Sanity data props
- [x] Update `featured-projects.tsx` to accept Sanity data props
- [x] Update `studio-intro.tsx` to accept Sanity data props
- [x] Update `services.tsx` to accept Sanity data props
- [x] Update `testimonials.tsx` to accept Sanity data props
- [x] Update `inquiry.tsx` to accept Sanity data props (scope/budget options)
- [x] Update `apps/frontend/src/app/work/page.tsx` (archive — fetch all projects)
- [x] Create `apps/frontend/src/app/work/[slug]/page.tsx` (individual project, fixed format)
- [x] Update `apps/frontend/src/app/journal/page.tsx` (archive — fetch all posts)
- [x] Create `apps/frontend/src/app/journal/[slug]/page.tsx` (individual post, fixed format)
- [x] Update `apps/frontend/src/app/services/page.tsx` to fetch services from Sanity

### Session 4 — SEO + Admin: Studio Schemas

**4A — New object types** ✅ COMPLETE (2026-05-24)

- [x] Create `apps/studio/src/schemaTypes/objects/seo.ts` (user's existing SeoType shape)
- [x] Create `apps/studio/src/schemaTypes/objects/navItem.ts` (linkType select, page ref, url string, label override)
- [x] Create `apps/studio/src/schemaTypes/objects/socialLink.ts` (platform select: Instagram/Facebook/Houzz/YouTube + url)

**4B — New Admin document types** ✅ COMPLETE (2026-05-24)

- [x] Create `apps/studio/src/schemaTypes/documents/siteSettings.ts` (siteName, siteDescription, defaultOgImage, logo, favicon)
- [x] Create `apps/studio/src/schemaTypes/documents/navigation.ts` (items: navItem[])
- [x] Create `apps/studio/src/schemaTypes/documents/footer.ts` (copyrightText, socialLinks, legalLinks)
- [x] Create `apps/studio/src/schemaTypes/documents/legalPage.ts` (title, slug, body portable text)

**4C — Update existing document types with groups + SEO**

- [ ] Update `homePage.ts` — add fieldGroups (content, seo) + assign fields + add seo field
- [ ] Update `page.ts` — add fieldGroups (content, seo) + assign fields + add seo field
- [ ] Update `journalPost.ts` — add fieldGroups (content, media, seo) + assign fields + add seo field
- [ ] Update `project.ts` — add fieldGroups (content, details, media, seo) + assign fields + add seo field

**4D — Wire schemas + structure builder**

- [ ] Update `apps/studio/src/schemaTypes/index.ts` — add all new types
- [ ] Update `apps/studio/sanity.config.ts` — add Admin section with 4 singletons/lists, keep existing Content items

### Session 5 — SEO + Admin: Frontend Wiring

**5A — GROQ queries**

- [ ] Add `siteSettingsQuery` to `queries.ts`
- [ ] Add `navigationQuery` to `queries.ts`
- [ ] Add `footerQuery` to `queries.ts`
- [ ] Add `legalPageQuery` + `legalPageBySlugQuery` to `queries.ts`
- [ ] Update page/homePage/journalPost/project queries to include `seo` field

**5B — TypeScript types**

- [ ] Add `Seo`, `NavItem`, `SocialLink` interfaces to `types.ts`
- [ ] Add `SiteSettings`, `Navigation`, `Footer`, `LegalPage` interfaces to `types.ts`
- [ ] Update existing page/post/project types to include optional `seo` field

**5C — Layout + nav/footer wiring**

- [ ] Update root layout (`apps/frontend/src/app/layout.tsx`) to fetch siteSettings, navigation, footer
- [ ] Update nav component to render from Sanity `navigation` document
- [ ] Update footer component to render from Sanity `footer` document (copyright, socials, legal links)

**5D — Per-page SEO metadata**

- [ ] Create shared `buildMetadata()` helper that merges page seo + siteSettings fallbacks
- [ ] Update `app/page.tsx` (home) `generateMetadata` to use Sanity seo
- [ ] Update `app/work/page.tsx` `generateMetadata`
- [ ] Update `app/work/[slug]/page.tsx` `generateMetadata`
- [ ] Update `app/journal/page.tsx` `generateMetadata`
- [ ] Update `app/journal/[slug]/page.tsx` `generateMetadata`
- [ ] Create `app/legal/[slug]/page.tsx` — fetch and render `legalPage` doc

### Session 6 — Image Layout Control: studioIntroSection

**Scope:** `studioIntroSection` only. Project grid and individual project card sizing are frontend/CSS concerns — no schema change needed there.

**Decision:** Section-level `imageLayout` select (not per-image). Three presets:

- `mainWithInset` — large portrait main + small square overlapping (current hardcoded default)
- `sideBySide` — two equal images side by side
- `singleFull` — one full-width image, no inset

**6A — Studio schema**

- [ ] Update `studioIntroSection.ts` — add `imageLayout` select field with three options, `initialValue: 'mainWithInset'`

**6B — Frontend**

- [ ] Update the `StudioIntroSection` component to read `imageLayout` and apply the corresponding CSS class/variant

---

## Housekeeping Done (2026-05-23)

- All Sanity packages confirmed at latest: `sanity@5.26.0`, `next-sanity@13.0.3`, `@sanity/image-url@2.1.1`, `@sanity/vision@5.26.0`
- All other monorepo packages confirmed up to date (pnpm outdated --recursive: nothing to report)
- `.nvmrc` added to repo root (`lts/*`) — run `nvm use` on entry to silence the Node engine warning
- Version skew note from Session 1 is resolved — studio is on 5.26.0

---

## Current Status

**Sessions 1–3 complete. Next up: Session 4A — new object types.**

Sessions 4 and 5 are the SEO + Admin pass (resolved via grill-me, 2026-05-24). Work in order: 4A → 4B → 4C → 4D → 5A → 5B → 5C → 5D.

---

**After Sessions 1–3: Enter content in Sanity Studio and verify the live frontend**

1. Start the studio: `pnpm dev --filter studio` → http://localhost:3333
2. Create a **Home Page** document and add sections (heroSection, studioIntroSection, collectionSections for projects/services/testimonials/press, inquirySection)
3. Create at least one **Project** (mark it featured=true), one **Service**, one **Testimonial**, one **Press Item**
4. Publish everything
5. Start the frontend: `pnpm dev --filter frontend` → http://localhost:3000
6. Verify homepage renders Sanity content (not fallbacks), /work shows the project grid, /work/[slug] renders the project page, /services renders from CMS
7. Submit a test inquiry and confirm it appears in Sanity under Submissions and an email arrives at amanda@emerydesign.studio

**After content is verified**, the integration is production-ready. Remaining pre-deploy items:

- Add `noreply@emerydesign.studio` as a verified sender in the Resend dashboard (currently used as the from address in inquiry.ts)
- Set env vars on the production host (Vercel / wherever) — same vars as .env.local
- Deploy studio: `pnpm deploy --filter studio`
