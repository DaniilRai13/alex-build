import type { IResponsiveImage } from './image.interface';

export type PortfolioCategory = 'all' | 'interior' | 'renovation' | 'facade';

export interface IPortfolioProject {
	/** UUID from the database. Used as a React key, never shown. */
	id: string;
	slug: string;

	title: string;
	description: string;

	category: PortfolioCategory;
	categoryLabel: string;

	location: string;

	area: number;

	year: number;

	preview: IResponsiveImage;

	images: IResponsiveImage[];
}
