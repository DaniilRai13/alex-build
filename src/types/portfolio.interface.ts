export type PortfolioCategory = 'all' | 'interior' | 'renovation' | 'facade';

export interface IPortfolioProject {
	id: number;
	slug: string;

	title: string;
	description: string;

	category: PortfolioCategory;
	categoryLabel: string;

	location: string;

	area: number;

	year: number;

	preview: string;

	images: string[];
}