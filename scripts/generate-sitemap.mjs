// Builds dist/sitemap.xml from the pages that were actually prerendered.
//
//   node scripts/generate-sitemap.mjs      (runs automatically after the build)
//
// Scanning dist/ instead of keeping a hand-written list means new services and
// portfolio projects show up in the sitemap the moment they are added to the
// data files — nobody has to remember to update an XML file.

// <lastmod> only where the date comes from the content. It used to be the
// generated file's mtime, which is the build time — so every deploy announced
// all 19 URLs as freshly changed, and a lastmod that is always today is a
// lastmod nobody should believe.
//
// Project pages now have an honest one: `updated_at` of the project row in the
// admin, which scripts/fetch-portfolio.mjs writes into portfolio.remote.json.
// It moves when a project is edited (and, harmlessly, when the list is
// reordered). /portfolio takes the newest of them. Everything else still goes
// without: its content lives in the code, and dating it would need `git log`
// per source file plus fetch-depth: 0 in the deploy workflow.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const SITE_URL = 'https://kartstav.cz';

// Pages that must never appear in the sitemap.
const EXCLUDED = new Set(['/404']);

// changefreq/priority are ignored by Google, but Seznam (the Czech engine that
// still matters here) does read them, so both stay in.
const PRIORITIES = [
	{ match: url => url === '/', changefreq: 'monthly', priority: '1.0' },
	{
		match: url => url === '/services' || url === '/portfolio',
		changefreq: 'monthly',
		priority: '0.9',
	},
	{
		match: url => url.startsWith('/services/'),
		changefreq: 'monthly',
		priority: '0.8',
	},
	// Project pages moved from /project/:slug to /portfolio/:slug. The exact
	// match on '/portfolio' above runs first, so the listing keeps its 0.9 and
	// only the projects beneath it fall through to this rule.
	{
		match: url => url.startsWith('/portfolio/'),
		changefreq: 'yearly',
		priority: '0.7',
	},
	{ match: url => url === '/contacts', changefreq: 'yearly', priority: '0.6' },
];

const DEFAULT_RULE = { changefreq: 'yearly', priority: '0.3' };

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			// Hashed build assets never contain pages.
			if (entry.name === 'assets' || entry.name.startsWith('.')) continue;
			yield* walk(full);
		} else if (entry.name.endsWith('.html')) {
			yield full;
		}
	}
}

/** dist/services/kompletni-rekonstrukce.html -> /services/kompletni-rekonstrukce */
const toRoute = file => {
	const relative = path.relative(DIST, file).split(path.sep).join('/');
	const withoutExt = relative.replace(/\.html$/, '');

	return withoutExt === 'index' ? '/' : `/${withoutExt}`;
};

/** Pages carrying a noindex robots tag do not belong in a sitemap. */
const isIndexable = async file => {
	const html = await readFile(file, 'utf8');

	return !/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html);
};

const ruleFor = url =>
	PRIORITIES.find(rule => rule.match(url)) ?? DEFAULT_RULE;

/** URL -> YYYY-MM-DD for the project pages and the listing above them. */
const contentDates = async () => {
	const dates = new Map();

	let projects;
	try {
		projects = JSON.parse(
			await readFile(
				path.resolve(__dirname, '..', 'src', 'data', 'portfolio', 'portfolio.remote.json'),
				'utf8',
			),
		);
	} catch {
		return dates;
	}

	for (const project of projects) {
		if (project.updatedAt) dates.set(`/portfolio/${project.slug}`, project.updatedAt.slice(0, 10));
	}

	const newest = [...dates.values()].sort().at(-1);
	if (newest) dates.set('/portfolio', newest);

	return dates;
};

const run = async () => {
	const files = [];
	for await (const file of walk(DIST)) files.push(file);

	const entries = [];
	const dates = await contentDates();

	for (const file of files) {
		const url = toRoute(file);
		if (EXCLUDED.has(url)) continue;
		if (!(await isIndexable(file))) continue;

		entries.push({ url, lastmod: dates.get(url), ...ruleFor(url) });
	}

	entries.sort((a, b) => a.url.localeCompare(b.url));

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.map(entry =>
			[
				'  <url>',
				`    <loc>${SITE_URL}${entry.url === '/' ? '/' : entry.url}</loc>`,
				...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
				`    <changefreq>${entry.changefreq}</changefreq>`,
				`    <priority>${entry.priority}</priority>`,
				'  </url>',
			].join('\n'),
		),
		'</urlset>',
		'',
	].join('\n');

	await writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf8');

	console.log(`[sitemap] ${entries.length} URLs -> dist/sitemap.xml`);
};

run().catch(error => {
	console.error('[sitemap] failed:', error);
	process.exit(1);
});
