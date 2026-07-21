import { type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss'
import { Icon } from '@/components/ui/LucidIcon/Icon';
const Logo: FC = () => {
	return (
		<Link to='/' className={styles.logo}>
			<Icon icon='HouseHeart' />
			<span className={styles.logoText}>LOGO</span>
		</Link>
	);
};

export default Logo;
