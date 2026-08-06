import Seo from '@/components/common/Seo/Seo';
import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import { motion } from 'framer-motion';
import { type FC } from 'react';
import styles from './NotFoundPage.module.scss';

const NotFoundPage: FC = () => {
	return (
		<section className={styles.notFound}>
			<Seo
				title='Stránka nenalezena'
				description='Litujeme, ale požadovaná stránka neexistuje nebo byla přesunuta. Vraťte se na hlavní stránku.'
				path='/404'
			/>

			<motion.div
				className={styles.inner}
				initial='hidden'
				animate='visible'
				variants={animations.container}
			>
				<motion.div
					className={styles.code}
					variants={animations.fadeDown}
					transition={animationTransition.defaultTransition}
				>
					<span>4</span>
					<span className={styles.badge}>
						<motion.span
							className={styles.spin}
							animate={{ rotate: 360 }}
							transition={{ repeat: Infinity, ease: 'linear', duration: 6 }}
						>
							<Icon icon='House' />
						</motion.span>
					</span>
					<span>4</span>
				</motion.div>

				<motion.div
					variants={animations.fadeUp}
					transition={animationTransition.defaultTransition}
				>
					<Heading className={styles.title}>Stránka nenalezena</Heading>
				</motion.div>

				<motion.div
					variants={animations.fadeUp}
					transition={animationTransition.defaultTransition}
				>
					<Subtitle className={styles.subtitle}>
						Litujeme, ale stránka na této adrese neexistuje nebo byla přesunuta.
					</Subtitle>
				</motion.div>

				<motion.div
					variants={animations.fadeUp}
					transition={animationTransition.defaultTransition}
				>
					<Button
						title='Zpět na hlavní stránku'
						icon='ArrowLeft'
						className={styles.button}
						to={ROUTES.HOME}
					/>
				</motion.div>
			</motion.div>
		</section>
	);
};

export default NotFoundPage;
