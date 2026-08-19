import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import { portfolioData } from '@/data/portfolio/portfolio.data';
import type { IPortfolioProject } from '@/types/portfolio.interface';
import { motion } from 'framer-motion';
import PortfolioItem from './PortfolioItem/PortfolioItem';
import styles from './PortfolioSection.module.scss';

export interface IPortfolioItems {
	project: IPortfolioProject;
	className: string;
}

// Náhledy reálných projektů z portfolia (první čtyři).
const layoutClasses = [
	styles.office,
	styles.restaurant,
	styles.hotel,
	styles.house,
];

const portfolioItems: IPortfolioItems[] = portfolioData
	.slice(0, 4)
	.map((project, index) => ({
		project,
		className: layoutClasses[index],
	}));

export const PortfolioSection = () => {
	return (
		<section className={styles.portfolio}>
			<div className={styles.info}>
				<motion.div
					initial='hidden'
					whileInView='visible'
					variants={animations.fadeLeft}
					transition={animationTransition.defaultTransition}
				>
					<Heading className={styles.infoTitle}>Naše portfolio</Heading>
				</motion.div>
				<motion.div
					initial='hidden'
					whileInView='visible'
					variants={animations.fadeLeft}
					transition={{ ...animationTransition.defaultTransition, delay: 0.4 }}
				>
					<Subtitle className={styles.description}>
						Prohlédněte si naše vybrané práce, které demonstrují náš závazek k
						designu, excelenci, inovaci a spokojenosti klientů.
					</Subtitle>
				</motion.div>
			</div>

			<div className={styles.gallery}>
				{portfolioItems.map(item => (
					<PortfolioItem key={item.project.id} item={item} />
				))}
			</div>
			<motion.div
				className={styles.buttonWrapper}
				initial='hidden'
				whileInView='visible'
				variants={animations.fadeUp}
				transition={animationTransition.defaultTransition}
			>
				<Button
					className={styles.button}
					title='Zobrazit další projekty'
					to={ROUTES.PORTFOLIO}
				/>
			</motion.div>
		</section>
	);
};
