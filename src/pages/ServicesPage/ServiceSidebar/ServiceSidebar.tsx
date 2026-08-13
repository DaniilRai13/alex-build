import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import { servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import cn from 'classnames';
import styles from './ServiceSidebar.module.scss';

interface Props {
	/** Slug of the service currently open; absent on the overview page. */
	activeSlug?: string;
	/** <h1> on the overview; on a detail page the <h1> is the service itself. */
	headingAs?: 'h1' | 'h2' | 'p';
	description?: string;
}

const ServiceSidebar = ({
	activeSlug,
	headingAs = 'h2',
	description = 'Vyberte si oblast, která vás zajímá, a zjistěte více.',
}: Props) => {
	return (
		<aside className={styles.sidebar}>
			<div className={styles.mainText}>
				<Heading as={headingAs} className={styles.heading}>
					Naše služby
				</Heading>

				<p className={styles.description}>{description}</p>
			</div>
			<div className={styles.navWrapper}>
				<nav className={styles.nav} aria-label='Seznam služeb'>
					{services.map(service => (
						<Button
							key={service.id}
							to={servicePath(service.slug)}
							className={cn(
								activeSlug === service.slug ? styles.active : '',
								styles.button,
							)}
							title={service.title}
							icon={service.icon}
						/>
					))}
				</nav>
			</div>
		</aside>
	);
};

export default ServiceSidebar;
