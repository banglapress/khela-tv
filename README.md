# KhelaTV / খেলাটিভি

Independent Bangla **sports** news platform for [khelatv.com](https://khelatv.com).

This is **not** a fork of The Connect (`banglapress/connect-bangla-news`). The newsroom architecture was copied into a new repository and rebranded. It does **not** share The Connect production database, users, articles, RSS rows, Facebook Page, Vercel project, or secrets.

| | The Connect | KhelaTV |
|---|---|---|
| Domain | theconnect.news | khelatv.com |
| GitHub | `banglapress/connect-bangla-news` | `banglapress/khela-tv` |
| Desk | national news | sports only |
| Database | Connect Supabase | **new** KhelaTV Supabase |
| Facebook | Connect Page | **new** KhelaTV Page |

## Stack

- TanStack Start / React
- Supabase (Postgres, Auth, Storage, RLS)
- Vercel
- GitHub Actions (AI Desk cron)
- Gemini (research, article drafts, captions, cover images)
- Facebook Graph API (photo-card + caption, **human approval required**)

## Local development

```sh
git clone https://github.com/banglapress/khela-tv.git
cd khela-tv
cp .env.example .env.local
# fill KhelaTV secrets — never paste Connect credentials
bun install   # or npm i
bun run dev   # or npm run dev
```

Without Supabase env vars the public site falls back to sample sports articles so the UI can be reviewed. The editorial desk, RSS ingest, Gemini generation and Facebook publishing require a real KhelaTV Supabase project.

## 1. Database migrations

Create a **new** Supabase project for KhelaTV. Do not restore or clone The Connect database.

In the Supabase SQL Editor, run files in this order:

### A. Schema (folder `supabase/migrations/`)

Run every file in filename order:

1. `20260910195413_b84ab646-6ccc-4e76-9fad-102411d106be.sql` — roles, sports categories, articles
2. `20260910195445_84e63377-4e3b-45d7-9b91-b7268953d75c.sql`
3. `20260912124809_85cec0c6-5637-431b-9334-4a125cbc862d.sql`
4. `20260912233000_ensure_roles_and_reload.sql`
5. `20260913001500_public_news_images.sql`
6. `20260913040000_editorial_cms.sql`
7. `20260913040001_editorial_cms_rest.sql`
8. `20260914233000_discovery_candidates.sql`
9. `20260915013000_gemini_research.sql`
10. `20260915023000_social_publishing.sql`
11. `20260915033000_deep_research.sql`
12. `20260916090000_cover_images.sql`
13. `20260917150000_ai_automation_fixes.sql`
14. `20260918235000_auto_draft_queue_recovery.sql`
15. `20260919200000_editorial_features.sql`
16. `20260920010000_khelatv_sports_portal.sql` — sports children, placeholder local sources, card branding

Or use the numbered copies in `supabase/sql/` (`001` … `012`) in the same order. `012_khelatv_sports_portal.sql` is the KhelaTV-specific seed (safe to re-run).

After migrations:

- Confirm parent categories: ক্রিকেট, ফুটবল, টেনিস, অ্যাথলেটিক্স, বাস্কেটবল, হকি, অন্যান্য খেলা, বিশ্লেষণ
- Confirm children: বাংলাদেশ ক্রিকেট, আন্তর্জাতিক ক্রিকেট, আইপিএল, বিপিএল, বাংলাদেশ ফুটবল, আন্তর্জাতিক ফুটবল
- Create the first admin user in Supabase Auth, then grant `admin` in `user_roles`
- Create storage bucket `news-images` if the migration did not

## 2. Environment variables

See [`.env.example`](.env.example). Set the same keys in Vercel → Project → Settings → Environment Variables (Production + Preview).

Required for production:

| Variable | Where |
|---|---|
| `SUPABASE_URL` | Vercel + `.env.local` |
| `SUPABASE_PUBLISHABLE_KEY` (or `SUPABASE_ANON_KEY`) | Vercel + `.env.local` |
| `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Vercel (server only) |
| `VITE_SUPABASE_URL` | Vercel (same URL, public) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel (same publishable key, public) |
| `SITE_URL` | `https://khelatv.com` |
| `GEMINI_API_KEY` | Vercel (server only) |
| `META_ACCESS_TOKEN` | Vercel (server only) |
| `META_PAGE_ID` | Vercel (server only) |
| `DESK_CRON_SECRET` | Vercel **and** GitHub Actions secret |

Never commit `.env`, `.env.local`, or Connect production values.

## 3. Gemini API key

Create a **new** Google AI Studio / Gemini key for KhelaTV (do not reuse Connect's key).

Set:

```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
GEMINI_COVER_PROMPT_MODEL=gemini-3.5-flash-lite
```

Used by:

- multi-source research
- Bangla sports article generation
- feature / explainer briefs
- Facebook captions
- cover-image prompts + generation

Sports newsroom rules are in `src/lib/desk/sports-story.ts`. The model must not invent scores, names, injuries, transfers or results.

## 4. Facebook credentials

Create a **new** Facebook Page for KhelaTV and a Graph API Page access token. Do not use The Connect Page.

Set:

```
META_ACCESS_TOKEN=
META_PAGE_ID=
SITE_URL=https://khelatv.com
```

Publishing is approval-based: the desk generates a photo-card and caption, a human reviews them, then publishes. See `docs/social-publishing.md`.

## 5. Vercel

1. Import `banglapress/khela-tv` as a **new** Vercel project (do not attach it to The Connect project).
2. Framework: Vite / TanStack Start (build command `bun run build` or `npm run build`).
3. Root directory: repository root.
4. Add every env var from `.env.example` that you actually use.
5. Production domain: `khelatv.com` (and `www` if needed).
6. `vercel.json` already registers a **daily** backup cron at `/api/desk-auto-draft`. Hobby plans only allow one cron/day — GitHub Actions is the real 15-minute scheduler.

## 6. Cron / AI Desk

High-frequency scheduler: `.github/workflows/desk-auto-draft.yml`

- every 15 minutes (UTC minutes 7, 22, 37, 52)
- step 1: RSS ingest
- step 2: four parallel workers, one story each
- creates **drafts only** — never auto-publishes to the site or Facebook

GitHub → Settings → Secrets and variables → Actions:

```
DESK_CRON_SECRET=<same value as Vercel DESK_CRON_SECRET>
```

Details: `docs/AI_DESK_AUTOMATION.md`.

## RSS sources

Verified and seeded **active**:

| Source | Feed | Category |
|---|---|---|
| BBC Sport | `https://feeds.bbci.co.uk/sport/rss.xml` | other-sports |
| BBC Sport Cricket | `https://feeds.bbci.co.uk/sport/cricket/rss.xml` | cricket |
| BBC Sport Football | `https://feeds.bbci.co.uk/sport/football/rss.xml` | football |
| BBC Sport Tennis | `https://feeds.bbci.co.uk/sport/tennis/rss.xml` | tennis |
| BBC Sport Athletics | `https://feeds.bbci.co.uk/sport/athletics/rss.xml` | athletics |

Placeholder Bangladeshi / specialist sources are inserted **inactive** (`rss_url` null). You must supply the official RSS URL later, then set `active = true` in Admin → Sources:

- প্রথম আলো খেলা
- দি ডেইলি স্টার স্পোর্টস
- টি স্পোর্টস
- বাংলাদেশ ক্রিকেট বোর্ড
- ESPN Cricinfo

Do not invent feed URLs.

## Manual work still required

1. Create the KhelaTV Supabase project and run migrations
2. Create the first admin user
3. Create a new Vercel project and attach `khelatv.com`
4. Fill all environment variables
5. Create a Gemini key for this site
6. Create a Facebook Page + token for this site
7. Set `DESK_CRON_SECRET` in Vercel and GitHub
8. Paste real RSS URLs for Bangladeshi sources
9. DNS for khelatv.com → Vercel

## Architecture (reused, sports-scoped)

RSS ingest → source manager → story clustering → related-coverage discovery → multi-source research → Gemini article draft → auto-draft queue → cover image → Facebook photo-card + caption → **human approval** → publish.

Feature / explainer path is unchanged: research brief → editor picks an angle → then generate.

## Brand

- Name: KhelaTV / খেলাটিভি
- Palette: pitch green `#1F6B45` / ink `#0F3D2E` / paper `#F4F1EA`
- Logo: `/logo.svg`
- Default category: cricket
