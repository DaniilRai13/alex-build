import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import type { ViteReactSSGOptions } from 'vite-react-ssg';

// Řešení nadměrného přednačítání obrázků.
// vite-react-ssg slepě přednačítá KAŽDÝ obrázek v grafu stránky (domovská stránka
// importuje data portfolia s eager glob → ~90 fotek galerií), což zahltí <head>
// desítkami zbytečných <link rel="preload" as="image">. React 19 přitom sám vkládá
// preload jen pro eager <img>, které skutečně vykreslil (logo, hero…), a nechává je
// na začátku #root. Necháme proto jen tyto „chytré" React preloady a přesuneme je
// do <head>; slepé preloady od vite-react-ssg (v <head>, s crossorigin) zahodíme.
const ssgOptions: ViteReactSSGOptions = {
	onPageRendered(_route, html) {
		const headEnd = html.indexOf('</head>');
		if (headEnd === -1) return html;

		// 1) Zahodit slepé image preloady, které do <head> přidal vite-react-ssg.
		const head = html
			.slice(0, headEnd)
			.replace(/<link\b[^>]*\bas=["']image["'][^>]*>/gi, '');
		let body = html.slice(headEnd);

		// 2) Přesunout React preloady (eager <img>) ze začátku #root do <head>.
		const rootLinks = /(<div\s+id="root"[^>]*>)((?:\s*<link\b[^>]*>)+)/i;
		const match = body.match(rootLinks);
		const reactPreloads = match ? match[2].trim() : '';
		if (match) body = body.replace(rootLinks, '$1');

		return head + reactPreloads + body;
	},
};

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	ssgOptions,
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) return;
					if (id.includes('framer-motion') || id.includes('/motion/'))
						return 'framer-motion';
					if (id.includes('react-router') || id.includes('@remix-run'))
						return 'router';
					if (id.includes('yet-another-react-lightbox')) return 'lightbox';
					if (id.includes('react-hook-form')) return 'form';
					if (id.includes('lucide-react')) return 'icons';
					return 'vendor';
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@store': path.resolve(__dirname, './src/store'),
			'@api': path.resolve(__dirname, './src/api'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@types': path.resolve(__dirname, './src/types'),

			'@ui': path.resolve(__dirname, './src/components/ui'),
			'@common': path.resolve(__dirname, './src/components/common'),
			'@layout': path.resolve(__dirname, './src/components/layout'),
		},
	},
});
