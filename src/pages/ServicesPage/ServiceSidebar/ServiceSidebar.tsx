import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import { services } from '@/data/services.data';
import type { IService } from '@/types/services.interface';
import cn from 'classnames';
import styles from './ServiceSidebar.module.scss';
interface Props {
	activeId: number;
	onSelect: (service: IService) => void;
}

const ServiceSidebar = ({ activeId, onSelect }: Props) => {
	return (
		<aside className={styles.sidebar}>
			<div className={styles.mainText}>
				<Heading children='Naše služby' className={styles.heading} />

				<p className={styles.description}>
					Vyberte si oblast, která vás zajímá, a zjistěte více.
				</p>
			</div>
			<div className={styles.navWrapper}>
				<nav className={styles.nav}>
					{services.map(service => (
						<Button
						key={service.id}
							onClick={() => onSelect(service)}
							className={cn(
								activeId === service.id ? styles.active : '',
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
