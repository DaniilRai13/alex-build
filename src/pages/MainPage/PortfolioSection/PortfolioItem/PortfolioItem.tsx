import { type FC } from 'react';
import styles from './PortfolioItem.module.scss';
import type { IPortfolioItems } from '../PortfolioSection';
import type { IPortfolioProject } from '@/types/portfolio.interface';

interface Props {
	item: IPortfolioItems;
	onOpen(project: IPortfolioProject): void;
}

const PortfolioItem: FC<Props> = ({ item, onOpen }) => {
	const { project, className } = item;

	return (
		<article
			className={`${styles.card} ${className}`}
			onClick={() => onOpen(project)}
		>
			<img src={project.preview} alt={project.title} />
			<div className={styles.overlay}>
				<span>{project.title}</span>
			</div>
		</article>
	);
};

export default PortfolioItem;
