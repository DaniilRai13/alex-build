# Деплой SPA — фолбэк маршрутизации

Проект — SPA на Vite + React с `BrowserRouter`. Роутинг происходит в браузере,
но сервер об этом не знает. При **прямом заходе** на `/services`, `/portfolio`
и т.д. (или при обновлении страницы F5) хостинг ищет физический файл `services`,
не находит и отдаёт **404**. Чтобы этого не было, сервер должен на любой
неизвестный путь отдавать `index.html` со статусом **200**, а дальше маршрут
разбирает React Router.

Ниже — настройка под каждый хостинг. Нужен только один вариант, соответствующий
твоему хостингу. Лишние файлы можно оставить: другие хостинги их игнорируют.

## Vercel

Файл `vercel.json` в корне проекта (уже добавлен):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Ничего дополнительно делать не нужно — Vercel подхватит его при деплое.

## Netlify / Cloudflare Pages

Файл `public/_redirects` (уже добавлен). Vite копирует его в `dist/` при сборке:

```
/*    /index.html   200
```

## Свой сервер — nginx

В блоке `server { ... }` для сайта:

```nginx
root /var/www/alex-build/dist;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}
```

После правки: `sudo nginx -t && sudo systemctl reload nginx`.

## Свой сервер — Apache

Файл `.htaccess` в корне раздачи (`dist/`). Чтобы он попадал в сборку,
положи его в `public/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## GitHub Pages

GitHub Pages не поддерживает серверные редиректы. Приём: отдавать копию
`index.html` как `404.html`. Добавь в `package.json` (кроссплатформенно
через Node, чтобы работало и на Windows):

```json
"scripts": {
  "build": "tsc -b && vite build",
  "postbuild": "node -e \"require('fs').copyFileSync('dist/index.html','dist/404.html')\""
}
```

Если сайт публикуется по адресу `username.github.io/имя-репозитория/` (project
page), дополнительно нужно указать базовый путь:

- в `vite.config.ts` → `base: '/имя-репозитория/'`;
- в `main.tsx` у `<BrowserRouter basename="/имя-репозитория">`.

Для собственного домена или `username.github.io` (user page) `base` не нужен.

> Замечание: на GitHub Pages страница по неизвестному пути всё равно отдаётся со
> статусом 404 (хоть и с рабочим приложением). Для SEO-проекта лучше Vercel,
> Netlify или Cloudflare Pages — там фолбэк отдаёт честный 200.
