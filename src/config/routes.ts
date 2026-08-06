import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export const ROUTES = {
	HOME: '/',
	SERVICES: '/services',
	PORTFOLIO: '/portfolio',
	CONTACTS: '/contacts',
	PROJECT: '/project/:id',
	PRIVACY: '/privacy',
	TERMS: '/terms',
};

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
