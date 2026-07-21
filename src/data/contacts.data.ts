import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export const contacts: IContacts[] = [
	{
		icon: 'Phone',
		href: 'tel:+79991234567',
		label: '+333333333',
		type: 'link',
	},
	{
		icon: 'Mail',
		href: 'mailto:info@realestate.ru',
		label: 'info@realestate.ru',
		type: 'link',
	},
	{ icon: 'MapPin', label: 'Минск', type: 'text' },
	{ icon: 'Clock', label: 'Пн-Пт: 9:00 - 20:00', type: 'text' },
];

interface IContacts {
	icon: IconNames;
	href?: string;
	label: string;
	type: string;
}
