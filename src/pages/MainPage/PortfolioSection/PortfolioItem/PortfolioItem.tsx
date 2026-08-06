import { type FC } from 'react';
import styles from './PortfolioItem.module.scss';
import type { IPortfolioItems } from '../PortfolioSection';
const PortfolioItem: FC<{ item: IPortfolioItems }> = ({ item }) => {
	return (
		<article className={`${styles.card} ${item.className}`}>
			<img src={item.image} alt={item.title} />
			<div className={styles.overlay}>
				<span>{item.title}</span>
			</div>
		</article>
	);
};

export default PortfolioItem;
