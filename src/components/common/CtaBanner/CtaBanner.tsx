import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Image from '@/components/ui/Image/Image';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { company } from '@/config/company';
import { ROUTES } from '@/config/routes';
import { houseSketch } from '@/data/services.data';
import type { FC } from 'react';
import styles from './CtaBanner.module.scss';

/** Formats +420774896027 as +420 774 896 027. */
const displayPhone = company.phone.replace(
	/^(\+\d{3})(\d{3})(\d{3})(\d{3})$/,
	'$1 $2 $3 $4',
);

const CtaBanner: FC = () => (
	<section className={styles.cta}>
		<div className={styles.content}>
			<Heading as='h2' className={styles.heading}>
				Máte projekt? Rádi vám pomůžeme.
			</Heading>

			<p className={styles.text}>
				Ozvěte se nám – připravíme nezávaznou konzultaci a cenovou nabídku
				zdarma.
			</p>

			<div className={styles.actions}>
				<Button
					title='Kontaktujte nás'
					className={styles.button}
					to={ROUTES.CONTACTS}
				/>

				<a className={styles.phone} href={`tel:${company.phone}`}>
					<Icon icon='Phone' size={18} />
					{displayPhone}
				</a>
			</div>
		</div>

		{/* Decorative, so alt is empty: the sketch repeats nothing the heading
		    does not already say. */}
		<Image
			className={styles.art}
			src={houseSketch.src}
			srcSet={houseSketch.srcSet}
			alt=''
		/>
	</section>
);

export default CtaBanner;
