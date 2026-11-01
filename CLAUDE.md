# alex-build — kartstav.cz

Public site of KartSTAV. React 19 + TypeScript, Vite 8, prerendered with vite-react-ssg, react-router 6, SCSS modules, framer-motion. Site copy is Czech; code and comments English.

## Commands
- `npm run dev` — builds image variants, starts Vite
- `npm run build` — same prebuild, then `tsc -b`, SSG build, sitemap, `dist/portfolio.json` for the admin
- `npm run lint`

Other Claude sessions may build into the shared `dist/` at the same time. For your own checks build into a private outDir: a temp config with `mergeConfig(base, { build: { outDir } })` passed via `vite-react-ssg build -c`. Before editing shared files (data, common components) check ListAgents and coordinate via SendMessage.

## Layout
- `src/pages/<Page>/<Section>/` — `.tsx` + `.module.scss` per section (MainPage, PortfolioPage, ProjectPage, ServicesPage, ContactPage, legal; `_dev` = scratch pages)
- `src/components/common` (SectionHead, Seo, Faq, CtaBanner, Breadcrumbs…), `layout` (Header, Footer), `ui`
- `src/data/*.data.ts` — content (services, faq, regions, statistics, workSteps, contacts); `src/data/portfolio/` — `projects.json` (the portfolio itself), categories, `portfolio.data.ts`
- `scripts/` — generate-image-variants, generate-sitemap, export-portfolio, optimize-portfolio-images
- `public/photos/<slug>/` — portfolio photos (originals, in git)
- `public/*.php` — mail and Telegram form handlers, `track.php` visit counter; their config files are server-side only
- `docs/google-seo/` — SEO knowledge base and plans (Russian); current runbook: `14-case-drafts.md`, `11-*`
- `plans.md` — promotion plan, partly superseded by `docs/google-seo`
- `3d/` — Blender pipeline for the apartment model; its hero integration lives on branch `hero-3d`

Generated, git-ignored: `src/assets/generated`, `dist`.

## Portfolio (since 1 Nov 2026 in the repo, not Supabase)
The owner sends new projects (photos + town, m², year, what was done) and they are added here by hand; the admin only lists what the live site publishes in `/portfolio.json`. To add a project:
1. Photos into `public/photos/<slug>/`; `npm run optimize:images` compresses originals over ~1 MB.
2. An entry in `projects.json` (same shape as the others): `preview` and `images` are file names, `photos` holds caption + phase (`before`/`during`/`after`) per file, `category` is one of `portfolioCategories.data.ts`, `updatedAt` = today. Order in the file = order on the site.
3. `npm run images:variants`, then check the project page and /portfolio.
Edit an existing project the same way and bump its `updatedAt` (it drives the sitemap's lastmod).

## Rules
- `<Seo>` renders through `<Head>`, which drops tags inside fragments — put them in directly.
- Never invent project facts (town, district, layout, duration, prices, reviews); they come from the owner. Towns given 1 Nov; "Teplice" is still a placeholder on rekonstrukce-paneloveho-bytu, rekonstrukce-bytu-moderni-kuchyne and the facade.
- Geography: Teplice and Ústecký kraj first, also other Czech cities; not "all of Czechia".
- No inline enquiry form on service or project pages; only /contacts plus the site-wide CTA banner.
- `main` deploys on push; changes reach it through a PR from `dev`.

## Screenshots
puppeteer-core + Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, `--enable-unsafe-swiftshader`), launched from the PowerShell tool with the sandbox off. Serve the built site with a small Node server mapping `/x` → `/x.html` (as .htaccess does). Before a full-page shot set every `img[loading=lazy]` to eager, or lower photos come out blank.
