import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { projectPath } from '@/config/routes';
import { hasBeforeAfter } from '@/data/portfolio/portfolio.data';
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
					src={project.preview.src}
					srcSet={project.preview.srcSet}
					sizes='(max-width: 530px) 100vw, (max-width: 834px) 50vw, 33vw'
					alt={project.preview.caption ?? `${project.title} – ${project.location}`}
					priority={priority}
				/>
				<div className={styles.overlay} />

				<div className={styles.content}>
					{/* The category badge went: the section heading above already
					    says it. What a card can add is whether the project shows
					    where it started. */}
					{hasBeforeAfter(project) && <span className={styles.badge}>Před a po</span>}

					{/* h3: the card sits under its section's <h2>, which sits under
					    the page <h1>. */}
					<h3 className={styles.title}>{project.title}</h3>

					<div className={styles.info}>
						<Icon icon='MapPin' size={14} />
						<span>{project.location}</span>

						<span>•</span>

						<span>{project.area} m²</span>

						<span>•</span>

						<span>{project.year}</span>
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
