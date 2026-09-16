import { Icon } from '@/components/ui/LucidIcon/Icon';
import type { IStatisticsData } from '@/data/statistics.data';
import type { FC } from 'react';
import styles from './AboutCard.module.scss';

/**
 * One figure beside the About copy: icon, the number, what it counts. It used
 * to be a white 250×180 card in a 2×2 block; now the copy owns that column and
 * these sit under it as a compact row, so the card is gone and only the pair
 * remains.
 */
const AboutCard: FC<{ item: IStatisticsData }> = ({ item }) => (
	<div className={styles.stat}>
		<span className={styles.icon}>
			<Icon icon={item.icon} size={20} />
		</span>

		<b className={styles.value}>{item.title}</b>
		<span className={styles.label}>{item.sub}</span>
	</div>
);

export default AboutCard;
