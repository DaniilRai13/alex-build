// Optimalizace fotek portfolia: zmenší velké snímky a znovu je zakóduje
// jako JPEG (mozjpeg). Přepisuje soubory na místě, přípona zůstává .jpg,
// takže se nemusí měnit importy. Spouštěj po přidání nové složky projektu.
//
//   npm run optimize:images
//
// Malé soubory (už optimalizované) se přeskočí, aby se opakovaným
// kódováním nezhoršila kvalita.

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Na Windows si sharp/libvips drží otevřený vstupní soubor, což brání
// přepsání stejné cesty. Čteme proto do bufferu a cache vypneme.
sharp.cache(false);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'src', 'assets', 'portfolio');

const MAX_DIM = 2000; // nejdelší strana v px
const QUALITY = 80; // JPEG kvalita
const SKIP_UNDER_BYTES = 600 * 1024; // menší a dost malé rozlišení neřešíme
const IMAGE_RE = /\.(jpe?g|png)$/i;

const kb = bytes => `${(bytes / 1024).toFixed(0)} KB`;

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(full);
		else if (IMAGE_RE.test(entry.name)) yield full;
	}
}

async function run() {
	let totalBefore = 0;
	let totalAfter = 0;
	let processed = 0;
	let skipped = 0;

	for await (const file of walk(ROOT)) {
		const { size } = await stat(file);
		const input = await readFile(file);
		const meta = await sharp(input).metadata();
		const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

		if (size <= SKIP_UNDER_BYTES && longest <= MAX_DIM) {
			skipped++;
			continue;
		}

		const buffer = await sharp(input)
			.rotate() // respektuj EXIF orientaci
			.resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
			.jpeg({ quality: QUALITY, mozjpeg: true })
			.toBuffer();

		await writeFile(file, buffer);

		totalBefore += size;
		totalAfter += buffer.length;
		processed++;

		const rel = path.relative(ROOT, file);
		console.log(`  ${rel}: ${kb(size)} -> ${kb(buffer.length)}`);
	}

	console.log(
		`\nHotovo. Zpracováno ${processed}, přeskočeno ${skipped}. ` +
			`Celkem ${kb(totalBefore)} -> ${kb(totalAfter)}.`,
	);
}

run().catch(err => {
	console.error(err);
	process.exit(1);
});
