import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { statisticsData } from '@/data/statistics.data';
import asana from '@assets/asana.svg';
import gumroad from '@assets/gumroad.svg';
import linear from '@assets/linear.svg';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import AboutCard from './AboutCard/AboutCard';
import styles from './AboutSection.module.scss';

const AboutSection: FC = () => {
	return (
		<div className={styles.aboutSection}>
			<section className={styles.info}>
				<div className={styles.infoContainer}>
					<div className={styles.infoText}>
						<motion.div
							initial={'hidden'}
							whileInView={'visible'}
							transition={{
								...animationTransition.defaultTransition,
								delay: 0.2,
							}}
							variants={animations.fadeLeft}
						>
							<Heading className={styles.infoTitle}>O společnosti</Heading>
						</motion.div>
						<motion.div
							initial='hidden'
							whileInView='visible'
							transition={animationTransition.defaultTransition}
							variants={animations.fadeLeft}
						>
							<Subtitle className={styles.infoSubtitle}>
								Specializujeme se na kompletní rekonstrukce bytů a domů. Spojujeme
								kvalitní řemeslné zpracování, moderní design a individuální
								přístup, abychom vytvořili interiéry, které budou sloužit mnoho
								let.
							</Subtitle>
						</motion.div>
					</div>
					<motion.div
						className={styles.partners}
						initial='hidden'
						whileInView='visible'
						variants={animations.container}
						viewport={{ once: true }}
					>
						{[
							{ src: asana, alt: 'Asana' },
							{ src: linear, alt: 'Linear' },
							{ src: gumroad, alt: 'Gumroad' },
						].map(logo => (
							<motion.img
								key={logo.src}
								src={logo.src}
								alt={logo.alt}
								className={styles.img}
								variants={animations.fadeUp}
							/>
						))}
					</motion.div>
				</div>
			</section>
			<motion.section
				className={styles.stats}
				initial='hidden'
				whileInView='visible'
				variants={animations.container}
				viewport={{ once: true }}
			>
				{statisticsData.map((item) => (
					<motion.div
						key={item.title}
						initial={{
							opacity: 0,
							x: -40,
							y: 20,
						}}
						whileInView={{
							opacity: 1,
							x: 0,
							y: 0,
							transition: animationTransition.slowTransition,
						}}
					>
						<AboutCard key={item.title} item={item} />
					</motion.div>
				))}
			</motion.section>
		</div>
	);
};

export default AboutSection;
