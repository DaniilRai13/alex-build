import type { PortfolioCategory } from '@/types/portfolio.interface';
import styles from './PortfolioFilters.module.scss';
import Button from '@/components/ui/Button/Button';

interface Props {
	active: PortfolioCategory;

	onChange(category: PortfolioCategory): void;

	items: {
		id: PortfolioCategory;
		title: string;
	}[];
}

const PortfolioFilters = ({
	active,
	items,
	onChange,
}: Props) => {
	return (
		<div className={styles.filters}>
			{items.map(item => (
				<Button
					key={item.id}
					onClick={() => onChange(item.id)}
					className={`
						${styles.button}
						${active === item.id ? styles.active : ''}
					`}
					title={item.title}
				/>
			))}
		</div>
	);
};

export default PortfolioFilters;