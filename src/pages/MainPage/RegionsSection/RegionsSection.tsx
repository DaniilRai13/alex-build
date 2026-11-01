import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import SectionHead from '@/components/common/SectionHead/SectionHead';
import Button from '@/components/ui/Button/Button';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { COMPLETED_PROJECTS } from '@/config/company';
import { projectPath, ROUTES } from '@/config/routes';
import { portfolioData } from '@/data/portfolio/portfolio.data';
import { HOME_TOWNS, primaryRegions, TOWN_REGIONS } from '@/data/regions.data';
import { plural } from '@/utils/plural';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './RegionsSection.module.scss';

interface Town {
	name: string;
	slugs: string[];
}

// Every town in the portfolio, the busiest first.
const towns: Town[] = Object.values(
	portfolioData.reduce<Record<string, Town>>((all, project) => {
		all[project.location] ??= { name: project.location, slugs: [] };
		all[project.location].slugs.push(project.slug);

		return all;
	}, {}),
).sort((a, b) => b.slugs.length - a.slugs.length);

const regionCount = new Set(towns.map(town => TOWN_REGIONS[town.name]).filter(Boolean)).size;

/** One project → its page; several → the portfolio. */
const townLink = (town: Town) =>
	town.slugs.length === 1 ? projectPath(town.slugs[0]) : ROUTES.PORTFOLIO;

/**
 * Where the company works, said once in the open on the strongest page. Two
 * cards keep two claims apart: the home region, where the company goes for any
 * job, and the towns it has actually worked in, each a link to the proof. The
 * second card is counted from the portfolio, so it grows with every project.
 */
const RegionsSection: FC = () => (
	<section className={styles.regions}>
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true }}
			transition={animationTransition.defaultTransition}
			variants={animations.fadeLeft}
		>
			<SectionHead
				eyebrow='Kde působíme'
				title='Teplice, Ústecký kraj a dál'
				className={styles.head}
			/>
		</motion.div>

		<div className={styles.cards}>
			<div className={styles.homeCard}>
				<span className={styles.kicker}>Domácí region</span>
				<p className={styles.cardTitle}>{primaryRegions.map(region => region.name).join(' a ')}</p>
				<p className={styles.cardText}>
					Tady pracujeme nejčastěji. Na prohlídku přijedeme do celého kraje – nabídku připravíme
					zdarma.
				</p>
				<ul className={styles.homeTowns}>
					{HOME_TOWNS.map(name => (
						<li key={name}>{name}</li>
					))}
				</ul>
			</div>

			<div className={styles.workedCard}>
				<span className={styles.kicker}>Kde už jsme pracovali</span>
				<p className={styles.cardTitle}>
					{towns.length} {plural(towns.length, 'město', 'města', 'měst')} {regionCount >= 2 && regionCount <= 4 ? 've' : 'v'}{' '}
					{regionCount}{' '}
					{plural(regionCount, 'kraji', 'krajích', 'krajích')}
				</p>
				<p className={styles.cardText}>
					Města z našeho portfolia – výběr z více než {COMPLETED_PROJECTS} dokončených zakázek.
				</p>
				<ul className={styles.towns}>
					{towns.map(town => (
						<li key={town.name}>
							<Link to={townLink(town)}>
								<Icon icon='MapPin' size={14} />
								{town.name}
								{town.slugs.length > 1 && <span>{town.slugs.length}</span>}
							</Link>
						</li>
					))}
				</ul>
				<Button title='Prohlédnout realizace' className={styles.button} to={ROUTES.PORTFOLIO} />
			</div>
		</div>
	</section>
);

export default RegionsSection;
