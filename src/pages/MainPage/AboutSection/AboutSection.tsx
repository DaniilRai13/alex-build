import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import { aboutProject } from '@/data/portfolio/portfolio.data';
import { statisticsData } from '@/data/statistics.data';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import AboutCard from './AboutCard/AboutCard';
import styles from './AboutSection.module.scss';

const AboutSection: FC = () => {
	return (
		<section className={styles.about}>
			{/*
				The first project the portfolio strip below does not already show.
				The best shot on the site is the strip's own first card, and
				repeating it here would put the same photo twice on one screen.
			*/}
			<motion.div
				className={styles.media}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true }}
				transition={animationTransition.defaultTransition}
				variants={animations.fadeLeft}
			>
				<Image
					src={aboutProject.preview.src}
					srcSet={aboutProject.preview.srcSet}
					sizes='(max-width: 950px) 100vw, 45vw'
					alt={`${aboutProject.title} – ${aboutProject.location}`}
					className={styles.photo}
				/>
			</motion.div>

			<motion.div
				className={styles.copy}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true }}
				transition={{ ...animationTransition.defaultTransition, delay: 0.15 }}
				variants={animations.fadeUp}
			>
				<span className={styles.eyebrow}>O společnosti</span>

				<Heading className={styles.title}>Kdo jsme a co děláme</Heading>

				<Subtitle className={styles.text}>
					Specializujeme se na kompletní rekonstrukce bytů a domů. Spojujeme
					kvalitní řemeslné zpracování, moderní design a individuální přístup,
					abychom vytvořili interiéry, které budou sloužit mnoho let.
				</Subtitle>

				<div className={styles.stats}>
					{statisticsData.map(item => (
						<AboutCard key={item.title} item={item} />
					))}
				</div>

				<Button
					title='Zobrazit realizace'
					className={styles.button}
					to={ROUTES.PORTFOLIO}
				/>
			</motion.div>
		</section>
	);
};

export default AboutSection;
