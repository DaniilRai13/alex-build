import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';
import { company } from '@/config/company';

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
	// Czech customers check a contractor in the ARES company register before
	// they call, and the IČO is what they look it up by. It used to appear only
	// in the privacy policy, which is the one page nobody opens first.
	{ icon: 'Building2', label: `IČO ${company.id}`, type: 'text' },
];

interface IContacts {
	icon: IconNames;
	href?: string;
	label: string;
	type: string;
}
