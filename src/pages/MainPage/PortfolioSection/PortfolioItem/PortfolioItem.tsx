import { projectPath } from '@/config/routes';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import type { IPortfolioItems } from '../PortfolioSection';
import styles from './PortfolioItem.module.scss';

interface Props {
	item: IPortfolioItems;
}

const PortfolioItem: FC<Props> = ({ item }) => {
	const { project, className } = item;

	return (
		<article className={`${styles.card} ${className}`}>
			{/* Links, not click handlers — the project pages have to be crawlable
			    from the home page, not just from the sitemap. */}
			<Link className={styles.link} to={projectPath(project.slug)}>
				<img
					src={project.preview}
					alt={`${project.title} – ${project.location}`}
					loading='lazy'
					decoding='async'
				/>
				<div className={styles.overlay}>
					<span>{project.title}</span>
				</div>
			</Link>
		</article>
	);
};

export default PortfolioItem;
