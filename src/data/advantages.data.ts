import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export interface IAdvantage {
	icon: IconNames;
	title: string;
	text: string;
}

/**
 * Trust points under the services heading. The numbers repeat statistics.data.ts
 * on purpose — a visitor comparing the two pages must not find two different
 * warranty lengths. Change them in both places or in neither.
 */
export const advantages: IAdvantage[] = [
	{ icon: 'Award', title: 'Zkušenosti', text: '40+ dokončených projektů' },
	{ icon: 'BadgeCheck', title: 'Kvalita', text: 'Ověřené materiály' },
	{ icon: 'CalendarCheck', title: 'Termíny', text: 'Dodržujeme domluvu' },
	{ icon: 'ShieldCheck', title: 'Záruka', text: '2 roky na veškeré práce' },
];
