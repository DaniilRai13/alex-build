// Publishes the project list for the admin as dist/portfolio.json.
//
//   node scripts/export-portfolio.mjs      (runs at the end of every build)
//
// Since 1 Nov 2026 the projects live in this repository (projects.json and
// public/photos), not in Supabase, and the admin only shows them. Reading them
// from the live site means the admin lists exactly what visitors see, with no
// second copy to keep in step. public/.htaccess lets the admin's origin fetch
// the file.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(__dirname, '..', 'src', 'data', 'portfolio', 'projects.json');
const TARGET = path.resolve(__dirname, '..', 'dist', 'portfolio.json');
const SITE_URL = 'https://kartstav.cz';

// The labels of src/data/portfolio/portfolioCategories.data.ts — the names the
// site shows. A TypeScript module cannot be imported from here.
const CATEGORY_LABELS = {
	renovation: 'Kompletní rekonstrukce',
	interior: 'Kosmetické úpravy',
	facade: 'Fasáda',
};

const projects = JSON.parse(await readFile(SOURCE, 'utf8'));

const list = projects.map(project => ({
	slug: project.slug,
	title: project.title,
	categoryLabel: CATEGORY_LABELS[project.category] ?? project.category,
	location: project.location,
	area: project.area,
	year: project.year,
	photos: project.images.length,
	url: `${SITE_URL}/portfolio/${project.slug}`,
	// The original, not a variant: variants carry content hashes in their
	// names, and the originals are ~200 KB, fine for a short list.
	preview: `${SITE_URL}/photos/${project.slug}/${project.preview}`,
	updatedAt: project.updatedAt,
}));

await writeFile(
	TARGET,
	JSON.stringify({ generatedAt: new Date().toISOString(), projects: list }, null, '\t'),
);

console.log(`[portfolio] ${list.length} projects -> dist/portfolio.json`);
