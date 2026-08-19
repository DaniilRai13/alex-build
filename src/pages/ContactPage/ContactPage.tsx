import ContactForm from '@/components/ui/ContactForm/ContactForm';
import Heading from '@/components/ui/Heading/Heading';
import { type FC } from 'react';
import ContactInfo from './WorkProcess/WorkProcess';
import styles from './ContactPage.module.scss';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import Seo from '@/components/common/Seo/Seo';
const ContactPage: FC = () => {
	return (
		<div className={styles.contacts}>
			<Seo
				title='Kontakt'
				description='Kontaktujte nás a nezávazně proberte svůj projekt rekonstrukce. Zanechte poptávku – ozveme se a připravíme řešení na míru.'
				path='/contacts'
			/>
			<div className={styles.contactsInner}>
				<div className={styles.grid}>
					<div className={styles.left}>
						<div className={styles.contactText}>
							<Heading as='h1' className={styles.contactHeading}>
								Kontaktujte nás
							</Heading>
							<Subtitle className={styles.contactSubtitle}>
								Zašlete nám žádost a my probereme váš projekt, harmonogram
								realizace i případné dotazy.
							</Subtitle>
						</div>
						<ContactForm />
					</div>
					<div className={styles.right}>
						<ContactInfo />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
