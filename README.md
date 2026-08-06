# KartStav — web

Marketingový web stavební firmy **KartStav Development s.r.o.** (rekonstrukce
bytů, kuchyně, koupelny, fasády). React + TypeScript SPA, která se při buildu
**předrenderuje do statického HTML** (SSG) kvůli SEO, a nasazuje se na
PHP/Apache hosting (Forpsi).

## Tech stack

- **React 19** + **TypeScript**, **Vite 8**
- **vite-react-ssg** — statický prerender všech routes
- **react-router 7** (data routes)
- **SCSS moduly**
- **framer-motion** (animace), **react-hook-form** (formulář)
- **@emailjs/browser** (e-mail) + PHP endpoint (Telegram)
- **yet-another-react-lightbox**, **lucide-react** (ikony)

## Požadavky

- Node.js **22+**
- npm

## Rychlý start

```bash
npm install          # nainstaluje závislosti (+ postinstall patch, viz níže)
npm run dev          # dev server (CSR) na http://localhost:5173
npm run build        # produkční build + prerender do dist/
npm run preview      # náhled produkčního buildu
```

> **Pozn.:** prerender (statické HTML) vznikne až v `npm run build`.
> V `npm run dev` běží klasické CSR (prázdný `#root` do načtení JS) — to je v pořádku.

## Proměnné prostředí

Lokálně: zkopíruj `.env.example` → **`.env.local`** (je v `.gitignore`) a doplň
klíče EmailJS (pro odesílání e-mailu z formuláře při lokálním vývoji):

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Pro produkci se proměnné neberou ze souborů, ale z **GitHub Secrets** (viz Nasazení).

## Skripty

| Skript | Popis |
|---|---|
| `npm run dev` | Vývojový server (CSR) |
| `npm run build` | `tsc` + `vite-react-ssg build` → `dist/` |
| `npm run preview` | Náhled `dist/` |
| `npm run lint` | ESLint |
| `npm run optimize:images` | Zmenší/zkomprimuje fotky v `src/assets/portfolio/**` (sharp). Spustit po přidání nových fotek. |

## Kontaktní formulář

Odesílá poptávku **paralelně do dvou kanálů** (úspěch = projde aspoň jeden):

1. **E-mail** přes EmailJS (klientsky, klíče `VITE_EMAILJS_*`).
2. **Telegram** přes PHP endpoint `public/send-telegram.php`, který čte token
   z `public/telegram-config.php` (mimo git). Token tak nikdy není v prohlížeči.

Lokálně Telegram nefunguje (není PHP) — e-mail ano.

## Nasazení (Forpsi + GitHub Actions)

Push do větve **`main`** spustí workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
`npm ci` → vygeneruje `telegram-config.php` ze secrets → `npm run build` →
nahraje `dist/` přes FTP do `/www/` na Forpsi.

**Vývoj probíhá ve `dev`**, release = merge `dev` → `main`.

Potřebné **GitHub Secrets** (Settings → Secrets and variables → Actions):

| Secret | Popis |
|---|---|
| `FTP_SERVER` | FTP host (`ftpx.forpsi.com`) |
| `FTP_USERNAME` | FTP login (`www.kartstav.cz`) |
| `FTP_PASSWORD` | FTP heslo |
| `FTP_SERVER_DIR` | cílová složka (`/www/`) |
| `TELEGRAM_BOT_TOKEN` | token bota (@BotFather) |
| `TELEGRAM_CHAT_ID` | ID chatu/skupiny |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS |

Bot musí být členem cílové skupiny/kanálu (u kanálu jako admin s právem postovat).

## Poznámky pro vývojáře

- **react-router 7 shim:** `vite-react-ssg` interně importuje `react-router-dom/server.js`,
  který v7 už neexistuje. `postinstall` skript
  [`scripts/patch-react-router.mjs`](scripts/patch-react-router.mjs) doplní reexport
  z `react-router`. `.npmrc` nastavuje `legacy-peer-deps=true` (kvůli peer rozsahu pluginu).
- **SEO/meta** řeší per-route komponenta [`Seo`](src/components/common/Seo/Seo.tsx)
  přes `<Head>` z vite-react-ssg; statické údaje jsou v [`src/config/company.ts`](src/config/company.ts).
- **Routing na hostingu** zajišťuje [`public/.htaccess`](public/.htaccess) (čisté URL + SPA fallback).
