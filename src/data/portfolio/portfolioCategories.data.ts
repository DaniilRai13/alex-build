import type { PortfolioCategory } from '@/types/portfolio.interface';

export interface IPortfolioCategory {
	id: PortfolioCategory;
	title: string;
}

export const portfolioCategories: IPortfolioCategory[] = [
	{
		id: 'all',
		title: 'Vše',
	},
	{
		id: 'interior',
		title: 'Kosmetika',
	},
	{
		id: 'renovation',
		title: 'BYT',
	},
	{
		id: 'facade',
		title: 'Fasády',
	},
];