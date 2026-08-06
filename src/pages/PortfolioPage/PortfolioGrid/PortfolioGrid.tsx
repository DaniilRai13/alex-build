import type { IPortfolioProject } from '@/types/portfolio.interface';
import PortfolioCard from './PortfolioCard/PortfolioCard';
import styles from './PortfolioGrid.module.scss';
// import Button from '@/components/ui/Button/Button';
interface Props {
	projects: IPortfolioProject[];
	onOpen(project: IPortfolioProject): void;
}

const PortfolioGrid = ({ projects, onOpen }: Props) => {
	return (
		<div className={styles.gallery}>
			<div className={styles.grid}>
				{projects.map(project => (
					<PortfolioCard
						key={project.id}
						project={project}
						onClick={() => onOpen(project)}
					/>
				))}
			</div>
			{/* <Button className={styles.loadMore} title='NAČÍST DALŠÍ' /> */}
		</div>
	);
};

export default PortfolioGrid;
