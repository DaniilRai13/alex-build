import Image from '@/components/ui/Image/Image';
import { projectPath } from '@/config/routes';
import { projectFacts } from '@/data/portfolio/portfolio.data';
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
				<Image
					src={project.preview.src}
					srcSet={project.preview.srcSet}
					sizes='(max-width: 768px) 85vw, 33vw'
					alt={`${project.title} – ${project.location}`}
				/>
				{/*
					The facts under the title are the words a search for this kind of
					job contains — the town, the size and, once the admin has them, the
					layout and the building. The title alone said only what was done.
				*/}
				<div className={styles.overlay}>
					<span className={styles.title}>{project.title}</span>
					<span className={styles.facts}>{projectFacts(project).join(' · ')}</span>
				</div>
			</Link>
		</article>
	);
};

export default PortfolioItem;
