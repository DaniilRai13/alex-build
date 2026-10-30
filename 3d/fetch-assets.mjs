// Downloads the Poly Haven textures and models the apartment is dressed with.
// Everything on Poly Haven is CC0, so nothing here needs attribution or a
// licence file — but the downloads are derived data, like the portfolio
// photos, and stay out of git. Re-run after a fresh clone:
//
//     node 3d/fetch-assets.mjs
//
// Files land in 3d/assets/polyhaven/<asset>/, which build_apartment.py reads.

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'assets', 'polyhaven');
const API = 'https://api.polyhaven.com/files';
const RES = '1k'; // the web model never shows a texture larger than this

const TEXTURES = [
	'laminate_floor_02',
	'wood_floor',
	'plank_flooring_02',
	'herringbone_parquet',
	'rectangular_parquet',
	'large_grey_tiles',
	'marble_tiles',
	'large_floor_tiles_02',
	'square_tiles',
	'blue_floor_tiles_01',
	'wool_boucle',
	'rough_linen',
	'poly_wool_herringbone',
	'hessian_230',
	'marble_01',
];
const MAPS = { Diffuse: 'diff', Rough: 'rough', nor_gl: 'nor' };

const MODELS = [
	'potted_plant_04',
	'potted_plant_02',
	'throw_pillows_01',
	'ceramic_vase_01',
	'ceramic_vase_03',
	'wooden_bowl_02',
];

const exists = path => access(path).then(() => true, () => false);

async function download(url, path) {
	if (await exists(path)) return false;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${res.status} ${url}`);
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, Buffer.from(await res.arrayBuffer()));
	return true;
}

async function files(asset) {
	const res = await fetch(`${API}/${asset}`);
	if (!res.ok) throw new Error(`${res.status} listing ${asset}`);
	return res.json();
}

for (const asset of TEXTURES) {
	const listing = await files(asset);
	for (const [map, short] of Object.entries(MAPS)) {
		const file = listing[map]?.[RES]?.jpg;
		if (!file) continue;
		const got = await download(file.url, join(ROOT, asset, `${short}.jpg`));
		if (got) console.log(`texture ${asset}/${short}`);
	}
}

for (const asset of MODELS) {
	const gltf = (await files(asset)).gltf?.[RES]?.gltf;
	if (!gltf) throw new Error(`No ${RES} glTF for ${asset}`);
	await download(gltf.url, join(ROOT, asset, `${asset}.gltf`));
	for (const [rel, file] of Object.entries(gltf.include ?? {}))
		await download(file.url, join(ROOT, asset, rel));
	console.log(`model ${asset}`);
}
