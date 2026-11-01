import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import SectionHead from '@/components/common/SectionHead/SectionHead';
import Heading from '@/components/ui/Heading/Heading';
import { workStepsData } from '@/data/workSteps.data';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import styles from './ProcessSection.module.scss';

/**
 * The four steps from /contacts, brought to the page most people actually
 * land on. "How would this go" is the question between liking the work and
 * calling, and the home page answered it only inside a collapsed FAQ item.
 */
const ProcessSection: FC = () => (
	<section className={styles.process}>
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true }}
			transition={animationTransition.defaultTransition}
			variants={animations.fadeUp}
		>
			{/* Both facts in the lead are already promised elsewhere — the
			    viewing in the FAQ, the free quote in the banner at the foot of
			    every page. */}
			<SectionHead
				eyebrow='Spolupráce'
				title='Jak pracujeme'
				lead='Čtyři kroky od prvního telefonátu po předání hotového bytu. Prohlídka i cenová nabídka jsou nezávazné a zdarma.'
				className={styles.head}
			/>
		</motion.div>

		{/* An ordered list: the order is the content. */}
		<ol className={styles.steps}>
			{workStepsData.map(step => (
				<li className={styles.step} key={step.id}>
					<span className={styles.number}>{step.id}</span>
					<Heading as='h3' className={styles.stepTitle}>
						{step.title}
					</Heading>
					<p className={styles.text}>{step.description}</p>
				</li>
			))}
		</ol>
	</section>
);

export default ProcessSection;
