import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import SectionHead from '@/components/common/SectionHead/SectionHead';
import Button from '@/components/ui/Button/Button';
import Image from '@/components/ui/Image/Image';
import { projectPath } from '@/config/routes';
import { beforeAfter } from '@/data/portfolio/portfolio.data';
import type { IProjectPhoto } from '@/types/portfolio.interface';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import styles from './BeforeAfterSection.module.scss';

/**
 * One room, the same corner, before and after. The strip above shows only
 * finished work, which every contractor's site does; the "before" is the part
 * a stock photo cannot fake, and the part people search the portfolio for.
 */
const BeforeAfterSection: FC = () => {
	// The pair is hand-picked in the data and disappears if the admin removes
	// either photo — and the section goes with it.
	if (!beforeAfter) return null;

	const { project, before, after } = beforeAfter;

	const photo = (image: IProjectPhoto, label: string) => (
		<figure className={styles.figure}>
			<div className={styles.frame}>
				<Image
					src={image.src}
					srcSet={image.srcSet}
					sizes='(max-width: 768px) 50vw, 30vw'
					alt={`${image.caption ?? label} – ${project.title}, ${project.location}`}
					className={styles.photo}
				/>
				<span className={styles.label}>{label}</span>
			</div>
			{image.caption && <figcaption>{image.caption}</figcaption>}
		</figure>
	);

	return (
		<section className={styles.section}>
			<motion.div
				className={styles.copy}
				initial='hidden'
				whileInView='visible'
				viewport={{ once: true }}
				transition={animationTransition.defaultTransition}
				variants={animations.fadeLeft}
			>
				<SectionHead
					eyebrow='Před a po'
					title='Stejný pokoj před rekonstrukcí a po ní'
					lead='Obě fotografie jsou pořízené ze stejného místa v bytě – před zahájením prací a po jejich dokončení. Další snímky původního stavu, průběhu i výsledku najdete u celé realizace.'
					className={styles.head}
				/>
				<Button
					title='Zobrazit celou realizaci'
					className={styles.button}
					to={projectPath(project.slug)}
				/>
			</motion.div>

			<div className={styles.pair}>
				{photo(before, 'Před')}
				{photo(after, 'Po')}
			</div>
		</section>
	);
};

export default BeforeAfterSection;
