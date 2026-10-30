// Static server for the 3D prototype — no bundling, so the viewer's import map
// reaches the browser untouched (Vite rewrites bare "three" imports).
//
//     node 3d/serve.mjs          → http://localhost:5199/viewer/

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5199;
const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.glb': 'model/gltf-binary',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
};

createServer(async (req, res) => {
	let path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
	if (!path.startsWith(ROOT)) return res.writeHead(403).end();
	try {
		if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
		const body = await readFile(path);
		res.writeHead(200, {
			'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream',
			'Cache-Control': 'no-store', // the model is rebuilt often
		});
		res.end(body);
	} catch {
		res.writeHead(404).end('Not found');
	}
}).listen(PORT, () => console.log(`http://localhost:${PORT}/viewer/`));
