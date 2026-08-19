import type { IPortfolioProject } from '@/types/portfolio.interface';
import PortfolioCard from './PortfolioCard/PortfolioCard';
import styles from './PortfolioGrid.module.scss';

interface Props {
	projects: IPortfolioProject[];
}

const PortfolioGrid = ({ projects }: Props) => {
	return (
		<div className={styles.gallery}>
			<div className={styles.grid}>
				{projects.map((project, index) => (
					<PortfolioCard
						key={project.id}
						project={project}
						priority={index === 0}
					/>
				))}
			</div>
		</div>
	);
};

export default PortfolioGrid;
