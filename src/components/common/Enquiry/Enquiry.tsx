import ContactForm from '@/components/ui/ContactForm/ContactForm';
import Heading from '@/components/ui/Heading/Heading';
import type { FC } from 'react';
import styles from './Enquiry.module.scss';

interface Props {
	/** Overrides the default when the page can ask something more specific. */
	title?: string;
	lead?: string;
}

/**
 * The enquiry form where the reading ends. It used to live only on /contacts,
 * so anyone convinced by a service or a project had to go and find it — a
 * navigation step between being persuaded and acting, which is where most of
 * them stopped.
 *
 * Wraps the existing ContactForm untouched. mail.service already posts
 * window.location.pathname with every submission, so the statistics can say
 * which page earned the enquiry without anything being passed down here.
 */
const Enquiry: FC<Props> = ({
	title = 'Máte podobný projekt?',
	lead = 'Napište nám a připravíme nezávaznou cenovou nabídku. Ozveme se do 24 hodin.',
}) => (
	<section className={styles.enquiry}>
		<div className={styles.copy}>
			<Heading as='h2' className={styles.title}>
				{title}
			</Heading>
			<p className={styles.lead}>{lead}</p>
		</div>

		<div className={styles.form}>
			<ContactForm />
		</div>
	</section>
);

export default Enquiry;
