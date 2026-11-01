import type { IPortfolioProject } from '@/types/portfolio.interface';
import PortfolioCard from './PortfolioCard/PortfolioCard';
import styles from './PortfolioGrid.module.scss';

interface Props {
	projects: IPortfolioProject[];
	/** Load the first card eagerly — true only where it is the LCP image. */
	priorityFirst?: boolean;
}

const PortfolioGrid = ({ projects, priorityFirst = true }: Props) => {
	return (
		<div className={styles.gallery}>
			<div className={styles.grid}>
				{projects.map((project, index) => (
					<PortfolioCard
						key={project.id}
						project={project}
						priority={priorityFirst && index === 0}
					/>
				))}
			</div>
		</div>
	);
};

export default PortfolioGrid;
