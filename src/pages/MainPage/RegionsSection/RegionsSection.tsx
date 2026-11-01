import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import SectionHead from '@/components/common/SectionHead/SectionHead';
import Button from '@/components/ui/Button/Button';
import { ROUTES } from '@/config/routes';
import { projectsByLocation } from '@/data/portfolio/portfolio.data';
import { primaryRegions, REGIONS_SENTENCE } from '@/data/regions.data';
import { plural } from '@/utils/plural';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import styles from './RegionsSection.module.scss';

/**
 * Where the company works, said once in the open on the strongest page. It used
 * to live only in a badge over the hero and in the last FAQ answer, collapsed.
 *
 * The heading comes from the same primary regions that feed areaServed, and
 * the counts beside it from the portfolio itself — the claim and the evidence
 * for it on one row, and neither can drift from the data.
 */
const RegionsSection: FC = () => (
	<section className={styles.regions}>
		<motion.div
			className={styles.copy}
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true }}
			transition={animationTransition.defaultTransition}
			variants={animations.fadeLeft}
		>
			<SectionHead
				eyebrow='Kde působíme'
				title={primaryRegions.map(region => region.name).join(' a ')}
				lead={REGIONS_SENTENCE}
			/>
		</motion.div>

		<div className={styles.panel}>
			<span className={styles.panelTitle}>Realizace v našem portfoliu</span>

			<ul className={styles.list}>
				{projectsByLocation.map(([location, count]) => (
					<li key={location}>
						<b>{location}</b>
						<span>
							{count} {plural(count, 'realizace', 'realizace', 'realizací')}
						</span>
					</li>
				))}
			</ul>

			<Button
				title='Prohlédnout realizace'
				className={styles.button}
				to={ROUTES.PORTFOLIO}
			/>
		</div>
	</section>
);

export default RegionsSection;
