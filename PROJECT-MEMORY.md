# HT Logistics Website — Project Memory & Handoff

Written 10 September 2026 by Claude for Sanjay Gunabalan before a laptop reset.
Purpose: everything Claude knew about this project, so a fresh machine and a fresh
Claude session can pick up exactly where we left off. Give this file to Claude in the
first message of the next session (or keep it in the project root; it can also be
renamed `CLAUDE.md` so it loads automatically).

---

## 0. BEFORE YOU WIPE THE LAPTOP — back these up

This folder is **NOT a git repository**. Nothing is pushed anywhere. If the folder is
lost, the whole site is lost. Copy the entire `ht-logistics-recreation` folder to an
external drive or cloud storage. In particular these are irreplaceable:

| What | Path | Why it matters |
|---|---|---|
| Whole project | `ht-logistics-recreation/` | source code, all pages, all styles |
| Secrets | `.env` | session secret and Supabase keys (gitignored) |
| CMS data | Supabase project: tables `posts`, `enquiries`, Storage bucket `uploads` | blog posts, contact-form enquiries and uploaded images; schema in `supabase/schema.sql` |
| Client profile | `HT LOGISTICS SOLUTIONS - COMPANY PROFILE 2.pdf` (34 MB) | source of truth for every fact on the site |
| Proposal | `HT LOGISTIC FINAL PROPOSAL.pdf` | signed scope (was outside this folder; find and back it up too) |
| Generated images | all `*.jpeg` in root + `.source-backups/` | the Nano Banana / Gemini originals (processed copies live in `client/src/assets/`) |
| Claude memory | `~/.claude/projects/-Users-sanjaygunabalan2626gmail-com-Documents-ht-logistics-recreation/` | session transcripts + `memory/` folder (optional, this file supersedes it) |

`node_modules/` and `dist/` can be skipped; they rebuild with `pnpm install && pnpm build`.

---

## 1. Who / what / why

- **You**: Sanjay Gunabalan, CEO & Founder of **Aurexis Solution** (aurexissolution.com), a
  business-systems/technology agency. "Aurexis Presence" is the web/content/SEO sub-offering.
  Email used with Claude: aurexissolution@gmail.com.
- **Client**: **HT Logistics Solutions Sdn Bhd** (Co. No. 201101019426 / 1495599-H),
  Malaysian logistics company, established 2023, HQ Penang. Site: htlogisticssolutions.com.
- **Engagement**: signed proposal **Ref AUR-PRES-HTL-2026-001**, **RM2,000**, 50/50 deposit
  split, 7–12 working days, **two consolidated revision rounds**, 45-day post-launch support.
  Dated Aug 2026.
- **Key decision (4 Sep 2026)**: the client's old WordPress site is being **fully replaced**
  by this hand-coded React/Express app. This repo IS the deliverable, not a mockup.
  Sanjay's words: "HT Logistics' previous website was a WordPress template, so we are
  changing it to codebase so everything is new."

### Proposal scope (the 6 items)
1. **Services page enhancement** — clear hierarchy covering 14 service areas (5 core + 9 specialised).
2. **Blog / Insights platform** — public listing, article template, categories, related
   articles, enquiry CTAs, **plus a backend CMS** (admin login, create/edit/draft/publish,
   featured image upload, categories/tags, author/date, SEO title + meta fields).
3. **1 SEO-focused launch article** (800–1300 words) published via the new blog.
4. **Social content**: 2 LinkedIn posts + 2 IG/TikTok carousel concepts (copy + creative direction).
5. **Foundational SEO** (titles, metas, headings, alt text, internal links) + **AIO/AEO**
   (structured data, consistent NAP, answer-style content). No ranking guarantees.
6. Implementation into the client's environment (needs hosting/domain access from client).

**Out of scope** (must be quoted separately + approved in writing): ongoing marketing, paid
ads, more than 1 article, more than the listed social pieces. A separate marketing proposal
comes after this project. Note: the full visual redesign we ended up doing went well beyond
"Services + Blog"; Sanjay chose to do it anyway as part of replacing WordPress.

### Sanjay's standing rules (learned over the sessions)
- **Never invent facts, names, addresses, or legal text.** Everything on the site must
  trace to the company profile PDF or figures already on the old site.
- **No AI-generated faces** on the site (a Manpower Supply hero with five visible AI faces
  was rejected and regenerated; the founder section uses a placeholder, no AI portrait).
- Wants **"premium", non-templatey design**, no two sections looking alike, no big empty
  white areas, compact section heights. Frequently says "too big, shrink it".
- Brand: red **#ee1c25**, charcoal **#252525**, warm white. No gradients-for-the-sake-of-it,
  no purple, no glassmorphism.
- When Claude overreaches (rewrites a section's structure when asked only for spacing),
  he asks for a revert. Change only what is asked.
- Images: Sanjay generates them himself with **Nano Banana / Gemini** from prompts Claude
  writes. Prompts must include: 16:9, photorealistic, cool neutral tones with warm
  highlights, subject right two-thirds / left third darker, no text/logos/signage/faces,
  plain unmarked cartons. He then adds the HT Logistics branding himself.
- Footer must say **"Developed by Aurexis Solution"** (linked to aurexissolution.com). Done.

---

## 2. Tech stack & how to run

- **Frontend**: React 19, Vite 7, TypeScript 5.6, wouter (routing, patched
  `patches/wouter@3.7.1.patch`), Tailwind 4 (mostly hand-written CSS in
  `client/src/index.css`), shadcn/ui components in `client/src/components/ui/`,
  lucide-react icons, framer-motion, sonner toasts, zod.
- **Backend**: Express 4 + multer, deployed as a Vercel function (`api/index.js`). Data lives in
  Supabase (Postgres + Storage). Admin sign-in uses Supabase Auth; the session is an HMAC-signed
  cookie (see `server/lib/auth.ts`), so nothing is kept in server memory.
- **Package manager**: pnpm (v10). Node 24 was in use via nvm.
- Originally scaffolded by **Manus** (leftover `vite-plugin-manus-runtime`, `.manus-logs/`,
  `client/public/__manus__/`, `ManusDialog.tsx`; harmless, can be removed later).

```bash
pnpm install
cp .env.example .env          # then fill in (see below)
pnpm dev                      # Vite client on :3000 + API server on :5050
pnpm check                    # tsc --noEmit
pnpm build                    # vite build + esbuild server -> dist/
pnpm start                    # NODE_ENV=production node dist/server.js (port 3000)
```

`.env` keys: `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, optional `PORT`, `VITE_ANALYTICS_ENDPOINT`,
`VITE_ANALYTICS_WEBSITE_ID` (Umami). Supabase values are under Settings > API.

### Admin users (Supabase Auth)
An admin is a Supabase Auth user whose `app_metadata.role` is `admin`. Being a Supabase user is
not enough, so anyone who signs up by some other route still cannot get in. To add one:
1. Authentication > Users > Add user > Create new user (email + password, tick Auto Confirm User).
2. In the SQL editor run this, with the real email in lowercase:
```sql
update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb where email = 'name@example.com';
```
3. Authentication > Sign In / Providers: turn off "Allow new users to sign up".
To remove an admin, delete the user. Their existing cookie stays valid until it expires (8 hours).
Paste SQL into the Supabase editor without comments: apostrophes inside comments broke it once.

### Project layout
```
client/src/
  App.tsx                 routes (see §3)
  index.css               all site styling (large)
  pages/SitePages.tsx     Home, About, Services, Contact, Privacy, Terms, 404, Layout, Header, Footer
  pages/ServiceDetailPage.tsx   template for all 14 service pages
  pages/BlogPages.tsx     /latest-news/ list + article page
  pages/AdminPages.tsx    /admin/ login, post list/editor, enquiry inbox
  data/services.ts        attaches photos to the shared catalogue
  data/legal.ts           Privacy Policy + Terms text
  lib/api.ts, lib/seo.ts  fetch helpers, useSeo hook
  components/Map.tsx      Google Maps embed on Contact
  assets/                 all processed site images
client/public/            logo.png, favicon.png, og-default.jpg, llms.txt
shared/
  services-catalog.ts     14 services: copy, capabilities, FAQs, cross-links (source of truth)
  seo.ts                  SITE constants (NAP), per-page titles/descriptions, JSON-LD builders
  blog.ts, enquiry.ts     zod schemas + types
server/
  index.ts                Express app, session, static, SEO shell injection, 404s
  routes/blog.ts          public posts API + admin CRUD + upload
  routes/enquiries.ts     contact form POST (rate-limited, honeypot) + admin inbox
  lib/postsStore.ts, enquiriesStore.ts, uploads.ts, auth.ts, supabase.ts, seo.ts
supabase/schema.sql       tables + storage bucket + seed posts (run once in the SQL editor)
ideas.md                  original WordPress-replication spec (historical)
reference-assets.txt      original WordPress image URLs (historical)
```

---

## 3. What is built (state on 10 Sep 2026)

All routes typecheck and build. Everything below was verified working on localhost.

### Public routes
| Route | Status |
|---|---|
| `/` Home | Done. Hero carousel (3 slides, 6 s), About teaser + certifications, Problem-statement band (photo bg), Services strip (5 core cards), Stats count-up (client satisfaction, workers, vehicles, branches, capacity), Values + quote, FAQ (photo bg), Latest News, Contact CTA band |
| `/about-us/` | Done. Custom hero, Who-we-are intro with hexagon watermark, Vision/Mission grid, Founder section (**placeholder**), Facilities (3 sites), Workflow, Commitment, Why-choose ledger, Industries strip (8 generated images), distinct About CTA |
| `/services/` | Done. Full-bleed hero, intro, 5 core feature rows (alternating), charcoal stats band with dot-grid + ring, "Specialised Capabilities" white sheet with red top rule (9 items in groups), grey workflow, 3-image CTA (Penang / Prai / Kulim city shots) |
| 14 service pages `/<slug>/` | Done. Own 1920×1080 hero each, "What we handle" charcoal band, 4 FAQs each, "Works well with" cross-links, CTA. Slugs: warehouse-storage, kitting, packaging-labelling, transportation, manpower-supply, supply-chain-solutions, nationwide-ftl-ltl-transport, cross-border-trucking, last-mile-delivery, import-export-customs-support, pick-pack-operations, value-added-services, warehouse-management-system-wms, transport-management-system-tms |
| `/latest-news/` | Done. Photo hero with featured post, list rows, category filter |
| `/<post-slug>/` | Done. Article template, related articles, enquiry CTA, uses stored SEO fields |
| `/contact-us/` | Done. Photo hero, contact block + working form (6 fields, honeypot, rate limit), 3 locations, certifications row, contact FAQ, Google Maps embed |
| `/privacy-policy/`, `/terms-conditions/` | Drafted (PDPA 2010), sticky contents list, dated 9 Sep 2026. **Client must approve.** |
| `/admin/` | Done. Login (5 attempts / 10 min lockout), posts list, editor (title, slug, excerpt, content, featured image upload, category, tags, author, status draft/published, SEO title, meta description), enquiry inbox (unread count, mark read, delete). noindex. |
| 404 | Real HTTP 404 with styled page |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | Done. Sitemap is generated live (pages + services + published posts) |

### API
- Public: `GET /api/posts`, `GET /api/posts/:slug`, `GET /api/categories`, `POST /api/enquiries`
- Admin: `POST /api/admin/login|logout`, `GET /api/admin/session`,
  `GET/POST /api/admin/posts`, `GET/PUT/DELETE /api/admin/posts/:id`, `POST /api/admin/upload`,
  `GET /api/enquiries`, `PATCH /api/enquiries/:id/read`, `DELETE /api/enquiries/:id`
- Uploads served from `/uploads/`.

### SEO / AIO (done 9 Sep 2026)
- Per-page title, description, canonical, Open Graph, Twitter, JSON-LD injected
  **server-side** into index.html and updated client-side on navigation.
- Schema: Organization + LocalBusiness + WebSite (home), Service + BreadcrumbList + FAQPage
  (service pages), NewsArticle (posts), BreadcrumbList (static pages).
- `/llms.txt` with verified company facts. Hashed assets cached 1 year, index.html never.
- Analytics script only renders when Umami env vars are set (was previously a broken tag).

### Content currently in the CMS
Two posts migrated from the old WordPress site (both published):
1. "Launches Real-Time Tracking System for Enhanced Delivery Transparency" (Company News, 21 Jul 2025)
2. "Sustainable Logistics: Introduces Eco-Friendly Packaging Initiative" (Sustainability, 13 Jun 2025)

Zero enquiries stored.

### Verified company facts used on the site (from the profile PDF)
- Registered address: **Plot 3, Hujung Perusahaan 1, 13600 Perai, Pulau Pinang** (profile p.16;
  an old "Perusahaan 2" map link was wrong and is fixed).
- Phone 04-399 7120, mobile/WhatsApp 012-487 9121, email admin@htlogisticssolutions.com.
- Hours Mon–Sat 8.30am–5pm.
- Facilities: Science Park, Bukit Minyak (17,400 m², 4,000 pallets, marked HQ in profile);
  Prai Industrial Park (8,500 m², 6,000 pallets); Kulim Industrial Park, Kedah (4,000 m², 4,000 pallets).
- Scale: 50,000 m² capacity, 5 warehouse branches, 20 land vehicles, 200+ workers.
- Certifications: ISO 9001, ISO 14001, ISO 45001, TAPA, GDPMD.
- Industries: manufacturing, automotive, retail, medical, electronics, FMCG, e-commerce, industrial.
- Transport planning process (profile p.9) is used on the four transport service pages.

---

## 4. Timeline of what we did

| Date (2026) | Work |
|---|---|
| 4 Sep | Read proposal + repo. Decided repo is the real deliverable. Built Blog platform + Admin CMS (file-based, single admin, bcrypt + sessions). Built Services hierarchy and 14 service pages (first version). |
| 5 Sep | Homepage redesign began: hero image (Gemini), About teaser, Problem-statement section (moved after About teaser, photo bg). Company profile PDF supplied. |
| 6 Sep | Services strip with branded images (5 core cards), Values section, added FAQ section with photo bg, News section, CTA. |
| 7 Sep | CTA band with generated image, footer redesign + "Developed by Aurexis Solution". Full About page build-out (founder, facilities, workflow, commitment, why-choose, industries with 8 generated images, distinct About CTA). Services page hero + section rework. |
| 8 Sep | Services page: stats band fixes, Specialised Capabilities compacted, white sheet + red rule, grey workflow, 3-city CTA images. Latest News page redesign with hero image. Contact page redesign (several rejected drafts before final), contact hero image. |
| 9 Sep | Core 5 service detail pages with own heroes, FAQs from profile, "What we handle", cross-links, CTA redesign. Then the 9 specialised pages with 9 unique generated heroes. Full SEO/AIO audit and implementation. Privacy Policy + Terms drafted. Memory notes saved. |
| 10 Sep | This handoff file. |

---

## 5. What is NOT done yet (next steps, in order)

### Proposal deliverables still open
1. **SEO launch article** (item 3): 800–1300 words, to be written and published through
   `/admin/`. Topic not yet chosen. Should target a real query relevant to Penang/Kulim
   warehousing or bonded storage and link internally to service pages.
2. **Social content** (item 4): 2 LinkedIn posts + 2 IG/TikTok carousel concepts. Not started.
3. **Deployment** (item 6): live on Vercel (project `htlogisticssolutions`, auto-deploys from GitHub
   `HtLogistics/HTMainWebsite` on `main`) with Supabase for data. DNS for htlogisticssolutions.com
   is pointed at Vercel. Vercel env vars: `SESSION_SECRET` and the three `SUPABASE_*` keys. An admin
   user still has to be created (see Admin users above).
4. **Client revision rounds**: none of the two revision rounds has formally happened yet.
   The site has not been shown to HT Logistics as a whole.

### Items that need answers from HT Logistics (never invent these)
- Founder: real name, title, photo, quote (About page currently shows a placeholder).
- Street addresses for the Science Park (Bukit Minyak) and Kulim facilities; contact page
  says "address on request" for those.
- Which site is officially HQ: profile network page says Science Park, but registered
  address is Perai.
- Approve Privacy Policy and Terms text (esp. retention and partner-sharing sentences).
- Confirm enquiry email admin@htlogisticssolutions.com and production domain.
- Decide whether contact enquiries should also be emailed (currently only stored in the
  admin inbox; would need SMTP or a transactional email service).
- Whether they want analytics (Umami env vars) at all.

### Technical housekeeping (nice to have)
- Put the project in **git** and push to a private remote (GitHub) — first thing on the new machine.
- Remove Manus leftovers (`vite-plugin-manus-runtime`, `.manus-logs`, `__manus__`, `ManusDialog.tsx`, `jsxLocPlugin`).
- Delete the loose `*.jpeg` originals in the project root once backed up (processed copies are in `client/src/assets/`).
- `tsconfig.json` had a deprecated `baseUrl` warning earlier; it was removed, paths use `@/*` and `@shared/*`.
- Consider image optimisation (WebP/AVIF) for the many 1920×1080 hero JPEGs before launch.
- Consider SQLite instead of JSON files if the client wants multi-user or more posts (low priority for RM2,000 scope).
- Handover doc for the client: how to log in to `/admin/`, write a post, upload an image, read enquiries.

### After this project
- Separate ongoing marketing proposal to HT Logistics (per the signed proposal's terms).

---

## 6. How to restart with Claude on the new machine

1. Restore the folder, run `pnpm install`, recreate `.env` if lost, `pnpm dev`.
2. `git init` and push to a private repo.
3. Start Claude Code in the project folder and say:
   "Read PROJECT-MEMORY.md, this is the HT Logistics project for Aurexis. Continue from
   section 5." Optionally rename this file to `CLAUDE.md` so it loads automatically.
4. Reconnect tools that were used: Nano Banana MCP (image generation), Playwright MCP
   (screenshots of localhost), Notion and Google Drive connectors were available but unused.
