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
			{/*
				Copy on the left, cards on the right. The heading, the lead and the
				button used to sit above and below a full-width grid; moving them
				into their own column puts the call to action beside the services
				rather than after the fold.
			*/}
			<motion.div
				className={styles.intro}
				initial={'hidden'}
				whileInView={'visible'}
				viewport={{ once: true }}
				transition={animationTransition.defaultTransition}
				variants={animations.fadeLeft}
			>
				<span className={styles.eyebrow}>Co nabízíme</span>

				<Heading className={styles.heading}>Naše služby</Heading>

				<Subtitle className={styles.description}>
					Vybíráme řešení pro úkoly jakékoli složitosti – od konceptu až po
					realizaci.
				</Subtitle>

				<Button
					title='Všechny služby'
					className={styles.button}
					to={ROUTES.SERVICES}
				/>
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
		</section>
	);
};

export default ServicesSection;
