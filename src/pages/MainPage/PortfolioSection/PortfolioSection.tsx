import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import SectionHead from '@/components/common/SectionHead/SectionHead';
import Button from '@/components/ui/Button/Button';
import { ROUTES } from '@/config/routes';
import { homeStripProjects } from '@/data/portfolio/portfolio.data';
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

const portfolioItems: IPortfolioItems[] = homeStripProjects
	.map((project, index) => ({
		project,
		className: layoutClasses[index],
	}));

export const PortfolioSection = () => {
	return (
		<section className={styles.portfolio}>
			<motion.div
				className={styles.info}
				initial='hidden'
				whileInView='visible'
				variants={animations.fadeLeft}
				transition={animationTransition.defaultTransition}
			>
				{/*
					The region, not a town: "v Teplicích" was true only while every
					project carried Teplice as a placeholder location.

					The lead says what the jobs actually were, where "závazek k
					designu, excelenci, inovaci" used to be — every word of that fits
					any company and none of it names a kitchen or a bathroom.
				*/}
				<SectionHead
					eyebrow='Portfolio'
					title='Realizace v Ústeckém kraji'
					lead='Byty po rekonstrukci: nové kuchyně, koupelny a podlahy, výměny bytových jader i zateplení fasády panelového domu. U každé realizace najdete fotografie a popis prací.'
				/>
			</motion.div>

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
