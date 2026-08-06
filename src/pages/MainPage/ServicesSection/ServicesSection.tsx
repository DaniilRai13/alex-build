import Button from '@/components/ui/Button/Button';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { services } from '@/data/services.data';
import { ChevronRight } from 'lucide-react';
import { type FC } from 'react';
import styles from './ServicesSection.module.scss';
import { ROUTES } from '@/config/routes';
import Heading from '@/components/ui/Heading/Heading';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { motion } from 'framer-motion';
import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
const ServicesSection: FC = () => {
	const navigate = useNavigate();
	return (
		<section className={styles.services}>
			<motion.div
				className={styles.servicesHeader}
				initial={'hidden'}
				whileInView={'visible'}
				transition={{ ...animationTransition.defaultTransition, delay: 0 }}
				variants={animations.fadeLeft}
			>
				<Heading className={styles.heading}>Naše služby</Heading>
				<Subtitle className={styles.description}>
					Vybíráme řešení pro úkoly jakékoli složitosti – od konceptu až po
					realizaci.
				</Subtitle>
			</motion.div>
			<div className={styles.grid}>
				{services.slice(0, 4).map(service => {
					return (
						<article
							className={styles.card}
							key={service.title}
							role='button'
							tabIndex={0}
							aria-label={service.title}
							onClick={() => navigate(ROUTES.SERVICES)}
							onKeyDown={e => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									navigate(ROUTES.SERVICES);
								}
							}}
						>
							<div className={styles.icons}>
								<Icon icon={service.icon} />
								<ChevronRight
									className={cn(styles.arrow, styles.desktopArrow)}
									size={18}
								/>
							</div>
							<div className={styles.content}>
								<Heading as='h3' className={styles.title}>
									{service.title}
								</Heading>
								<p>{service.description}</p>
							</div>
							<ChevronRight
								className={cn(styles.arrow, styles.mobileArrow)}
								size={18}
							/>
						</article>
					);
				})}
			</div>

			<motion.div
				className={styles.buttonWrapper}
				initial={'hidden'}
				whileInView={'visible'}
				transition={{ ...animationTransition.defaultTransition, delay: 0.1 }}
				variants={animations.fadeUp}
			>
				<Button
					title='Všechny služby'
					className={styles.button}
					to={ROUTES.SERVICES}
				/>
			</motion.div>
		</section>
	);
};

export default ServicesSection;
