# alex-build — kartstav.cz

Public site of KartSTAV. React 19 + TypeScript, Vite 8, prerendered with vite-react-ssg, react-router 6, SCSS modules, framer-motion. Site copy is Czech; code and comments English.

## Commands
- `npm run dev` — fetches portfolio from Supabase, builds image variants, starts Vite
- `npm run build` — same prebuild, then `tsc -b`, SSG build, sitemap
- `npm run lint`

Other Claude sessions may build into the shared `dist/` at the same time. For your own checks build into a private outDir: a temp config with `mergeConfig(base, { build: { outDir } })` passed via `vite-react-ssg build -c`. Before editing shared files (data, common components) check ListAgents and coordinate via SendMessage.

## Layout
- `src/pages/<Page>/<Section>/` — `.tsx` + `.module.scss` per section (MainPage, PortfolioPage, ProjectPage, ServicesPage, ContactPage, legal; `_dev` = scratch pages)
- `src/components/common` (SectionHead, Seo, Faq, CtaBanner, Breadcrumbs…), `layout` (Header, Footer), `ui`
- `src/data/*.data.ts` — content (services, faq, regions, statistics, workSteps, contacts); `src/data/portfolio/` — portfolio data and categories
- `scripts/` — fetch-portfolio, generate-image-variants, generate-sitemap
- `public/*.php` — mail and Telegram form handlers, `track.php` visit counter; their config files are server-side only
- `docs/google-seo/` — SEO knowledge base and plans (Russian); current runbook: `14-case-drafts.md`, `11-*`
- `plans.md` — promotion plan, partly superseded by `docs/google-seo`
- `3d/` — Blender pipeline for the apartment model; its hero integration lives on branch `hero-3d`

Generated, git-ignored: `src/assets/portfolio-remote`, `src/assets/generated`, `src/data/portfolio/portfolio.remote.json`, `dist`.

## Rules
- `<Seo>` renders through `<Head>`, which drops tags inside fragments — put them in directly.
- Never invent project facts (town, district, layout, duration, prices, reviews); they come from the owner. "Teplice" on the projects is a placeholder.
- Geography: Teplice and Ústecký kraj first, also other Czech cities; not "all of Czechia".
- No inline enquiry form on service or project pages; only /contacts plus the site-wide CTA banner.
- `main` deploys on push; changes reach it through a PR from `dev`.

## Screenshots
puppeteer-core + Edge (`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, `--enable-unsafe-swiftshader`), launched from the PowerShell tool with the sandbox off. Serve the built site with a small Node server mapping `/x` → `/x.html` (as .htaccess does). Before a full-page shot set every `img[loading=lazy]` to eager, or lower photos come out blank.
