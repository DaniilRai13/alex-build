import Heading from '@/components/ui/Heading/Heading';
import Subtitle from '@/components/ui/Subtitle/Subtitle';
import cn from 'classnames';
import type { FC, ReactNode } from 'react';
import styles from './SectionHead.module.scss';

interface Props {
	/** Small red label above the heading: what kind of block this is. */
	eyebrow: string;
	/** The block's statement, as an <h2>. */
	title: ReactNode;
	lead?: ReactNode;
	/** For the space below the head, which depends on what follows it. */
	className?: string;
}

/**
 * Czech typesetting never ends a line on a one-letter preposition or
 * conjunction ("k", "v", "a" …), so each is tied to the word after it with a
 * non-breaking space. Done here because the heads wrap at every width, and
 * a title passed in from another page ("Časté dotazy k realizacím") cannot be
 * expected to remember it.
 */
const bindShortWords = (text: ReactNode) =>
	typeof text === 'string'
		? // A lookbehind, not a captured space: "a v Teplicích" has two in a
			// row, and consuming the first one's space would skip the second.
			text.replace(/(?<=^|\s)([AaIiKkOoSsUuVvZz])\s+/g, '$1 ')
		: text;

/**
 * The head every home page section opens with: eyebrow, heading, description.
 * Each section used to carry its own copy of these three rules, and they had
 * drifted — the portfolio in red spaced capitals, "Jak pracujeme" with no
 * description at all. Chosen on /section-heads (variant 01).
 */
const SectionHead: FC<Props> = ({ eyebrow, title, lead, className }) => (
	<header className={cn(styles.head, className)}>
		<span className={styles.eyebrow}>{eyebrow}</span>
		<Heading className={styles.title}>{bindShortWords(title)}</Heading>
		{lead && <Subtitle className={styles.lead}>{bindShortWords(lead)}</Subtitle>}
	</header>
);

export default SectionHead;
