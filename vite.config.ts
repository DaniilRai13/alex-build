import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
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
