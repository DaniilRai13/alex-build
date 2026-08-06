import Heading from '@/components/ui/Heading/Heading';
import { useMemo, useState, type FC } from 'react';
import styles from './PortfolioPage.module.scss';
import type {
	IPortfolioProject,
	PortfolioCategory,
} from '@/types/portfolio.interface';
import { portfolioData } from '@/data/portfolio/portfolio.data';
import PortfolioFilters from './PortfolioFilters/PortfolioFilters';
import { portfolioCategories } from '@/data/portfolio/portfolioCategories.data';
import PortfolioGrid from './PortfolioGrid/PortfolioGrid';
import PortfolioModal from './PortfolioModal/PortfolioModal';
import Seo from '@/components/common/Seo/Seo';
const PortfolioPage: FC = () => {
	const [selectedProject, setSelectedProject] =
		useState<IPortfolioProject | null>(null);
	const [category, setCategory] = useState<PortfolioCategory>('all');

	const projects = useMemo(() => {
		if (category === 'all') return portfolioData;

		return portfolioData.filter(project => project.category === category);
	}, [category]);

	return (
		<section className={styles.portfolio}>
			<Seo
				title='Portfolio projektů'
				description='Prohlédněte si naše dokončené projekty rekonstrukcí bytů, domů a komerčních prostor. Reálné realizace s důrazem na kvalitu a detail.'
				path='/portfolio'
			/>
			<div className={styles.header}>
				<span className={styles.subtitle}>Naše realizace</span>

				<Heading className={styles.title}>Portfolio projektů</Heading>

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

			<PortfolioGrid projects={projects} onOpen={setSelectedProject} />
			<PortfolioModal
				project={selectedProject}
				onClose={() => setSelectedProject(null)}
			/>
			{/* Pagination */}
		</section>
	);
};

export default PortfolioPage;
