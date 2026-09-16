import Button from '@/components/ui/Button/Button';
import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import { ROUTES } from '@/config/routes';
import type { IFaqItem } from '@/data/faq.data';
import cn from 'classnames';
import type { FC } from 'react';
import styles from './FaqVariants.module.scss';

export type FaqStyle =
	| 'base'
	| 'accent'
	| 'cards'
	| 'numbered'
	| 'dark'
	| 'split'
	| 'editorial';

interface Props {
	items: IFaqItem[];
	variant: FaqStyle;
	title?: string;
}

/**
 * One markup shape for all seven; the differences live in CSS. The two that
 * genuinely need more structure get it: `split` adds the left column, and the
 * numbering in `numbered` comes from a CSS counter rather than an index, so the
 * markup stays identical to the live component.
 */
const FaqVariant: FC<Props> = ({ items, variant, title = 'Časté dotazy' }) => {
	const list = (
		<div className={styles.list}>
			{items.map(item => (
				<details className={styles.item} key={item.q}>
					<summary className={styles.question}>
						<span className={styles.text}>{item.q}</span>
						<span className={styles.marker} aria-hidden='true' />
					</summary>
					<p className={styles.answer}>{item.a}</p>
				</details>
			))}
		</div>
	);

	if (variant === 'split') {
		return (
			<section className={cn(styles.faq, styles.split)}>
				<div className={styles.aside}>
					<Heading as='h2' className={styles.title}>
						{title}
					</Heading>
					<Subtitle className={styles.asideText}>
						Nenašli jste, co jste hledali? Ozvěte se — odpovíme i na to, co tu
						není.
					</Subtitle>
					<Button
						title='Napsat nám'
						className={styles.asideButton}
						to={ROUTES.CONTACTS}
					/>
				</div>
				{list}
			</section>
		);
	}

	return (
		<section className={cn(styles.faq, styles[variant])}>
			<Heading as='h2' className={styles.title}>
				{title}
			</Heading>
			{list}
		</section>
	);
};

export default FaqVariant;
