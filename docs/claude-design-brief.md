# Emery Design Studio — Design Brief for Claude Design

**Purpose:** current-state snapshot of the live site (as of 2026-10-18, post "services page" PR #17). Treat this as the source of truth over any earlier mockups. New designs should extend what exists, not restart it.

## What it is

Marketing site for a small residential interior design studio (Kirkland, WA / Lake Washington / Puget Sound). Quiet, editorial, architectural. Think printed monograph or gallery catalogue, not SaaS. Next.js + Sanity; the owner edits all content in Sanity Studio, so designs must assume **every string and image is editor-supplied** and must degrade to an honest empty state ("Projects coming soon.", "Photography coming soon") — **never invented names, testimonials, or facts**.

## Pages / routes

`/` home · `/work` (filterable grid) · `/work/[slug]` project detail · `/studio` · `/services` · `/journal` · `/journal/[slug]` · `/legal/[slug]`. Inquiry form lives on the home page (`/#contact`); every "Inquire" CTA points there.

### Home page section order (numbered with § labels)

1. **Hero** — full-viewport (min 720px) photo with parallax, dark gradient vignette (black 50% → 20% → 65%). Centered masthead: mono tagline flanked by 48px hairlines, huge light serif H1 in two lines ("Interiors /" then italic "of consequence."), short sans subhead (max ~384px), two outlined-white CTAs ("Begin an inquiry →", "Selected work"). Bottom credit rail (desktop only), 3 columns: featured project corner (italic serif, left), animated scroll cue (center), availability status (right).
2. **§ 02 — Selected Work** (paper bg) — header row: mono eyebrow + big serif H2 with italic emphasis on left, short blurb + "The full archive" CTA on right. Below: 12‑column staggered/asymmetric project grid (up to 5 projects, varied column spans), reveal-on-scroll.
3. **§ 03 — The Studio** (warm paper bg #ece8df) — 2 columns, ~120px gap: image panel (main image + overlapping inset image with 4px border in bg color; layout is editor-selectable: mainWithInset / sideBySide / singleFull) and text column with portable-text body + 3-up stats (italic serif numerals in ink-blue, tiny mono labels) over a top hairline.
4. **§ 04 — Services** (paper bg) — H2 "How we're _usually_ asked to help." followed by service rows separated by hairlines.
5. **§ 05 — Clients** (**dark** #111111 bg) — terracotta eyebrow, big terracotta serif quote mark (120px, 70% opacity), auto-rotating testimonial in large italic serif with horizontal slide (stops when user selects), author in serif + mono context line after a short rule; press mentions row. Empty state: "Client testimonials coming soon."
6. **§ 06 — Inquiry** (warm paper bg) — 2 columns (1fr / 1.2fr, 120px gap): heading/contact info left, form right (name, email, location, scope, message; solid ink-blue submit button).
7. **Footer** (paper bg) — 4-column grid at lg, 2 at sm, 1 on mobile.

### Inner page pattern

Paper-bg section, `paddingY xl`; mono ink-blue eyebrow (e.g. "Services — How We Work"), then big serif H1 split by a "/" convention: line 1 roman, line 2 _italic_ (editors type "Heading / italic part"). Same convention on hero and services. `/studio` uses warm paper bg with min-h 70vh, vertically centered.

### /services (newest, most elaborate)

- Header as above, plus on mobile a numbered jump list (grid: number · title · ↓, hairline-separated, 48px min tap target).
- **Desktop "folio" layout:** 3-column grid `200px | 1fr | 40%`. Left: sticky "Contents" rail (mono labels; active item flips to solid ink block with terracotta number + paper text; thin progress bar + "02 of 05"). Middle: one `article` per service, ~70vh each — mono "01 / 05" in ink-blue, serif title (clamp 32–56px), italic serif subtitle, sans body (15px), "what's included" as a middot-separated gray line, spec row (Duration / Recent projects, mono 11px uppercase over hairline), ghost CTA "See {service} work". Right: sticky photo (viewport height minus nav clearance) — photos are stacked in lanes and **slide vertically** (1s, ease .2/.7/.2/1) in the same direction the copy scrolls, not cross-fade. Active section flips when it crosses a band ~35% down the viewport.
- **Mobile/tablet:** no rail or sticky photo; each service gets an inline full-bleed 4:5 photo above its copy.
- Closing band on warm paper: "Not sure which fits? _Start a conversation._" + accent CTA.

### /work

Mono category filter pills (active = solid ink-blue with white text; inactive = outlined), 3-col grid (2 at md, 1 mobile; gap-x 32px, gap-y 64px), card meta line: `CATEGORY · LOCATION · YEAR` in 9px gray mono. "← Clear filter" link. Detail page (`/work/[slug]`): flat paper masthead (kicker `Title — Category`, serif headline with an italic second line, standfirst, mono byline + optional "The making of ↓" jump link) then a wide cover; a story that is a free sequence of lead/body paragraphs, wide or in-column captioned images, text-beside-image insets (either side), image pairs and centered pull quotes; an optional tinted "The making of" chapter (heading, intro, then loose notes — any mix of label / text / 0–n images, no numbered steps — and a compact Maker strip); an "All photographs" contact sheet with full-screen lightbox; credits; "Next project" teaser; inquiry bar. Every part except the cover, headline and story is optional and simply doesn't render when empty.

## Design tokens (as actually used)

Most components hardcode these hex values; `globals.css` has equivalent OKLCH tokens (`--paper`, `--ink`, `--accent`, etc.). Treat the hex list as canonical.

| Role                                                                   | Value                                                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Paper (primary bg)                                                     | `#f6f4ef`                                                                                   |
| Warm paper (alt sections, studio/inquiry)                              | `#ece8df`                                                                                   |
| Ink (text, solid buttons, dark section bg)                             | `#111111`                                                                                   |
| Body text on paper                                                     | `#2a2a2a` / secondary `#6b6b66` / tertiary-meta `#9a968d`                                   |
| **Accent — ink blue** (eyebrows, accent CTA, stats, active filters)    | `#1b3a5b`, hover `#152e4a`                                                                  |
| **Accent 2 — terracotta** (only on dark surfaces / active rail number) | `#c8553d`                                                                                   |
| Hairline                                                               | `rgba(17,17,17,0.12)`; strong `rgba(17,17,17,0.28)`                                         |
| Image placeholders                                                     | muted CSS gradients: plaster/stone, wood (#5e4210 range), dusk navy, garden green, daylight |
| Extra palette tokens defined but rarely used                           | oxblood, forest, cobalt                                                                     |

No dark mode on the site (the shadcn `.dark` block exists but isn't used). Light, warm, paper-like.

## Typography (all self-hosted)

- **Serif — Canela** (weights 100–900 + italics; headings use light/regular). H1 `clamp(48px, 6vw, 96px)` on inner pages, `clamp(56px, 8vw, 132px)` on hero. Line-height **0.92**, `tracking-tight`. Italic is the signature emphasis device (single words or the second line of a headline).
- **Sans — Suisse Int'l** (hairline → black). Body 14–15px, relaxed leading, gray tones.
- **Mono — JetBrains Mono**. The "label voice": `10px`, `letter-spacing 0.18em`, UPPERCASE, line-height 1 (9px for tiny meta). Used for eyebrows, nav, buttons, filters, captions, spec labels, section numbers ("§ 02 — Selected Work").
- **Wordmark — Naancy** (bold, 48px full / 20px compact, `-0.05em` tracking, uppercase, "EMERY"). If a logo image is uploaded in Sanity it replaces the text wordmark.

## Components & patterns

- **Section container:** max-width 1480px, side padding 24 / 40 / 56px (base / md / lg); vertical rhythm `py-20 md:py-32 lg:py-48` for major sections.
- **CTA button:** rectangular (no radius), 1px border, mono 10px uppercase, `px-6 py-3`, trailing `→` that nudges 4px right on hover. Variants: `solid` (ink outline → fills ink), `accent` (filled ink-blue), `ghost` (gray outline, muted text), `onImage` (white outline → fills paper). Transition 360ms `cubic-bezier(.2,.7,.2,1)`.
- **Nav:** fixed floating. Desktop = 3-col grid, baseline-aligned: wordmark + tiny location line (left), centered **pill** with links Work · Studio · Services · Journal + divider + outlined round "Inquire →" (center). Over dark photo heroes (home, journal detail) it's transparent white with `mix-blend-difference`; after 60px scroll or on any flat-light page it becomes a frosted pill (paper 88% + 18px blur + soft shadow + hairline border). Mobile uses a sheet menu. Optional header strings: location ("Puget Sound · Pacific Northwest"), "Established MMXIV", index label ("Index №01 — Home").
- **Rule:** 1px hairline `<hr>`; used between service rows, above stats and spec lists.
- **Reveal:** elements fade/translate up 24px over 600ms when entering the viewport (once); disabled under `prefers-reduced-motion`.
- **Motion principles:** one easing curve everywhere (`.2, .7, .2, 1`), slow (400ms–1s), physical/directional rather than blinky. Hero background has parallax (0→25%) and a looping scroll cue.
- **Structure principle (from CLAUDE.md):** layouts use native flex/grid and baseline alignment, no hand-tuned absolute offsets. Designs that need a magic-number nudge to look right will be rebuilt differently.
- **Accessibility:** skip-to-content link (ink-blue pill on focus), reduced-motion respected, 48px min tap targets on mobile lists, aria-current on rail.
- Breakpoints: Tailwind defaults; main layout switches at `lg` (1024px), secondary at `md` (768px).

## Voice / copy conventions

Quiet, first-person-plural, understated ("Rooms we've / _quietly_ built.", "Interiors / _of consequence._", "Considered residential interiors from a small, slow studio on Lake Washington."). Section numerals with § and em dash. Italic for the emotional word. No exclamation marks, no marketing superlatives.

## Constraints for new designs

1. Everything editable in Sanity — design with fields in mind (eyebrow, heading with "/" italic split, subhead, image + alt + caption, list of items); flag any new field you need.
2. Every component needs an empty/"coming soon" state and a no-image placeholder state (the gradient placeholders above).
3. Keep to the existing palette (paper / warm paper / ink / ink-blue; terracotta only on dark) and the Canela × Suisse × mono triad; don't introduce new typefaces, radii (almost everything is square; only the nav pill and inquire button are round), shadows, or gradients beyond the hero vignette.
4. Mobile first-class: the desktop sticky/rail patterns collapse to inline stacked versions at < 1024px.
5. Dark surfaces exist only in: hero (over photo), Clients section (#111111). Footer and the rest are light.

## Not covered here

Footer column contents, mobile menu sheet styling, journal detail body typography, and the inquiry form field styling in detail — see the screenshots (attach live-site captures of these) or the source files: `apps/frontend/src/components/**`, `apps/frontend/src/app/globals.css`, `apps/frontend/src/app/layout.tsx`.
