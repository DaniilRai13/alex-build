// import Button from '@/components/ui/Button/Button';

import styles from './ServicePreview.module.scss';
import type { IService } from '@/types/services.interface';
import Heading from '@/components/ui/Heading/Heading';
import Button from '@/components/ui/Button/Button';
import { ROUTES } from '@/config/routes';

// import blueprint from '@/assets/blueprint.png';
interface Props {
	service: IService;
}
const ServicePreview = ({ service }: Props) => {
	return (
		<div className={styles.preview}>
			<div className={styles.overlay}></div>
			<img src={service.img} alt='' className={styles.bg}/>
			<div className={styles.info}>
				<Heading children={service.title} className={styles.heading} />

				<p className={styles.description}>{service.description}</p>

				<ul className={styles.list}>
					{service.features.map(feature => (
						<li key={feature} className={styles.item}>
							{feature}
						</li>
					))}
				</ul>

				<Button
					title='Kontaktujte nás'
					className={styles.button}
					to={ROUTES.CONTACTS}
				/>
			</div>

			{/* <div className={styles.image}>
				<img src={service.img} alt='' />
			</div> */}
		</div>
	);
};

export default ServicePreview;
