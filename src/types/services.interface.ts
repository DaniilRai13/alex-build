import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';

export interface IService {
	id: number;
	/** URL segment of the service detail page: /services/{slug} */
	slug: string;
	title: string;
	description: string;
	/** <h2> above the long-form text on the service detail page. */
	detailHeading: string;
	/** Long-form text used only on the detail page — unique content for search engines. */
	longDescription: string[];
	/** <title>/meta description of the detail page — tighter and more keyword-led than the card title. */
	seoTitle: string;
	seoDescription: string;
	icon: IconNames;
	features: string[];
	buttonText: string;
	img?: string;
}
