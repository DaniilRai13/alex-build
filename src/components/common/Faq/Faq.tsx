import Heading from '@/components/ui/Heading/Heading';
import { Icon } from '@/components/ui/LucidIcon/Icon';
import type { IFaqItem } from '@/data/faq.data';
import type { FC } from 'react';
import styles from './Faq.module.scss';

interface FaqProps {
	items: IFaqItem[];
	title?: string;
}

/**
 * Questions and answers, as native <details>. No JavaScript and no state: the
 * element is keyboard accessible on its own, and — unlike a collapsed div that
 * a script fills in on click — every answer is present in the prerendered HTML,
 * which is what both a crawler and a visitor with no JS get to read.
 */
const Faq: FC<FaqProps> = ({ items, title = 'Časté dotazy' }) => {
	if (items.length === 0) return null;

	return (
		<section className={styles.faq}>
			<Heading as='h2' className={styles.title}>
				{title}
			</Heading>

			<div className={styles.list}>
				{items.map(item => (
					<details className={styles.item} key={item.q}>
						<summary className={styles.question}>
							{item.q}
							{/* The chevron the rest of the site already uses for
							    expandable things, rather than a bespoke plus sign. */}
							<Icon icon='ChevronDown' size={20} className={styles.marker} />
						</summary>
						<p className={styles.answer}>{item.a}</p>
					</details>
				))}
			</div>
		</section>
	);
};

export default Faq;
