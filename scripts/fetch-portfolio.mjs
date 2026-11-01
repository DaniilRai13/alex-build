// Pulls the portfolio out of Supabase and into the build.
//
//   node scripts/fetch-portfolio.mjs      (runs automatically before every build)
//
// The projects are edited in the admin app, but the website stays fully static:
// this downloads the metadata and the original photos once per build, and
// generate-image-variants.mjs then resizes them as it always has. Visitors are
// served files from the CDN, never from Supabase — which keeps the pages
// prerendered for search engines and keeps the database's egress out of the
// path of public traffic.
//
// Output (both git-ignored, both derived):
//   src/assets/portfolio-remote/<slug>/<file>
//   src/data/portfolio/portfolio.remote.json
//
// If Supabase cannot be reached but a previous download is still on disk, the
// build continues with it and says so. A deploy should not fail because of a
// network blip; it should fail only when there is nothing to show at all.

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PHOTOS = path.join(ROOT, 'src', 'assets', 'portfolio-remote');
const DATA = path.join(ROOT, 'src', 'data', 'portfolio', 'portfolio.remote.json');

const BUCKET = 'portfolio';

const readEnvFile = async name => {
	try {
		const text = await readFile(path.join(ROOT, name), 'utf8');

		return Object.fromEntries(
			text
				.split(/\r?\n/)
				.filter(line => line.trim() && !line.trim().startsWith('#'))
				.map(line => {
					const i = line.indexOf('=');
					return [
						line.slice(0, i).trim(),
						line
							.slice(i + 1)
							.trim()
							.replace(/^["']|["']$/g, ''),
					];
				}),
		);
	} catch {
		return {};
	}
};

const fileEnv = { ...(await readEnvFile('.env')), ...(await readEnvFile('.env.local')) };

// No VITE_ prefix: this script runs in Node before Vite starts, and only
// VITE_-prefixed names are ever inlined into the browser bundle. Keeping these
// unprefixed makes it impossible for the key to reach a visitor by accident.
// The prefixed spellings are still accepted so an existing .env keeps working.
const pick = (...names) => {
	for (const name of names) {
		const value = process.env[name] ?? fileEnv[name];
		if (value) return value;
	}
	return '';
};

const SUPABASE_URL = pick('SUPABASE_URL', 'VITE_SUPABASE_URL').replace(/\/+$/, '');
const ANON_KEY = pick('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

/** True when a usable download from an earlier run is already on disk. */
const hasCache = async () => {
	try {
		const cached = JSON.parse(await readFile(DATA, 'utf8'));
		return Array.isArray(cached) && cached.length > 0;
	} catch {
		return false;
	}
};

const fail = async message => {
	if (await hasCache()) {
		console.warn(`[portfolio] ${message}`);
		console.warn('[portfolio] keeping the previous download — the build continues with it');
		process.exit(0);
	}

	console.error(`[portfolio] ${message}`);
	console.error('[portfolio] and there is no earlier download to fall back on');
	process.exit(1);
};

if (!SUPABASE_URL || !ANON_KEY) {
	await fail(
		'missing SUPABASE_URL / SUPABASE_ANON_KEY (looked in the environment, .env and .env.local)',
	);
}

const BASE_SELECT =
	'id,slug,title,description,category,category_label,location,area,year,sort_order,updated_at,' +
	'portfolio_images(storage_path,sort_order,is_preview)';

// The case-study columns (database/portfolio.sql in the admin app): the facts,
// the story sections, the testimonial, and a caption and phase per photo.
const CASE_STUDY_SELECT =
	'id,slug,title,description,category,category_label,location,area,year,sort_order,updated_at,' +
	'district,building_type,layout,duration_weeks,' +
	'story_before,story_brief,story_work,story_challenges,story_materials,story_result,' +
	'testimonial_text,testimonial_author,seo_title,seo_description,' +
	'portfolio_images(storage_path,sort_order,is_preview,caption,phase)';

const requestProjects = select => {
	const url = new URL(`${SUPABASE_URL}/rest/v1/portfolio_projects`);
	url.searchParams.set('select', select);
	// Unpublished projects are invisible to the anon key by policy; ordering is
	// what the admin's up/down arrows write.
	url.searchParams.set('order', 'sort_order.asc,created_at.asc');

	return fetch(url, {
		headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
	});
};

const fetchProjects = async () => {
	let response = await requestProjects(CASE_STUDY_SELECT);

	// A database the new columns have not reached yet answers 400 "column ...
	// does not exist". Falling back keeps a deploy from failing on the order in
	// which the SQL and the site happen to ship; the pages simply render
	// without the case study until the columns exist.
	if (response.status === 400) {
		const reason = await response.text();
		if (/does not exist/i.test(reason)) {
			console.warn(
				'[portfolio] the case-study columns are missing — run database/portfolio.sql ' +
					'from the admin app in Supabase. Building without them.',
			);
			response = await requestProjects(BASE_SELECT);
		} else {
			throw new Error(`HTTP 400 — ${reason.slice(0, 200)}`);
		}
	}

	if (!response.ok) {
		throw new Error(`HTTP ${response.status} — ${(await response.text()).slice(0, 200)}`);
	}

	return response.json();
};

/** Trims a text column; an empty one counts as not written. */
const text = value => (typeof value === 'string' && value.trim() ? value.trim() : null);

const download = async storagePath => {
	const response = await fetch(
		`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`,
	);

	if (!response.ok) throw new Error(`HTTP ${response.status} for ${storagePath}`);

	return Buffer.from(await response.arrayBuffer());
};

/** Removes anything in `dir` whose name is not in `keep`. */
const prune = async (dir, keep) => {
	let entries;
	try {
		entries = await readdir(dir);
	} catch {
		return 0;
	}

	let removed = 0;
	for (const entry of entries) {
		if (keep.has(entry)) continue;
		await rm(path.join(dir, entry), { recursive: true, force: true });
		removed += 1;
	}

	return removed;
};

const run = async () => {
	const started = Date.now();

	let projects;
	try {
		projects = await fetchProjects();
	} catch (error) {
		await fail(`could not read the portfolio: ${error.message}`);
		return;
	}

	if (projects.length === 0) {
		await fail('the portfolio is empty — refusing to publish a site with no projects');
		return;
	}

	await mkdir(PHOTOS, { recursive: true });

	const manifest = [];
	let downloaded = 0;
	let reused = 0;

	for (const project of projects) {
		const dir = path.join(PHOTOS, project.slug);
		await mkdir(dir, { recursive: true });

		const images = [...project.portfolio_images].sort((a, b) => a.sort_order - b.sort_order);

		if (images.length === 0) {
			console.warn(`[portfolio] ${project.slug} has no photos — skipping it`);
			continue;
		}

		const files = [];
		for (const image of images) {
			const name = path.basename(image.storage_path);
			const target = path.join(dir, name);

			// Every upload gets a fresh name, so a file that is already here is
			// byte-for-byte the one we want. Skipping it keeps rebuilds quick and
			// leaves the resized variants valid.
			try {
				await readFile(target);
				reused += 1;
			} catch {
				await writeFile(target, await download(image.storage_path));
				downloaded += 1;
			}

			files.push({
				name,
				isPreview: image.is_preview,
				caption: text(image.caption),
				phase: image.phase ?? null,
			});
		}

		await prune(dir, new Set(files.map(file => file.name)));

		const preview = files.find(file => file.isPreview) ?? files[0];

		manifest.push({
			id: project.id,
			slug: project.slug,
			title: project.title,
			description: project.description,
			category: project.category,
			categoryLabel: project.category_label,
			location: project.location,
			area: project.area,
			year: project.year,
			updatedAt: project.updated_at ?? null,
			district: text(project.district),
			buildingType: project.building_type ?? null,
			layout: text(project.layout),
			durationWeeks: project.duration_weeks ?? null,
			story: {
				before: text(project.story_before),
				brief: text(project.story_brief),
				work: text(project.story_work),
				challenges: text(project.story_challenges),
				materials: text(project.story_materials),
				result: text(project.story_result),
			},
			testimonial: text(project.testimonial_text)
				? { text: text(project.testimonial_text), author: text(project.testimonial_author) }
				: null,
			seoTitle: text(project.seo_title),
			seoDescription: text(project.seo_description),
			preview: preview.name,
			images: files.map(file => file.name),
			// Keyed by file name so `images` keeps the plain shape an older
			// download on disk still has.
			photos: Object.fromEntries(
				files.map(file => [file.name, { caption: file.caption, phase: file.phase }]),
			),
		});
	}

	// Folders of projects that were deleted or unpublished in the admin.
	const removed = await prune(PHOTOS, new Set(manifest.map(project => project.slug)));

	await writeFile(DATA, `${JSON.stringify(manifest, null, '\t')}\n`, 'utf8');

	const seconds = ((Date.now() - started) / 1000).toFixed(1);
	console.log(
		`[portfolio] ${manifest.length} projects, ${downloaded} photos downloaded, ` +
			`${reused} already cached, ${removed} removed, ${seconds}s`,
	);
};

run().catch(async error => {
	await fail(`failed: ${error.message}`);
});
