import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import type { ViteReactSSGOptions } from 'vite-react-ssg';

// React 19 vkládá pro každý ne-lazy <img> <link rel="preload" as="image"> a
// vite-react-ssg je nechá na začátku <div id="root"> (renderuje app do kontejneru,
// ne do celého dokumentu). Preload hinty ale patří do <head> – přesuneme je tam,
// aby #root začínal rovnou layoutem a prohlížeč načítal obrázky co nejdřív.
const ssgOptions: ViteReactSSGOptions = {
	onPageRendered(_route, html) {
		const rootLinks = /(<div\s+id="root"[^>]*>)((?:\s*<link\b[^>]*>)+)/i;
		const match = html.match(rootLinks);
		if (!match) return html;

		const links = match[2].trim();
		return html
			.replace(rootLinks, '$1')
			.replace('</head>', `${links}</head>`);
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
