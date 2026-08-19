import type { ComponentType } from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import Layout from './components/layout/Layout';
import { projectPath, ROUTES, servicePath } from './config/routes';

// react-router `lazy` očekává modul s exportem `Component`; naše stránky mají
// default export, proto adaptér. Díky routeru (ne React.lazy + Suspense) se
// obsah renderuje rovnou do shellu → čistá hydratace bez duplikace layoutu.
const page =
	(load: () => Promise<{ default: ComponentType }>) => async () => ({
		Component: (await load()).default,
	});

// Path lists used to prerender the dynamic routes. The data is imported
// dynamically so the ~90-photo portfolio glob stays out of the entry chunk —
// these functions only ever run at build time, never in the browser.
const serviceStaticPaths = async () => {
	const { services } = await import('./data/services.data');
	return services.map(service => servicePath(service.slug));
};

const projectStaticPaths = async () => {
	const { portfolioData } = await import('./data/portfolio/portfolio.data');
	return portfolioData.map(project => projectPath(project.slug));
};

export const routes: RouteRecord[] = [
	{
		path: ROUTES.HOME,
		element: <Layout />,
		entry: 'src/components/layout/Layout.tsx',
		children: [
			{
				index: true,
				lazy: page(() => import('./pages/MainPage/MainPage')),
			},
			{
				path: ROUTES.PORTFOLIO,
				lazy: page(() => import('./pages/PortfolioPage/PortfolioPage')),
			},
			{
				path: ROUTES.PROJECT,
				lazy: page(() => import('./pages/ProjectPage/ProjectPage')),
				getStaticPaths: projectStaticPaths,
			},
			{
				path: ROUTES.SERVICES,
				lazy: page(() => import('./pages/ServicesPage/ServicesPage')),
			},
			{
				path: ROUTES.SERVICE,
				lazy: page(() => import('./pages/ServicesPage/ServiceDetailPage')),
				getStaticPaths: serviceStaticPaths,
			},
			{
				path: ROUTES.CONTACTS,
				lazy: page(() => import('./pages/ContactPage/ContactPage')),
			},
			{
				path: ROUTES.PRIVACY,
				lazy: page(() => import('./pages/legal/PrivacyPage')),
			},
			{
				path: ROUTES.TERMS,
				lazy: page(() => import('./pages/legal/TermsPage')),
			},
			{
				// Prerendered to /404.html, which Apache serves via ErrorDocument
				// with a real 404 status code.
				path: ROUTES.NOT_FOUND,
				lazy: page(() => import('./pages/NotFoundPage/NotFoundPage')),
			},
			{
				path: '*',
				lazy: page(() => import('./pages/NotFoundPage/NotFoundPage')),
			},
		],
	},
];
