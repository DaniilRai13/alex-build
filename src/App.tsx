import type { ComponentType } from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import Layout from './components/layout/Layout';
import { ROUTES } from './config/routes';

// react-router `lazy` očekává modul s exportem `Component`; naše stránky mají
// default export, proto adaptér. Díky routeru (ne React.lazy + Suspense) se
// obsah renderuje rovnou do shellu → čistá hydratace bez duplikace layoutu.
const page =
	(load: () => Promise<{ default: ComponentType }>) => async () => ({
		Component: (await load()).default,
	});

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
				path: ROUTES.SERVICES,
				lazy: page(() => import('./pages/ServicesPage/ServicesPage')),
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
				path: '*',
				lazy: page(() => import('./pages/NotFoundPage/NotFoundPage')),
			},
		],
	},
];
