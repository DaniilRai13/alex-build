import Button from '@/components/ui/Button/Button';
import { servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import cn from 'classnames';
import styles from './ServiceSidebar.module.scss';

interface Props {
	/** Slug of the service currently open; absent on the overview page. */
	activeSlug?: string;
}

const ServiceSidebar = ({ activeSlug }: Props) => {
	return (
		<aside className={styles.sidebar}>
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
		</aside>
	);
};

export default ServiceSidebar;
