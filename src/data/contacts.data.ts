import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export const contacts: IContacts[] = [
	{
		icon: 'Phone',
		href: 'tel:+420774896027',
		label: '+420774896027',
		type: 'link',
	},
	{
		icon: 'Mail',
		href: 'mailto:alexej.ivanovskij@gmail.com',
		label: 'alexej.ivanovskij@gmail.com',
		type: 'link',
	},
	{ icon: 'MapPin', label: 'Teplice, Česká republika', type: 'text' },
	{ icon: 'Clock', label: 'Po–Pá: 9:00–18:00', type: 'text' },
];

interface IContacts {
	icon: IconNames;
	href?: string;
	label: string;
	type: string;
}
