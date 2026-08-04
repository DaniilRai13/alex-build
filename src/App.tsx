import { lazy } from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import Layout from './components/layout/Layout';
import { ROUTES } from './config/routes';

// Data-routes pro vite-react-ssg. Stránky se načítají líně (code-splitting)
// a zároveň se prerenderují do statického HTML.
export const routes: RouteRecord[] = [
	{
		path: ROUTES.HOME,
		element: <Layout />,
		entry: 'src/components/layout/Layout.tsx',
		children: [
			{
				index: true,
				Component: lazy(() => import('./pages/MainPage/MainPage')),
			},
			{
				path: ROUTES.PORTFOLIO,
				Component: lazy(() => import('./pages/PortfolioPage/PortfolioPage')),
			},
			{
				path: ROUTES.SERVICES,
				Component: lazy(() => import('./pages/ServicesPage/ServicesPage')),
			},
			{
				path: ROUTES.CONTACTS,
				Component: lazy(() => import('./pages/ContactPage/ContactPage')),
			},
			{
				path: ROUTES.PRIVACY,
				Component: lazy(() => import('./pages/legal/PrivacyPage')),
			},
			{
				path: ROUTES.TERMS,
				Component: lazy(() => import('./pages/legal/TermsPage')),
			},
			{
				path: '*',
				Component: lazy(() => import('./pages/NotFoundPage/NotFoundPage')),
			},
		],
	},
];
