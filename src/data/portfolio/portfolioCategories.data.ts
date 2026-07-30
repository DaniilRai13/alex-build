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
		title: 'Interiéry',
	},
	{
		id: 'renovation',
		title: 'Rekonstrukce',
	},
	{
		id: 'facade',
		title: 'Fasády',
	},
];