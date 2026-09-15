import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import img from '@assets/hero-bg.jpg';
import { motion } from 'framer-motion';
import { type FC } from 'react';
import styles from './HeroSection.module.scss';
import { animations } from '@/components/common/animation/variants';
import { animationTransition } from '@/components/common/animation/transition';

const HeroSection: FC = () => {
	return (
		<div className={styles.banner}>
			<img
				className={styles.image}
				src={img}
				alt='Moderní přízemní rodinný dům s cihlovou fasádou a prosklenými vchodovými dveřmi'
				fetchPriority='high'
			/>
			<div className={styles.overlay} />
			<motion.div
				className={styles.content}
				initial={'hidden'}
				animate={'visible'}
				transition={{ ...animationTransition.defaultTransition, delay: 0.2 }}
				variants={animations.fadeLeft}
			>
				{/*
					The badge carries the geography so the heading can stay the line
					it has always been. Naming the town in both would put "Teplice"
					twice in two adjacent elements.
				*/}
				<span className={styles.badge}>Teplice · Ústecký kraj</span>

				{/*
					No forced line break: the heading is set in a fluid clamp, so a
					<br /> that lands well on a laptop splits it mid-thought on a
					phone. text-wrap: balance lets the browser pick the point.
				*/}
				<Heading as='h1' className={styles.title}>
					Vaše první volba pro kompletní stavby a rekonstrukce.
				</Heading>
				<Subtitle className={styles.description}>
					Měníme vaše představy v realitu s důrazem na poctivé řemeslo a
					špičkový výsledek. Působíme v Ústeckém kraji i v dalších městech
					České republiky.
				</Subtitle>
			</motion.div>
			<div className={styles.buttonContainer}>
				<motion.div
					initial={'hidden'}
					animate={'visible'}
					transition={animationTransition.defaultTransition}
					variants={animations.fadeUp}
				>
					<Button
						title='Získat konzultaci'
						className={styles.button}
						to={ROUTES.CONTACTS}
					/>
				</motion.div>
			</div>
		</div>
	);
};

export default HeroSection;
