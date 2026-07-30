import { type FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';
import logo from '@/assets/logo.png';

const Logo: FC = () => {
	return (
		<Link to='/' className={styles.logo} aria-label='KartStav – domů'>
			<img src={logo} alt='KartStav' className={styles.logoImg} />
		</Link>
	);
};

export default Logo;
