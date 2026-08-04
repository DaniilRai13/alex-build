// react-router-dom v7 odstranil podpath `./server.js`, který vite-react-ssg
// vyžaduje pro SSG. Serverové API (createStaticHandler, StaticRouterProvider…)
// jsou v balíčku `react-router`, takže sem doplníme reexport a chybějící
// export cestu. Spouští se přes `postinstall` (idempotentní).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const pkgPath = 'node_modules/react-router-dom/package.json';
const shimPath = 'node_modules/react-router-dom/server-shim.mjs';

try {
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
	let changed = false;

	if (pkg.exports && !pkg.exports['./server.js']) {
		pkg.exports['./server.js'] = './server-shim.mjs';
		pkg.exports['./server'] = './server-shim.mjs';
		writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
		changed = true;
	}

	if (!existsSync(shimPath)) {
		writeFileSync(shimPath, "export * from 'react-router';\n");
		changed = true;
	}

	if (changed) {
		console.log('[patch-react-router] react-router-dom/server shim applied');
	}
} catch (err) {
	console.warn('[patch-react-router] skipped:', err.message);
}
