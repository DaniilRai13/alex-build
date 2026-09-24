import type { IconNames } from '@/components/ui/LucidIcon/LucidIcons.types';
import type { IResponsiveImage } from './image.interface';

export interface IService {
	id: number;
	/** URL segment of the service detail page: /services/{slug} */
	slug: string;
	title: string;
	description: string;
	/** <h2> above the long-form text on the service detail page. */
	detailHeading: string;
	/**
	 * Long-form text used only on the detail page — unique content for search
	 * engines. Each paragraph carries its own kicker: the three of them always
	 * do three different jobs (what it is, why it works that way, who it is
	 * for), and dressed identically they read as one wall of text.
	 */
	longDescription: { heading: string; text: string }[];
	/** <title>/meta description of the detail page — tighter and more keyword-led than the card title. */
	seoTitle: string;
	seoDescription: string;
	icon: IconNames;
	features: string[];
	buttonText: string;
	img?: IResponsiveImage;
}
