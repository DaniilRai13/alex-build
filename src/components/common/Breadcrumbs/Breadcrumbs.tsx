import type { Crumb } from '@/config/jsonLd';
import cn from 'classnames';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';

interface Props {
	items: Crumb[];
	className?: string;
}

const Breadcrumbs: FC<Props> = ({ items, className }) => (
	<nav
		className={cn(styles.breadcrumbs, className)}
		aria-label='Drobečková navigace'
	>
		<ol className={styles.list}>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<li className={styles.item} key={item.name}>
						{item.href && !isLast ? (
							<Link className={styles.link} to={item.href}>
								{item.name}
							</Link>
						) : (
							<span className={styles.current} aria-current='page'>
								{item.name}
							</span>
						)}
					</li>
				);
			})}
		</ol>
	</nav>
);

export default Breadcrumbs;
