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
	headingAs?: 'h1' | 'h2';
	headingHref?: string;
	ctaTitle?: string;
	ctaTo?: string;
	secondaryTitle?: string;
	secondaryTo?: string;
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
