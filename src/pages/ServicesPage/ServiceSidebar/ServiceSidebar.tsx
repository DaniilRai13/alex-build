import { Icon } from '@/components/ui/LucidIcon/Icon';
import { servicePath } from '@/config/routes';
import { services } from '@/data/services.data';
import type { IService } from '@/types/services.interface';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import styles from './ServiceSidebar.module.scss';

interface Props {
	/** Slug of the service currently shown. */
	activeSlug?: string;
	/**
	 * Present on the overview, where the list switches the panel in place.
	 * Without it the rows are links to the individual service pages, which is
	 * what the detail pages need.
	 */
	onSelect?: (service: IService) => void;
}

// Plain links or buttons rather than the Button component: this list needs its
// own shapes — icon with label beside the panel, and a full-width row with a
// chevron once it stacks above it.
const ServiceSidebar = ({ activeSlug, onSelect }: Props) => {
	return (
		<aside className={styles.sidebar}>
			<nav className={styles.nav} aria-label='Seznam služeb'>
				{services.map(service => {
					const isActive = activeSlug === service.slug;
					const className = cn(styles.item, { [styles.active]: isActive });

					const content = (
						<>
							<Icon
								icon={service.icon}
								size={20}
								className={styles.itemIcon}
							/>
							<span className={styles.label}>{service.title}</span>
							<Icon
								icon='ChevronRight'
								size={16}
								className={styles.chevron}
							/>
						</>
					);

					if (onSelect) {
						return (
							<button
								key={service.id}
								type='button'
								className={className}
								aria-pressed={isActive}
								onClick={() => onSelect(service)}
							>
								{content}
							</button>
						);
					}

					return (
						<Link
							key={service.id}
							to={servicePath(service.slug)}
							className={className}
							aria-current={isActive ? 'page' : undefined}
						>
							{content}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
};

export default ServiceSidebar;
