import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
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
	/** Optional second, quieter link — used on detail pages, not in the list. */
	secondaryTitle?: string;
	secondaryTo?: string;
	/** Above-the-fold image loads eagerly; the rest stay lazy. */
	priority?: boolean;
}

const ServicePreview = ({
	service,
	headingAs = 'h2',
	headingHref,
	ctaTitle = 'Kontaktujte nás',
	ctaTo = ROUTES.CONTACTS,
	secondaryTitle,
	secondaryTo,
	priority = false,
}: Props) => {
	return (
		<div className={styles.preview}>
			{/* Watermark, not content: the sketch sits behind the text at low
			    opacity, so alt is empty and it never blocks a click. */}
			{service.img && (
				<Image
					src={service.img.src}
					srcSet={service.img.srcSet}
					alt=''
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

				<div className={styles.actions}>
					<Button title={ctaTitle} className={styles.button} to={ctaTo} />

					{secondaryTitle && secondaryTo && (
						<Link className={styles.secondary} to={secondaryTo}>
							{secondaryTitle}
							<Icon icon='ArrowRight' size={16} />
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default ServicePreview;
