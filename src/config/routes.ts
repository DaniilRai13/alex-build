import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export const ROUTES = {
	HOME: '/',
	SERVICES: '/services',
	SERVICE: '/services/:slug',
	PORTFOLIO: '/portfolio',
	CONTACTS: '/contacts',
	PROJECT: '/project/:slug',
	PRIVACY: '/privacy',
	TERMS: '/terms',
	NOT_FOUND: '/404',
};

/** Concrete detail URLs for a service / project (dynamic segment resolved). */
export const servicePath = (slug: string) => `/services/${slug}`;
export const projectPath = (slug: string) => `/project/${slug}`;

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
