import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export interface IStatisticsData {
	/** The figure itself — the bold half of the pair. */
	title: string;
	/** What the figure counts. */
	sub: string;
	icon: IconNames;
}

// Shown beside the copy in the About block. The numbers repeat
// advantages.data.ts on purpose — a visitor comparing the home page with the
// services page must not find two different warranty lengths.
export const statisticsData: IStatisticsData[] = [
	{ title: '40+', sub: 'Dokončených projektů', icon: 'Award' },
	{ title: 'Pevná cena', sub: 'bez skrytých poplatků', icon: 'BadgeCheck' },
	{ title: '24/7', sub: 'Rychlá komunikace', icon: 'Phone' },
	{ title: '2+', sub: 'záruka na veškeré práce', icon: 'ShieldCheck' },
];
