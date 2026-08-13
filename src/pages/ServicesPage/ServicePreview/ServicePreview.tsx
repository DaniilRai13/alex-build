import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { ROUTES } from '@/config/routes';
import type { IService } from '@/types/services.interface';
import { Link } from 'react-router-dom';
import styles from './ServicePreview.module.scss';

interface Props {
	service: IService;
	/** <h1> on the service detail page, <h2> in the overview list. */
	headingAs?: 'h1' | 'h2';
	/** Renders the heading as a link to the detail page (used by the overview). */
	headingHref?: string;
	ctaTitle?: string;
	ctaTo?: string;
	/** Above-the-fold image loads eagerly; the rest stay lazy. */
	priority?: boolean;
}

const ServicePreview = ({
	service,
	headingAs = 'h2',
	headingHref,
	ctaTitle = 'Kontaktujte nás',
	ctaTo = ROUTES.CONTACTS,
	priority = false,
}: Props) => {
	return (
		<div className={styles.preview}>
			<div className={styles.overlay}></div>
			{service.img && (
				<Image
					src={service.img.src}
					srcSet={service.img.srcSet}
					alt={service.title}
					className={styles.bg}
					priority={priority}
				/>
			)}
			<div className={styles.info}>
				<Heading as={headingAs} className={styles.heading}>
					{headingHref ? (
						<Link className={styles.headingLink} to={headingHref}>
							{service.title}
						</Link>
					) : (
						service.title
					)}
				</Heading>

				<p className={styles.description}>{service.description}</p>

				<ul className={styles.list}>
					{service.features.map(feature => (
						<li key={feature} className={styles.item}>
							{feature}
						</li>
					))}
				</ul>

				<Button title={ctaTitle} className={styles.button} to={ctaTo} />
			</div>
		</div>
	);
};

export default ServicePreview;
