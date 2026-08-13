// Generates responsive WebP variants of the portfolio photos.
//
//   npm run images:variants     (runs automatically before every build)
//
// The source photos are 1500-2560px wide, but a portfolio card is shown at
// roughly 380 CSS px and a gallery thumbnail at 240. Serving the full-size
// file for those is where nearly all of the wasted bytes are: the largest
// photo drops from 1007 KB to 56 KB at 480px. Re-encoding at the *same* size
// saves far less, because optimize-portfolio-images.mjs already ran mozjpeg
// over the originals — so the widths matter more than the format here.
//
// Output goes to src/assets/generated/, which is git-ignored: the variants are
// derived data and regenerating them is cheaper than carrying ~15 MB of
// binaries in the repository. The originals stay untouched as the source of
// truth and as the <img> fallback for browsers without WebP.

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// On Windows sharp/libvips keeps the input file open, which blocks rewrites of
// the same path; read into a buffer and keep the cache off.
sharp.cache(false);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dirname, '..', 'src', 'assets');
const OUTPUT = path.join(ASSETS, 'generated');

// Portfolio: 480 covers phone cards and gallery thumbnails, 960 tablet and
// desktop cards, 1600 the project cover and retina. Anything larger is only
// ever seen in the lightbox, which loads the original.
//
// Services: `widths: null` means one variant at the source size. Those
// illustrations are already only ~400-480px wide, so there is nothing to
// resize — the win there is purely PNG to WebP, which cuts them 4x.
const GROUPS = [
	{ name: 'portfolio', widths: [480, 960, 1600] },
	{ name: 'services', widths: null },
];

const QUALITY = { 480: 75, 960: 78, 1600: 78, native: 80 };

const IMAGE_RE = /\.(jpe?g|png)$/i;

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) yield* walk(full);
		else if (IMAGE_RE.test(entry.name)) yield full;
	}
}

const isUpToDate = async (source, target) => {
	try {
		const [src, out] = await Promise.all([stat(source), stat(target)]);

		return out.mtimeMs >= src.mtimeMs;
	} catch {
		return false;
	}
};

const run = async () => {
	const started = Date.now();

	let written = 0;
	let skipped = 0;
	let bytes = 0;

	for (const group of GROUPS) {
		const root = path.join(ASSETS, group.name);

		for await (const source of walk(root)) {
			const relative = path.relative(root, source);
			const dir = path.join(OUTPUT, group.name, path.dirname(relative));
			const base = path.basename(relative).replace(IMAGE_RE, '');

			await mkdir(dir, { recursive: true });

			// Read once and reuse for every width.
			let input;

			for (const width of group.widths ?? [null]) {
				const target = path.join(
					dir,
					width === null ? `${base}.webp` : `${base}-${width}.webp`,
				);

				if (await isUpToDate(source, target)) {
					skipped += 1;
					continue;
				}

				input ??= await readFile(source);

				const pipeline = sharp(input);
				if (width !== null) {
					pipeline.resize({ width, withoutEnlargement: true });
				}

				const buffer = await pipeline
					.webp({ quality: QUALITY[width ?? 'native'] })
					.toBuffer();

				await writeFile(target, buffer);

				written += 1;
				bytes += buffer.length;
			}
		}
	}

	const seconds = ((Date.now() - started) / 1000).toFixed(1);

	console.log(
		`[images] ${written} variants written (${(bytes / 1024 / 1024).toFixed(1)} MB), ` +
			`${skipped} up to date, ${seconds}s`,
	);
};

run().catch(error => {
	console.error('[images] failed:', error);
	process.exit(1);
});
