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
		id: 'house',
		title: 'Domy',
	},
	{
		id: 'commercial',
		title: 'Komerční',
	},
	{
		id: 'facade',
		title: 'Fasády',
	},
];