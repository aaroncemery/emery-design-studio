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

---

## Housekeeping Done (2026-05-23)

- All Sanity packages confirmed at latest: `sanity@5.26.0`, `next-sanity@13.0.3`, `@sanity/image-url@2.1.1`, `@sanity/vision@5.26.0`
- All other monorepo packages confirmed up to date (pnpm outdated --recursive: nothing to report)
- `.nvmrc` added to repo root (`lts/*`) — run `nvm use` on entry to silence the Node engine warning
- Version skew note from Session 1 is resolved — studio is on 5.26.0

---

## Current Status

**Next step: Enter content in Sanity Studio and verify the live frontend**

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
