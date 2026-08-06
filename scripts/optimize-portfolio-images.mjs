// Optimalizace fotek portfolia: zmenší velké snímky a znovu je zakóduje
// jako JPEG (mozjpeg). Přepisuje soubory na místě, přípona zůstává .jpg,
// takže se nemusí měnit importy. Spouštěj po přidání nové složky projektu.
//
//   npm run optimize:images
//
// Titulní snímky (main.*) mají jemnější profil (větší rozměr a vyšší
// kvalitu), protože se zobrazují jako náhled i na celou obrazovku v
// lightboxu. Ostatní fotky galerie se komprimují víc.
//
// Malé soubory (už optimalizované) se přeskočí, aby se opakovaným
// kódováním nezhoršila kvalita. POZOR: skript přepisuje originály –
// před spuštěním měj zdrojové fotky zálohované mimo repozitář.

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Na Windows si sharp/libvips drží otevřený vstupní soubor, což brání
// přepsání stejné cesty. Čteme proto do bufferu a cache vypneme.
sharp.cache(false);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'src', 'assets', 'portfolio');

// Jemnější profil pro titulní snímky, agresivnější pro zbytek galerie.
// skipUnder je zvolen tak, aby se už zpracované soubory při dalším běhu
// znovu nekomprimovaly (idempotence).
const MAIN_PROFILE = { maxDim: 2560, quality: 88, skipUnder: 1300 * 1024 };
const GALLERY_PROFILE = { maxDim: 2000, quality: 80, skipUnder: 700 * 1024 };

const IMAGE_RE = /\.(jpe?g|png)$/i;
const MAIN_RE = /(^|[\\/])main\.(jpe?g|png)$/i;

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
		const profile = MAIN_RE.test(file) ? MAIN_PROFILE : GALLERY_PROFILE;

		const { size } = await stat(file);
		const input = await readFile(file);
		const meta = await sharp(input).metadata();
		const longest = Math.max(meta.width ?? 0, meta.height ?? 0);

		if (size <= profile.skipUnder && longest <= profile.maxDim) {
			skipped++;
			continue;
		}

		const buffer = await sharp(input)
			.rotate() // respektuj EXIF orientaci
			.resize(profile.maxDim, profile.maxDim, {
				fit: 'inside',
				withoutEnlargement: true,
			})
			.jpeg({ quality: profile.quality, mozjpeg: true })
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
