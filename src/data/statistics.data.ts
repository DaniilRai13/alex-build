import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';
import { company, COMPLETED_PROJECTS } from '@/config/company';

export interface IStatisticsData {
	/** The figure itself — the bold half of the pair. */
	title: string;
	/** What the figure counts. */
	sub: string;
	icon: IconNames;
}

/** "09:00" -> "9" */
const hour = (time: string) => String(Number(time.split(':')[0]));

// Shown beside the copy in the About block. The numbers repeat
// advantages.data.ts on purpose — a visitor comparing the home page with the
// services page must not find two different warranty lengths.
//
// The hours used to read "24/7 — Rychlá komunikace" next to contacts that say
// Po–Pá 9:00–18:00, and the warranty "2+" where every other page says 2 roky.
// Both are taken from what the company actually commits to now; the hours come
// from config/company.ts, so they cannot drift from the footer.
export const statisticsData: IStatisticsData[] = [
	{ title: `${COMPLETED_PROJECTS}+`, sub: 'Dokončených projektů', icon: 'Award' },
	{ title: 'Pevná cena', sub: 'bez skrytých poplatků', icon: 'BadgeCheck' },
	{
		title: `Po–Pá ${hour(company.openingHours.opens)}–${hour(company.openingHours.closes)}`,
		sub: 'na telefonu i e-mailu',
		icon: 'Phone',
	},
	{ title: '2 roky', sub: 'záruka na veškeré práce', icon: 'ShieldCheck' },
];
