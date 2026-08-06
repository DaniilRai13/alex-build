import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export const contacts: IContacts[] = [
	{
		icon: 'Phone',
		href: 'tel:+420774896027',
		label: '+420 774 896 027',
		type: 'link',
	},
	{
		icon: 'Mail',
		href: 'mailto:info@kartstav.cz',
		label: 'info@kartstav.cz',
		type: 'link',
	},
	{ icon: 'MapPin', label: 'Čenětická 2413/1a, Chodov, 149 00 Praha', type: 'text' },
	{ icon: 'Clock', label: 'Po–Pá: 9:00–18:00', type: 'text' },
];

interface IContacts {
	icon: IconNames;
	href?: string;
	label: string;
	type: string;
}
