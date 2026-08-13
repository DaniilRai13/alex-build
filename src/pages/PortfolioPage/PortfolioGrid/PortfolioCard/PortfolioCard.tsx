import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { projectPath } from '@/config/routes';
import type { IPortfolioProject } from '@/types/portfolio.interface';
import { Link } from 'react-router-dom';
import styles from './PortfolioCard.module.scss';

interface Props {
	project: IPortfolioProject;
	/** First card on the page is the LCP image — load it eagerly. */
	priority?: boolean;
}

const PortfolioCard = ({ project, priority = false }: Props) => {
	return (
		<article className={styles.card}>
			{/* A real <a> rather than an onClick handler: this is how crawlers
			    discover the project pages and pass authority to them. */}
			<Link className={styles.link} to={projectPath(project.slug)}>
				<Image
					src={project.preview}
					alt={`${project.title} – ${project.location}`}
					priority={priority}
				/>
				<div className={styles.overlay} />

				<div className={styles.content}>
					<span className={styles.category}>{project.categoryLabel}</span>

					{/* h2, not h3: the card sits directly under the page <h1>, and
					    skipping a level breaks the document outline. */}
					<h2 className={styles.title}>{project.title}</h2>

					<div className={styles.info}>
						<Icon icon='MapPin' size={14} />
						<span>{project.location}</span>

						<span>•</span>

						<span>{project.area} m²</span>
					</div>
				</div>

				<div className={styles.arrow}>
					<Icon icon='ArrowUpRight' size={18} />
				</div>
			</Link>
		</article>
	);
};

export default PortfolioCard;
