# Разбор kartstav.cz на 30.10.2026

## Как мерили

- **Сборка** — свежий `npm run build` ветки `dev` (`ac62077`). Портфолио скачано из
  Supabase в момент сборки.
- **Живой сайт** — `curl` по всем адресам: коды ответа, переадресации, canonical, карта
  сайта.
- **Слова** — по тексту внутри `<main>`, без шапки и подвала. «Свой текст» — то же самое
  без FAQ, хлебных крошек, форм и общего баннера «Máte projekt?». Это и есть то, что
  страница говорит именно о своём предмете.
- **Search Console** — по скриншотам отчёта «Индексирование страниц» (см.
  [08-measurement.md](08-measurement.md)).

Скрипт замера в репозиторий не добавлен. Чтобы повторить: собрать сайт и посчитать
слова в `<main>` каждого `dist/**/*.html`. Если замер понадобится регулярно, его стоит
оформить как `scripts/seo-report.mjs`.

---

## Что в порядке (не переделывать)

- Пререндер: весь текст в HTML с первого байта.
- `title`, `description`, `canonical`, Open Graph на каждой странице; длины в норме.
- Карта сайта строится из собранных страниц, `noindex` исключается, `lastmod` убран.
- Настоящий 404, переадресации в один шаг, `www` и слеш нормализованы, HTTPS + HSTS.
- Микроразметка: организация из одного конфига, `Service`, `CreativeWork`,
  `BreadcrumbList`, `FAQPage`, `ItemList`, `WebSite`.
- Адаптивные WebP, ленивая загрузка, приоритет для LCP-картинки.
- Все фото портфолио — настоящие `<img>` в HTML.
- FAQ на главной и на каждой услуге.
- IČO в подвале и на контактах.

Полный технический чек-лист — [02-technical.md](02-technical.md).

---

## Страницы в цифрах

| Страница | Title, симв. | H1 | Слов в `<main>` | Свой текст |
|---|--:|---|--:|--:|
| `/` | 54 | Vaše první volba pro kompletní stavby a rekonstrukce. | 506 | 252 |
| `/services` | 52 | Kompletní rekonstrukce bytů a domů | 124 | 99 |
| `/services/kompletni-rekonstrukce` | 45 | Kompletní rekonstrukce | 377 | 165 |
| `/services/kosmeticke-upravy` | 54 | Kosmetické úpravy | 379 | 154 |
| `/services/stavebni-a-remeslne-prace` | 53 | Stavební & řemeslné práce | 317 | 112 |
| `/services/navrhy-a-vizualizace` | 43 | Návrhy & vizualizace | 319 | 100 |
| `/portfolio` | 48 | Portfolio projektů | 88 | **68** |
| `/portfolio/<проект>` × 9 | 38–46 | название проекта | 93–133 | **53–94** |
| `/contacts` | 46 | Kontaktujte nás | 65 | 64 |
| `/privacy` | 40 | Zásady ochrany osobních údajů | 356 | 335 |
| `/terms` | 44 | Podmínky použití webových stránek | 291 | 270 |

По собственному тексту политика конфиденциальности (335) и условия использования (270)
длиннее любой коммерческой страницы, включая главную (252).

### Портфолио отдельно

| Проект | Категория | м² | Фото | Слов в описании |
|---|---|--:|--:|--:|
| rekonstrukce-paneloveho-bytu | BYT | 40 | 10 | 68 |
| rekonstrukce-bytu-zelena-kuchyne | BYT | 44 | 9 | 37 |
| rekonstrukce-bytu-moderni-kuchyne | BYT | 38 | 11 | 39 |
| rekonstrukce-bytu-panelak | Kosmetika | 30 | 14 | 35 |
| rekonstrukce-bytu-radova-kuchyne | Kosmetika | 50 | 10 | 35 |
| rekonstrukce-bytu-koupelna | BYT | 54 | 10 | 34 |
| kompaktni-byt-rekonstrukce | Kosmetika | 32 | 3 | 32 |
| rekonstrukce-bytu-kuchyne-koupelna | BYT | 46 | 6 | 28 |
| zatepleni-fasady-panelaku | Fasáda | 2400 | 7 | 25 |

Все 9 — Teplice, у всех год 2026.

---

## Найденные проблемы

Порядок — по влиянию на поиск, а не по сложности.

### 🔴 1. Тонкий контент на коммерческих страницах

Цифры выше. Страница проекта — это заголовок, три факта, один абзац на 25–68 слов и
галерея. Google видит десять почти одинаковых по структуре страниц «фото + абзац». Шесть
из них за пять недель так и не просканированы.

Особенно жаль портфолио: фото реальных объектов — самое ценное, что есть на сайте, и
именно оно подано тоньше всего. План — [12-portfolio.md](12-portfolio.md).

### 🔴 2. Каннибализация: четыре страницы на один запрос

| Страница | Title |
|---|---|
| `/` | Váš partner pro **rekonstrukce bytů – Teplice** |
| `/services` | Služby – **rekonstrukce bytů** a domů **Teplice** |
| `/portfolio` | Portfolio **rekonstrukcí bytů – Teplice** |
| `/contacts` | Kontakt – **rekonstrukce bytů Teplice** |

Плюс H1 страницы `/services` — «Kompletní rekonstrukce bytů a domů» — дословно title
страницы `/services/kompletni-rekonstrukce`.

Город в title был правильным шагом в сентябре, но теперь все страницы спорят друг с
другом. Нужна карта: у каждой страницы свой запрос ([13-keywords.md](13-keywords.md)).

### 🔴 3. Улучшения из `dev` не на живом сайте

Шесть коммитов после 24.09 не выкачены в `main`:

- ~~формы заявок на страницах услуг и проектов~~ — убраны 30–31.10, остаётся общий баннер;
- связь «услуга ↔ проекты» в обе стороны;
- трёхслойная география;
- первый экран без ожидания JavaScript (LCP).

Проверено 30.10: на живой странице проекта нет ни формы, ни строки «Služba», на живой
главной заголовок приходит с `opacity:0`.

### 🟠 4. H1 главной не говорит, что и где

«Vaše první volba pro kompletní stavby a rekonstrukce.» — ни «byt», ни города. Пункт 2
в `plans.md`, не сделан.

### 🟠 5. `/services` показывает в HTML только одну услугу

Три остальные — только названия в боковом меню. Обзорная страница услуг — это хаб:
на ней должны быть все четыре услуги с кратким описанием и ссылками.

### 🟠 6. Нет страниц, которые ищут

| Страница | Что ищут | Почему важно |
|---|---|---|
| **О нас** | — (не запрос, а доверие) | Кто эти люди, с какого года, своя ли бригада, страховка. Главный пробел по E-E-A-T |
| **Ceník** | `rekonstrukce bytu cena`, `cena za m2`, `kolik stojí rekonstrukce koupelny` | Огромный спрос, а `Kč` на сайте не встречается ни разу. Заблокировано: нужны реальные цифры от заказчика |
| **Rekonstrukce koupelny** | `rekonstrukce koupelny Teplice` и т.п. | Почти в каждом проекте есть ванная, а отдельной страницы нет |
| **Výměna bytového jádra** | `výměna bytového jádra`, `umakartové jádro` | Типичная работа в панельках, в проектах встречается |
| **Zateplení fasády** | `zateplení fasády panelového domu` | Есть объект на 2400 м², а услуга спрятана в «Stavební & řemeslné práce» |
| **Советы (blog)** | вопросы до звонка | См. [13-keywords.md](13-keywords.md) |

### 🟠 7. Противоречия, которые бьют по доверию

| Где | Что | Конфликт |
|---|---|---|
| Главная, статистика | «24/7 Rychlá komunikace» | Часы работы Po–Pá 9:00–18:00 |
| Главная, статистика | «2+ záruka» | На `/services` и в FAQ — «2 roky» |
| Главная, `/services` | «40+ dokončených projektů» | В портфолио 9 |
| Разметка, контакты, подвал | Адрес Praha-Chodov | Работа в Теплице, все объекты в Теплице |
| Все проекты | Год 2026 | Проверить: если объекты разных лет — исправить. Даты — сигнал доверия |

### 🟠 8. Общие слова вместо фактов

«Měníme vaše představy v realitu s důrazem na poctivé řemeslo a špičkový výsledek»,
«demonstrují náš závazek k designu, excelenci, inovaci a spokojenosti klientů», «Více než
jen rekonstrukce». Такие фразы ничего не сообщают ни человеку, ни Google. Каждую стоит
заменить фактом.

### 🟡 9. Мелочи

| Что | Где | Исправление |
|---|---|---|
| ~~«Zajímá vás kosmetické úpravy?» — ошибка согласования в заголовке формы на услугах~~ | [`ServiceDetailPage.tsx`](../../src/pages/ServicesPage/ServiceDetailPage.tsx) | ✅ 30.10: форма со страниц услуг убрана целиком |
| Метки категорий «BYT», «Kosmetika» на карточках и в фильтре; «Fasáda» на карточке, «Fasády» в фильтре | данные портфолио, [`portfolioCategories.data.ts`](../../src/data/portfolio/portfolioCategories.data.ts) | «Kompletní rekonstrukce», «Kosmetické úpravy», «Fasády a zateplení» — те же слова, что в услугах |
| «© 2026 KartStav Development s.r.o.. Všechna práva…» — две точки | [`Footer.tsx`](../../src/components/layout/Footer/Footer.tsx) | Убрать точку после `company.name` |
| Ссылка в подвале «Uživatelská smlouva», а страница называется «Podmínky použití webových stránek» | Подвал | Одно название |
| Анкоры «Více informací» ×4 на разные услуги | Карточки услуг | Название услуги в тексте ссылки или `aria-label` |
| `alt` фото проектов: «fotografie N z M» | [`ProjectPage.tsx`](../../src/pages/ProjectPage/ProjectPage.tsx) | ✅ 30.10 в коде: подпись из админки становится `alt`. Заработает после заполнения подписей ([14-case-drafts.md](14-case-drafts.md)) |
| Описание проекта в `meta description` — обрезанное первое предложение | `ProjectPage.tsx` | ✅ 30.10 в коде: поле «Description in Google» в админке |
| «Další realizace» — первые 3 проекта, а не похожие | `ProjectPage.tsx` | ✅ 30.10: сначала той же категории |
| Комментарий о FAQ-сниппетах | [`faq.data.ts`](../../src/data/faq.data.ts) | Устарел с 2023 |
| Нет `max-image-preview:large` | [`Seo.tsx`](../../src/components/common/Seo/Seo.tsx) | Одна строка |

### ⚪ 10. Вне сайта (без изменений с сентября)

Нет Google Business Profile, Firmy.cz, отзывов, `sameAs`. Всё это отложено в `plans.md`
и по-прежнему самое весомое для локального поиска. См. [04-local-seo.md](04-local-seo.md).
