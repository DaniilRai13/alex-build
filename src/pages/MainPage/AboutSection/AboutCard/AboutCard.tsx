import Heading from '@/components/ui/Heading/Heading';
import type { IStatisticsData } from '@/data/statistics.data';
import type { FC } from 'react';
import styles from './AboutCard.module.scss';
const AboutCard: FC<{ item: IStatisticsData }> = ({ item }) => {
	return (
		<div className={styles.card}>
			<div className={styles.content}>
				<Heading as='div' children={item.title} className={styles.cardTitle} />
				<p className={styles.cardSub}>{item.sub} </p>
			</div>
		</div>
	);
};

export default AboutCard;
