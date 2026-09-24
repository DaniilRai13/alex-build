import { Icon } from '@/components/ui/LucidIcon/Icon';
import { services } from '@/data/services.data';
import cn from 'classnames';
import type { FC } from 'react';
import styles from './ServiceBoardVariant.module.scss';

export type BoardStyle =
	| 'now'
	| 'hairline'
	| 'darkRail'
	| 'redEdge'
	| 'depth'
	| 'band'
	| 'darkHeader'
	| 'ticket';

/**
 * A stand-in for the services board, not the real one: the point is to compare
 * ways of separating it from the page, and each option needs its own styles
 * without touching the component two live pages render.
 *
 * Real copy and icons from services.data, so the widths and line counts match
 * what the decision will actually be applied to.
 */
const ServiceBoardVariant: FC<{ style: BoardStyle }> = ({ style }) => {
	const active = services[0];

	const board = (
		<div className={cn(styles.board, styles[style])}>
			{/* Only variant 6 has one; it spans both columns of the grid. */}
			{style === 'darkHeader' && <div className={styles.header}>Naše služby</div>}

			<aside className={styles.sidebar}>
				<nav className={styles.nav}>
					{services.slice(0, 4).map((service, i) => (
						<span
							key={service.slug}
							className={cn(styles.item, i === 0 && styles.active)}
						>
							<Icon icon={service.icon} size={18} />
							<span className={styles.label}>{service.title}</span>
						</span>
					))}
				</nav>
			</aside>

			<div className={styles.panel}>
				<h3 className={styles.title}>{active.title}</h3>
				<p className={styles.desc}>{active.description}</p>

				<ul className={styles.features}>
					{active.features.map(feature => (
						<li key={feature}>{feature}</li>
					))}
				</ul>

				<div className={styles.actions}>
					<span className={styles.primary}>Více informací</span>
					<span className={styles.secondary}>Zobrazit realizace →</span>
				</div>
			</div>
		</div>
	);

	// Variant 5 changes what is behind the card rather than the card, so it
	// needs the full-width strip around it.
	if (style === 'band') return <div className={styles.bandWrap}>{board}</div>;

	return board;
};

export default ServiceBoardVariant;
