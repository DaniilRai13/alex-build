import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import { motion } from 'framer-motion';
import PortfolioItem from './PortfolioItem/PortfolioItem';
import styles from './PortfolioSection.module.scss';
import { animations } from '@/components/common/animation/variants';
import { animationTransition } from '@/components/common/animation/transition';
export interface IPortfolioItems {
	title: string;
	image: string;
	className: string;
}

const portfolioItems: IPortfolioItems[] = [
	{
		title: 'New York Office',
		image:
			'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop',
		className: styles.office,
	},
	{
		title: 'Commercial Restaurant',
		image:
			'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop',
		className: styles.restaurant,
	},
	{
		title: 'Hotel Rooms',
		image:
			'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
		className: styles.hotel,
	},
	{
		title: 'Private House',
		image:
			'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
		className: styles.house,
	},
];
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
					<Heading className={styles.infoTitle}>
						Naše portfolio
					</Heading>
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
					<PortfolioItem key={item.title} item={item} />
				))}
			</div>
			<motion.div
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
