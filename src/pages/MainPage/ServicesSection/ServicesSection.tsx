import { animationTransition } from '@/components/common/animation/transition';
import { animations } from '@/components/common/animation/variants';
import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES, servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './ServicesSection.module.scss';

const ServicesSection: FC = () => {
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
						<article className={styles.card} key={service.title}>
							{/* A link to the service page instead of navigate() on click:
							    crawlers follow links, they do not fire click handlers. */}
							<Link className={styles.cardLink} to={servicePath(service.slug)}>
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
							</Link>
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
