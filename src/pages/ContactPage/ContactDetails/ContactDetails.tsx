import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import { contacts } from '@/data/contacts.data';
import type { FC } from 'react';
import styles from './ContactDetails.module.scss';

/**
 * Phone, e-mail, address, hours and IČO on the contact page. Until now the page
 * called "Kontakt" carried a form and nothing else — the details existed only
 * in the footer, so anyone arriving from search to look up a number had to
 * scroll past the whole page to find one.
 *
 * Reads the same list as the footer on purpose: a changed phone number cannot
 * end up correct in one place and stale in the other.
 */
const ContactDetails: FC = () => (
	<div className={styles.panel}>
		<Heading className={styles.title}>Kontaktní údaje</Heading>

		<ul className={styles.details}>
			{contacts.map(contact => (
				<li key={contact.label}>
					<span className={styles.icon}>
						<Icon icon={contact.icon} size={18} />
					</span>

					{contact.type === 'link' ? (
						<a href={contact.href}>{contact.label}</a>
					) : (
						<span>{contact.label}</span>
					)}
				</li>
			))}
		</ul>
	</div>
);

export default ContactDetails;
