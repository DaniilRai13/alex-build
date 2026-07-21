import { Icon } from '@/components/ui/LucidIcon/Icon';
import Image from '@/components/ui/Image/Image';
import type { IPortfolioProject } from '@/types/portfolio.interface';
import styles from './PortfolioCard.module.scss';

interface Props {
	project: IPortfolioProject;
	onClick(): void;
}

const PortfolioCard = ({ project, onClick }: Props) => {
	return (
		<article className={styles.card} onClick={onClick}>
			<Image src={project.preview} alt={project.title} />
			<div className={styles.overlay} />

			<div className={styles.content}>
				<span className={styles.category}>{project.categoryLabel}</span>

				<h3 className={styles.title}>{project.title}</h3>

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
		</article>
	);
};

export default PortfolioCard;
