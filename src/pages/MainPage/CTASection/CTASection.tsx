import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { ROUTES } from '@/config/routes';
import styles from './CTASection.module.scss';

const CTASection = () => {
	return (
		<section className={styles.cta}>
			<div className={styles.ctaInner}>
				<div className={styles.icon}>
					<Icon icon='Phone' />
				</div>

				<div className={styles.content}>
					<Heading className={styles.CTAHeading}>
						Pojďme společně vytvořit něco výjimečného
					</Heading>

					<p>
						Připraveni proměnit váš prostor? Kontaktujte nás pro bezplatnou
						konzultaci.
					</p>
				</div>
				<Button
					title='Kontaktujte nás'
					className={styles.button}
					to={ROUTES.CONTACTS}
				/>

			</div>
		</section>
	);
};

export default CTASection;
