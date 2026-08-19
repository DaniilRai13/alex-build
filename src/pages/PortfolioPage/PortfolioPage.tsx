import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import Seo from '@/components/common/Seo/Seo';
import Heading from '@/components/ui/Heading/Heading';
import { company } from '@/config/company';
import { breadcrumbJsonLd } from '@/config/jsonLd';
import { projectPath, ROUTES } from '@/config/routes';
import { portfolioData } from '@/data/portfolio/portfolio.data';
import { portfolioCategories } from '@/data/portfolio/portfolioCategories.data';
import type { PortfolioCategory } from '@/types/portfolio.interface';
import { useMemo, useState, type FC } from 'react';
import PortfolioFilters from './PortfolioFilters/PortfolioFilters';
import PortfolioGrid from './PortfolioGrid/PortfolioGrid';
import styles from './PortfolioPage.module.scss';

const crumbs = [{ name: 'Domů', href: ROUTES.HOME }, { name: 'Portfolio' }];

const itemListJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	name: 'Realizace KartStav',
	numberOfItems: portfolioData.length,
	itemListElement: portfolioData.map((project, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: project.title,
		url: `${company.url}${projectPath(project.slug)}`,
	})),
};

const PortfolioPage: FC = () => {
	const [category, setCategory] = useState<PortfolioCategory>('all');

	const projects = useMemo(() => {
		if (category === 'all') return portfolioData;

		return portfolioData.filter(project => project.category === category);
	}, [category]);

	return (
		<section className={styles.portfolio}>
			<Seo
				title='Portfolio projektů'
				description='Prohlédněte si naše dokončené projekty rekonstrukcí bytů, domů a fasád. Reálné realizace s fotografiemi před a po, plochou i rokem dokončení.'
				path={ROUTES.PORTFOLIO}
				jsonLd={[breadcrumbJsonLd(crumbs), itemListJsonLd]}
			/>

			<Breadcrumbs items={crumbs} />

			<div className={styles.header}>
				<span className={styles.subtitle}>Naše realizace</span>

				<Heading as='h1' className={styles.title}>
					Portfolio projektů
				</Heading>

				<p className={styles.description}>
					Prohlédněte si naše dokončené projekty. Každá realizace je výsledkem
					individuálního přístupu, kvalitního řemeslného zpracování a důrazu na
					detail.
				</p>
			</div>

			<PortfolioFilters
				items={portfolioCategories}
				active={category}
				onChange={setCategory}
			/>

			<PortfolioGrid projects={projects} />
		</section>
	);
};

export default PortfolioPage;
