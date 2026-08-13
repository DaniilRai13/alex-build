// Builds dist/sitemap.xml from the pages that were actually prerendered.
//
//   node scripts/generate-sitemap.mjs      (runs automatically after the build)
//
// Scanning dist/ instead of keeping a hand-written list means new services and
// portfolio projects show up in the sitemap the moment they are added to the
// data files — nobody has to remember to update an XML file.

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
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
	{
		match: url => url.startsWith('/project/'),
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

const run = async () => {
	const files = [];
	for await (const file of walk(DIST)) files.push(file);

	const entries = [];

	for (const file of files) {
		const url = toRoute(file);
		if (EXCLUDED.has(url)) continue;
		if (!(await isIndexable(file))) continue;

		const { mtime } = await stat(file);

		entries.push({
			url,
			lastmod: mtime.toISOString().slice(0, 10),
			...ruleFor(url),
		});
	}

	entries.sort((a, b) => a.url.localeCompare(b.url));

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries.map(entry =>
			[
				'  <url>',
				`    <loc>${SITE_URL}${entry.url === '/' ? '/' : entry.url}</loc>`,
				`    <lastmod>${entry.lastmod}</lastmod>`,
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
