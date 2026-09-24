import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export const ROUTES = {
	HOME: '/',
	SERVICES: '/services',
	SERVICE: '/services/:slug',
	PORTFOLIO: '/portfolio',
	CONTACTS: '/contacts',
	// Projects live under the listing that shows them. They used to sit on
	// their own branch at /project/:slug while the listing was at /portfolio,
	// which left the parent path /project with nothing to serve — and, because
	// the build still wrote a project/ folder, with a redirect loop to untangle
	// in .htaccess. The old URLs are 301'd there and must stay redirected.
	PROJECT: '/portfolio/:slug',
	PRIVACY: '/privacy',
	TERMS: '/terms',
	NOT_FOUND: '/404',
};

/** Concrete detail URLs for a service / project (dynamic segment resolved). */
export const servicePath = (slug: string) => `/services/${slug}`;
export const projectPath = (slug: string) => `/portfolio/${slug}`;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export interface INavigateSideProps {
	name: string;
	icon: IconNames;
	link: string;
}
export const navigateSideProps: INavigateSideProps[] = [
	{
		name: 'Domov',
		icon: 'House',
		link: ROUTES.HOME,
	},
	{
		name: 'Služby',
		icon: 'Building2',
		link: ROUTES.SERVICES,
	},
	{
		name: 'Portfolio',
		icon: 'Image',
		link: ROUTES.PORTFOLIO,
	},
	{
		name: 'Kontakt',
		icon: 'Mail',
		link: ROUTES.CONTACTS,
	},
];
