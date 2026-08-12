// ============================================================================
// Site content types
//
// `src/content/site.js` is a single plain, unchecked JS module
// (`export const content = {...}`) and every page/section component in this
// app receives the SAME object as its `t` prop (see `src/pages/index.astro`:
// `import { content as t } from "../content/site.js"`, then
// `<HeroExperience t={t} />`, `<AboutSection t={t} />`, etc. — always the
// same `t`, never a hand-built subset).
//
// To avoid re-declaring the same field shapes under a different name in
// every component, each sub-shape below is defined exactly once, named
// after the real `site.js` key it mirrors, and every component-level
// `*Content` alias below is composed from those shared pieces (via direct
// reuse or `Pick<>`) rather than a fresh, parallel interface.
// ============================================================================

// ---- SEO ------------------------------------------------------------------

export interface SeoContent {
  title: string;
  description: string;
}

// ---- Navigation -------------------------------------------------------------
// `nav` has 7 keys in `site.js`. Two different subsets of it are consumed:
// the hero (full hero nav + compact nav + mobile nav, 6 keys — no `faq`)
// and `SimpleNav.astro` (5 keys — no `home`, no `faq`). Both are `Pick<>`s
// of this one interface instead of separate hand-typed shapes.
export interface NavigationContent {
  home: string;
  about: string;
  contact: string;
  projects: string;
  services: string;
  tools: string;
  faq: string;
}

// Widened to include `faq` — the sidebar's own nav list (built inside
// `HeroExperience.astro`, independent from the hero's own top nav) now has
// a 7th FAQ entry. The hero's own top nav / mobile nav still only ever
// read the original 6 keys, so this addition is additive and doesn't
// change what they render.
export type HeroNavigationContent = Pick<
  NavigationContent,
  "home" | "about" | "contact" | "projects" | "services" | "tools" | "faq"
>;

// ---- Hero -------------------------------------------------------------------

export interface HeroMetric {
  value: string;
  label: string;
}

export interface HeroContent {
  /** Giant 5-letter display wordmark ("CHISU"), rendered only in the hero
   * as a decorative visual layer — NOT the site's real name. Independent
   * from `siteName`; never derive one from the other. */
  displayWordmark: string;
  /** The actual site/brand name ("CHIISSUU") — the accessible name of the
   * hero→sidebar crossfade and anywhere the real name (not the stylized
   * hero mark) is needed. No longer used for the sidebar's boxed brand
   * mark — see `sidebarMark`. */
  siteName: string;
  /** Dedicated text for the sidebar's boxed brand mark ("CHISU®") —
   * deliberately independent from `displayWordmark` (hero's giant
   * decorative word) and `siteName` (full brand name used elsewhere).
   * Never derive one from the others. */
  sidebarMark: string;
  // NOTE: `site.js` declares this as a plain (non-`as const`) array literal,
  // so TypeScript infers it as `string[]`, not a 3-tuple — a tuple type here
  // would make `t={t}` at the `<HeroExperience t={t} />` call site fail with
  // "Target requires 3 element(s) but source may have fewer" even though
  // the real data always has exactly 3 entries. `t.hero.title[0..2]` (the
  // only access pattern this component uses) types identically either way.
  title: readonly string[];
  primaryCta: string;
  secondaryCta: string;
  imageAlt: string;
  tagline: string;
  metrics: readonly HeroMetric[];
  chips: readonly string[];
  /** Short secondary personal note shown bottom-left in the hero (desktop
   * composition only), separate from `tagline` (bottom-right). No card,
   * no background — plain text, 2-3 lines max. */
  personalNote: string;
}

/** `HeroExperience.astro`'s full `Props.t` shape — the wordmark/nav/portrait/
 * title/metrics/chips/actions markup reads `t.nav` and `t.hero`; the
 * scroll-revealed compact sidebar additionally reads the social links out
 * of `t.contact` (reusing `ContactLinks`, not a new duplicate shape) so it
 * never has to hardcode text that already exists in `site.js`. */
export interface HeroExperienceContent {
  nav: HeroNavigationContent;
  hero: HeroContent;
  contact: Pick<ContactContent, "links">;
}

/** `SimpleNav.astro` (used on the `/servicios` and `/tools` sub-pages) only
 * reads 5 of the 7 nav keys — it renders its own "home" link via
 * `withBase("/")` rather than `t.nav.home`. */
export interface SimpleNavContent {
  nav: Pick<HeroNavigationContent, "about" | "contact" | "projects" | "services" | "tools">;
}

// ---- About ------------------------------------------------------------------
// Redesigned as an editorial composition: About Me / Beyond Software
// Engineering / Personal Background / Current Focus / Skills / Formación /
// Idiomas (in that order — see `AboutSection.astro`). Every sub-block below
// mirrors a real `site.js` key; nothing here is a text literal baked into
// the component.

/** A single skill entry: `[name, iconFileName]`. Icon is `null` when the
 * skill has no matching icon asset (see "Astro" in site.js). */
export type SkillItem = (string | null)[];

export interface SkillGroup {
  id: string;
  title: string;
  items: SkillItem[];
}

/** The section's own heading-card copy ("Sobre mí" / "About Me") plus the
 * opening bio paragraphs that sit directly under it. */
export interface AboutMeCopy {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
}

export interface BeyondSoftwareEngineeringCopy {
  heading: string;
  paragraphs: readonly string[];
  gfxButtonLabel: string;
}

export interface PersonalBackgroundCopy {
  heading: string;
  paragraphs: readonly string[];
  esportsButtonLabel: string;
  esportsHref: string;
  closingParagraph: string;
}

export interface CurrentFocusCopy {
  heading: string;
  items: readonly string[];
}

export interface FormacionEntry {
  text: string;
  href: string;
}

export interface FormacionCopy {
  title: string;
  entry: FormacionEntry;
}

export interface IdiomasCopy {
  title: string;
  items: readonly string[];
}

export interface AboutContent {
  aboutMe: AboutMeCopy;
  beyondSoftwareEngineering: BeyondSoftwareEngineeringCopy;
  personalBackground: PersonalBackgroundCopy;
  currentFocus: CurrentFocusCopy;
  designArchiveHref: string;
  skillsTitle: string;
  skillGroups: SkillGroup[];
  formacion: FormacionCopy;
  idiomas: IdiomasCopy;
}

export interface AboutSectionContent {
  about: AboutContent;
}

// ---- Projects -----------------------------------------------------------------

export interface ProjectItem {
  id: string;
  category: string;
  tags: string[];
  title: string;
  status: string;
}

export interface ProjectsContent {
  eyebrow: string;
  title: string;
  note: string;
  items: ProjectItem[];
}

export interface ProjectsSectionContent {
  projects: ProjectsContent;
}

// ---- Services -------------------------------------------------------------------
// `services` is read from three different components (`ServicesTeaser` on
// the home page, `ServicesPageContent` + `ServicesForm` on `/servicios`) —
// all three receive the identical `t.services` object, so they share one
// `ServicesSectionContent` Props alias instead of three narrower ones.

export interface ServiceArticle {
  title: string;
  text: string;
  tags: string[];
}

export interface ServicesFormFields {
  name: string;
  email: string;
  company: string;
  serviceType: string;
  serviceOptions: string[];
  budget: string;
  timeline: string;
  problem: string;
  message: string;
}

export interface ServicesFormCopy {
  title: string;
  submitIdle: string;
  submitLoading: string;
  submitSuccess: string;
  submitError: string;
  fields: ServicesFormFields;
}

export interface ServicesPage {
  eyebrow: string;
  title: string;
  intro: string;
  articles: ServiceArticle[];
  form: ServicesFormCopy;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[];
  cta: string;
  page: ServicesPage;
}

export interface ServicesSectionContent {
  services: ServicesContent;
}

// ---- Tools --------------------------------------------------------------------
// Same reasoning as Services: `ToolsTeaser` and `ToolsPageContent` both
// receive the identical `t.tools` object.

export interface ToolItem {
  title: string;
  status: string;
  text: string;
  tags: string[];
  cta: string;
  /** Relative path (no BASE_URL prefix — `ToolsPageContent.astro` applies
   * `withBase()` itself, same as every other internal link in this project)
   * to the tool's own page. Omitted for placeholder/"coming soon" tools
   * that don't have a real page yet — those render `cta` as inert text
   * instead of a link. */
  href?: string;
}

export interface ToolsPage {
  eyebrow: string;
  title: string;
  intro: string;
  items: ToolItem[];
}

export interface ToolsContent {
  eyebrow: string;
  title: string;
  intro: string;
  cta: string;
  page: ToolsPage;
}

export interface ToolsSectionContent {
  tools: ToolsContent;
}

// ---- Services & Tools (merged home-page section) ---------------------------
// A distinct, home-page-only presentation layered on top of the real
// `services`/`tools` data — it doesn't replace `ServicesContent`/
// `ToolsContent` (the `/servicios` and `/tools` sub-pages still use those
// directly), it's the copy for the merged two-column teaser section.

/** One run of text in the services column's description — `strong: true`
 * segments render as `<strong>`, matching the semantic emphasis the copy
 * calls for, without embedding raw HTML in the content file. */
export interface ServicesToolsTextSegment {
  text: string;
  strong?: boolean;
}

export interface ServicesToolsServicesColumn {
  description: readonly ServicesToolsTextSegment[];
  ctaLabel: string;
}

export interface ServicesToolsToolsColumn {
  description: string;
  ctaLabel: string;
}

export interface ServicesToolsContent {
  title: string;
  services: ServicesToolsServicesColumn;
  tools: ServicesToolsToolsColumn;
}

export interface ServicesToolsSectionContent {
  servicesTools: ServicesToolsContent;
  services: Pick<ServicesContent, "eyebrow">;
  tools: ToolsContent;
}

// ---- Contact --------------------------------------------------------------------
// `ContactSection` and `ContactForm` both receive the identical `t.contact`
// object.

export interface ContactLinks {
  email: string;
  github: string;
  githubLabel: string;
  linktree: string;
  /** Visible label for the "Redes Sociales" / "Social Links" card — reuses
   * the existing Linktree URL (`linktree`), just no longer surfaces the
   * word "Linktree" itself. */
  linktreeLabel: string;
  linkedinLabel: string;
  /** LinkedIn has no real URL anywhere in the content system — the card is
   * intentionally `aria-disabled`, not a real link, and shows this text as
   * an accessible tooltip on hover/focus instead of a permanent "Próximamente". */
  linkedinTooltip: string;
}

export interface ContactFormFields {
  name: string;
  email: string;
  reason: string;
  reasonOptions: string[];
  subject: string;
  message: string;
  preferredResponse: string;
  preferredResponseOptions: string[];
}

export interface ContactFormCopy {
  submitIdle: string;
  submitLoading: string;
  submitSuccess: string;
  submitError: string;
  fields: ContactFormFields;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  text: string;
  /** The line introducing the mailto fallback button below the form. */
  emailIntro: string;
  links: ContactLinks;
  form: ContactFormCopy;
}

export interface ContactSectionContent {
  contact: ContactContent;
}

// ---- Faq --------------------------------------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqContent {
  eyebrow: string;
  title: string;
  items: FaqItem[];
}

export interface FaqSectionContent {
  faq: FaqContent;
}

// ---- Video converter tool ---------------------------------------------------------
// Copy for the standalone `/tools/video-converter/` page and its React
// island (`src/components/VideoConverter/*`). Every user-facing string the
// tool needs lives here — same bilingual-content convention as the rest of
// this file — so the component itself never hardcodes text.

export interface VideoConverterDropzoneCopy {
  label: string;
  hint: string;
  button: string;
  dragActive: string;
}

export interface VideoConverterFileInfoCopy {
  name: string;
  size: string;
  duration: string;
  format: string;
  unknownDuration: string;
}

export interface VideoConverterOutputCopy {
  label: string;
  mp3: string;
  mp4: string;
  bitrateLabel: string;
  bitrate128: string;
  bitrate192: string;
  bitrate256: string;
}

export interface VideoConverterActionsCopy {
  convert: string;
  cancel: string;
  download: string;
  reset: string;
}

export interface VideoConverterStatusCopy {
  loadingEngine: string;
  converting: string;
  done: string;
  cancelled: string;
}

export interface VideoConverterErrorsCopy {
  tooLarge: string;
  tooLong: string;
  unsupportedFormat: string;
  emptyFile: string;
  metadataUnreadable: string;
  engineLoadFailed: string;
  conversionFailed: string;
  alreadyConverting: string;
}

/** Short, localized words used as a non-color state indicator next to
 * inline notices (see `.noticeMark` in `video-converter.module.css`) —
 * "No depender únicamente del color para comunicar estados". */
export interface VideoConverterLabelsCopy {
  error: string;
  warning: string;
}

export interface VideoConverterContent {
  seo: SeoContent;
  eyebrow: string;
  title: string;
  intro: string;
  privacyNotice: string;
  responsibleUseNotice: string;
  labels: VideoConverterLabelsCopy;
  dropzone: VideoConverterDropzoneCopy;
  fileInfo: VideoConverterFileInfoCopy;
  output: VideoConverterOutputCopy;
  actions: VideoConverterActionsCopy;
  status: VideoConverterStatusCopy;
  errors: VideoConverterErrorsCopy;
  memoryWarning: string;
}

/** `VideoConverterPageContent.astro`'s Props shape — mirrors the
 * `ToolsPageContent`/`ServicesPageContent` pattern of a narrow `Pick`-style
 * alias rather than the full `SiteContent`. */
export interface VideoConverterSectionContent {
  videoConverter: VideoConverterContent;
}

// ---- Closing ------------------------------------------------------------------------

export interface ClosingContent {
  text: string;
  signature: string;
}

export interface ClosingStatementContent {
  closing: ClosingContent;
}

// ---- Root -------------------------------------------------------------------------
// The full shape of `content` in `src/content/site.js`. `t={t}` on every
// component in `src/pages/*.astro` passes this whole object, so `SiteContent`
// satisfies (structurally) every one of the narrower `*Content` aliases
// above — it's the ground truth the others are `Pick`-style views of.

export interface SiteContent {
  seo: SeoContent;
  nav: NavigationContent;
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  services: ServicesContent;
  tools: ToolsContent;
  servicesTools: ServicesToolsContent;
  contact: ContactContent;
  faq: FaqContent;
  closing: ClosingContent;
  videoConverter: VideoConverterContent;
}

// ---- Locale root ------------------------------------------------------------
// `src/content/site.js` exports `content = { es: SiteContent, en: SiteContent }`
// — both locales share this exact shape, so every component-level `*Content`
// Props alias above stays valid for either one without change.
export interface LocalizedSiteContent {
  es: SiteContent;
  en: SiteContent;
}

export type Locale = keyof LocalizedSiteContent;
