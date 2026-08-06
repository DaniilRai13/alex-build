import Button from '@/components/ui/Button/Button';
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
			<img className={styles.image} src={img} alt='Modern House' />
			<div className={styles.overlay} />
			<motion.div
				className={styles.content}
				initial={'hidden'}
				animate={'visible'}
				transition={{ ...animationTransition.defaultTransition, delay: 0.2 }}
				variants={animations.fadeLeft}
			>
				<h1>
					Vaše první volba pro
					<br />
					kompletní stavby a rekonstrukce.
				</h1>
				<p>
					Měníme vaše představy v realitu s důrazem na poctivé řemeslo a
					špičkový výsledek.
				</p>
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
